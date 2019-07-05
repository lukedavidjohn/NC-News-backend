process.env.NODE_ENV = 'test'
const { app } = require("../app");
const chai = require("chai");
const expect = chai.expect
chai.use(require('chai-sorted'))
const request = require("supertest")(app);
const { connection } = require("../db/connection");

describe('/api', () => {
    beforeEach(() => {
        return connection.seed.run();
    })
    after(() => {
        connection.destroy();
    })
    it('GET - returns status 200', () => {
        return request
            .get('/api')
            .expect(200)
    })
    it('GET - responds with a JSON of all available endpoints', () => {
        return request
            .get('/api')
            .then(({body}) => {
                expect(body).to.contain.keys('endpoints')
            })
    })
    it('returns 405 for all other methods', () => {
        const invalidMethods = ['delete', 'patch', 'post', 'put'];
        const methodPromises = invalidMethods.map(method => {
            return request[method]('/api')
                .expect(405)
                .then(({body}) => {
                    expect(body.msg).to.equal('method not allowed')
                })
            })
        return Promise.all(methodPromises)
    })
    describe('/topics', () => {
        it('GET topics - returns status 200', () => {
            return request
            .get('/api/topics')
            .expect(200);
        })
        it('GET topics - returns an array of topic-objects with expected keys', () => {
            return request
                .get('/api/topics')
                .then(({body}) => {
                    expect(body.topics).to.be.an('array');
                    expect(body.topics.length).to.be.greaterThan(0);
                    expect(body.topics[0]).to.contain.keys('slug', 'description');
            })
        })
        it('returns 405 for all other methods', () => {
            const invalidMethods = ['delete', 'patch', 'post', 'put'];
            const methodPromises = invalidMethods.map(method => {
                return request[method]('/api/topics')
                    .expect(405)
                    .then(({body}) => {
                        expect(body.msg).to.equal('method not allowed')
                    })
                })
            return Promise.all(methodPromises)
        })
    })
    describe('/users', () => {
        it('GET users by username - returns status 200', () => {
            return request
                .get('/api/users/lurker')
                .expect(200);
        })
        it('GET users by username - returns a user-object with expected keys', () => {
            return request.get('/api/users/lurker')
                .then(({body}) => {
                    expect(body.user).to.be.an('object');
                    expect(body.user).to.contain.keys('username', 'avatar_url', 'name');
                    expect(body.user.username).to.equal('lurker')
            })
        })
        it('GET users by username - returns status 404 if passed non-existing username', () => {
            return request.get('/api/users/smirker')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
                })
        })
        it('returns 405 for all other methods', () => {
            const invalidMethods = ['delete', 'patch', 'post', 'put'];
            const methodPromises = invalidMethods.map(method => {
                return request[method]('/api/users/smirker')
                    .expect(405)
                    .then(({body}) => {
                        expect(body.msg).to.equal('method not allowed')
                    })
                })
            return Promise.all(methodPromises)
        })
    })
    describe('/articles', () => {
        it('GET articles - returns status 200', () => {
            return request
                .get('/api/articles')
                .expect(200)
        })
        it('GET articles - returns an array of article-objects with expected keys, with added comment_count column', () => {
            return request
                .get('/api/articles')
                .then(({body}) => {
                    expect(body.articles[0]).to.contain.keys('title', 'body', 'topic', 'author', 'comment_count')
                    expect(body.articles[0].comment_count).to.equal('13')
                })
        })
        it('GET articles - has a default sort column of "created_at" and order of "desc"', () => {
            return request
                .get('/api/articles')
                .then(({body}) => {
                    expect(body.articles).to.be.descendingBy('created_at')
                })
        })
        it('GET articles - sort column and order can be determined by query', () => {
            return request
                .get('/api/articles?sort_by=topic&order=asc')
                .then(({body}) => {
                    expect(body.articles).to.be.ascendingBy('topic')
                })
        })
        it('GET articles - sorting is case-insensitive', () => {
            return request
                .get('/api/articles?sort_by=TOPIC&order=ASC')
                .then(({body}) => {
                    expect(body.articles).to.be.ascendingBy('topic')
                })
        })
        it('GET articles - can be filtered by author', () => {
            return request
                .get('/api/articles?author=butter_bridge')
                .then(({body}) => {
                    expect(body.articles.length).to.equal(3)
                })
        })
        it('GET articles - author filter is case-insensitive', () => {
            return request
                .get('/api/articles?author=BUTTER_BRIDGE')
                .then(({body}) => {
                    expect(body.articles.length).to.equal(3)
                })
        })
        it('GET articles - can be filtered by topic', () => {
            return request
                .get('/api/articles?topic=cats')
                .then(({body}) => {
                    expect(body.articles.length).to.equal(1)
                })
        })
        it('GET articles - topic filter is case-insensitive', () => {
            return request
                .get('/api/articles?topic=CATS')
                .then(({body}) => {
                    expect(body.articles.length).to.equal(1)
                })
        })
        it('GET articles - has a default response limit of 10 articles', () => {
            return request 
                .get('/api/articles')
                .then(({body}) => {
                    expect(body.articles.length).to.equal(10)
                })
        })
        it('GET articles - response limit can be determined by query', () => {
            return request 
                .get('/api/articles?limit=5')
                .then(({body}) => {
                    expect(body.articles.length).to.equal(5)
                })
        })
        it('GET articles - paginates results when number of responses exceeds limit and p value provided', () => {
            return request
                .get('/api/articles?p=2')
                .then(({body}) => {
                    expect(body.articles.length).to.equal(2)
                    expect(body.articles[0].article_id).to.equal(11)
                })
        })
        it('GET articles - paginates properly with non-default limit value', () => {
            return request
                .get('/api/articles?limit=5&p=3')
                .then(({body}) => {
                    expect(body.articles.length).to.equal(2)
                    expect(body.articles[0].article_id).to.equal(11)
                })
        })
        it('GET articles - returns status 400 if passed invalid sort column', () => {
            return request
                .get('/api/articles?sort_by=cheese&order=asc')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('GET articles - returns status 400 if passed invalid sort order', () => {
            return request
                .get('/api/articles?sort_by=topic&order=left')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('GET articles - returns status 404 if passed non-existing filter author', () => {
            return request
                .get('/api/articles?author=cheese')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
                })
        })
        it('GET articles - returns status 404 if passed non-existing filter topic', () => {
            return request
                .get('/api/articles?topic=cheese')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
                })
        })
        it('returns 405 for all other methods', () => {
            const invalidMethods = ['delete', 'patch', 'post', 'put'];
            const methodPromises = invalidMethods.map(method => {
                return request[method]('/api/articles')
                    .expect(405)
                    .then(({body}) => {
                        expect(body.msg).to.equal('method not allowed')
                    })
                })
            return Promise.all(methodPromises)
        })
    })
    describe('/articles/:article_id', () => {
        it('GET article by article_id - returns status 200', () => {
            return request
                .get('/api/articles/1')
                .expect(200);
        })
        it('GET article by article_id - returns an article-object with expected keys, with added comment_count column', () => {
            return request
                .get('/api/articles/1')
                .then(({body}) => {
                    expect(body.article).to.be.an('object');
                    expect(body.article).to.contain.keys('title', 'body', 'votes', 'topic', 'author', 'comment_count'
                    );
                    expect(body.article.title).to.equal('Living in the shadow of a great man')
                    expect(body.article.comment_count).to.equal('13')
                })
        })
        it('GET article by article_id - returns status 400 if passed invalid article_id', () => {
            return request
                .get('/api/articles/ninetynine')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('GET article by article_id - returns status 404 if passed valid but non-existing article_id', () => {
            return request.get('/api/articles/999999')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
            })
        })
        it('PATCH article by article_id - returns status 200', () => {
            return request
                .patch('/api/articles/1')
                .send({inc_votes: 1})
                .expect(200)
        })
        it('PATCH article by article_id - updates value accordingly and returns article-object', () => {
            return request
                .patch('/api/articles/1')
                .send({inc_votes: 1})
                .then(({body}) => {
                    expect(body.article.votes).to.equal(101)
                })
        })
        it('PATCH article by article_id - returns status 400 if passed invalid article_id', () => {
            return request
                .patch('/api/articles/ninetynine')
                .send({inc_votes: 1})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('PATCH article by article_id - returns status 400 if passed invalid update value', () => {
            return request
                .patch('/api/articles/1')
                .send({inc_votes: 'cheese'})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('PATCH article by article_id - returns status 200 and unchanged article if passed no update value', () => {
            return request
                .patch('/api/articles/1')
                .send({})
                .expect(200)
                .then(({body}) => {
                    expect(body.article.votes).to.equal(100)
                })
        })
        it('PATCH article by article_id - returns status 404 if passed valid but non-existing article_id', () => {
            return request
                .patch('/api/articles/999999')
                .send({inc_votes: 1})
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
                })
        })
        it('returns 405 for all other methods', () => {
            const invalidMethods = ['delete', 'post', 'put'];
            const methodPromises = invalidMethods.map(method => {
                return request[method]('/api/articles/1')
                    .expect(405)
                    .then(({body}) => {
                        expect(body.msg).to.equal('method not allowed')
                    })
                })
            return Promise.all(methodPromises)
        })
    })
    describe.only('/articles/:article_id/comments', () => {
        it('GET comments by article_id - returns status 200', () => {
            return request
                .get('/api/articles/1/comments')
                .expect(200)
        })
        it('GET comments by article_id - returns array of comment-objects with expected keys', () => {
            return request 
                .get('/api/articles/1/comments')
                .then(({body}) => {
                    expect(body.comments[0]).to.contain.keys('author', 'body')
                })
        })
        it('GET comments by article_id - has a default sort column of "created_by" and order of "desc"', () => {
            return request
                .get('/api/articles/1/comments')
                .then(({body}) => {
                    expect(body.comments).to.be.descendingBy('created_at')
                })
        })
        it('GET comments by article_id - sort column and order can be determined by query', () => {
            return request
                .get('/api/articles/1/comments?sort_by=author&order=asc')
                .then(({body}) => {
                    expect(body.comments).to.be.ascendingBy('author')
                })
        })
        it('GET comments by article_id - sorting is case-insensitive', () => {
            return request
                .get('/api/articles/1/comments?sort_by=AUTHOR&order=DESC')
                .then(({body}) => {
                    expect(body.comments).to.be.descendingBy('author')
                })
        })
        it('GET comments by article_id - returns empty array when passed valid article_id with no comments on its foreign key', () => {
            return request
                .get('/api/articles/2/comments')
                .expect(200)
                .then(({body}) => {
                    expect(body.comments).to.eql([])
                })
        })
        it('GET comments by article_id - has a default response limit of 10 comments', () => {
            return request
                .get('/api/articles/1/comments')
                .then(({body}) => {
                    expect(body.comments.length).to.equal(10)
                }) //13
        })
        it('GET comments by article_id - response limit can be determined by query', () => {
            return request
                .get('/api/articles/1/comments?limit=5')
                .then(({body}) => {
                    expect(body.comments.length).to.equal(5)
                })
        })
        it('GET articles - paginates results when number of responses exceeds limit', () => {
            return request
                .get('/api/articles/1/comments?p=2')
                    .then(({body}) => {
                        expect(body.comments.length).to.equal(3)
                        expect(body.comments[0].comment_id).to.equal(12)
                    })
        })
        it('GET articles - paginates properly with non-default limit value', () => {
            return request
                .get('/api/articles/1/comments?limit=5&p=3')
                .then(({body}) => {
                    expect(body.comments.length).to.equal(3)
                    expect(body.comments[0].comment_id).to.equal(12)
                })
        })
        it('GET comments by article_id - returns status 400 if passed invalid article_id', () => {
            return request
                .get('/api/articles/cheese/comments')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('GET comments by article_id - returns status 404 if passed valid but non-existing article_id', () => {
            return request 
                .get('/api/articles/999999/comments')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
                })
        })
        it('GET comments by article_id - returns status 400 if passed invalid sort column', () => {
            return request
                .get('/api/articles/1/comments?sort_by=cheese&order=desc')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('GET comments by article_id - returns status 400 if passed invalid sort order', () => {
            return request
                .get('/api/articles/1/comments?sort_by=author&order=right')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('POST comment by article_id - returns status 201', () => {
            return request
                .post('/api/articles/1/comments')
                .send({
                    username: 'butter_bridge',
                    body: 'here is some text, here is some text'
                })
                .expect(201)
        })
        it('POST comment by article_id - returns posted comment with correctly populated values', () => {
            return request
            .post('/api/articles/1/comments')
            .send({
                username: 'butter_bridge',
                body: 'here is some text, here is some text'
            })
            .then(({body}) => {
                expect(body.comment.comment_id).to.equal(19)
                expect(body.comment.author).to.equal("butter_bridge")
                expect(body.comment.article_id).to.equal(1)
                expect(body.comment.votes).to.equal(0)
                expect(body.comment.created_at).to.not.be.null
                expect(body.comment.body).to.equal('here is some text, here is some text')
                })
        })
        it('POST comment by article_id - returns status 400 if passed invalid article_id', () => {
            return request
                .post('/api/articles/cheese/comments')
                .send({
                    username: 'butter_bridge',
                    body: 'here is some text, here is some text'
                })
                .expect(400)
        })
        it('POST comment by article_id - returns status 400 if passed no post content', () => {
            return request
                .post('/api/articles/1/comments')
                .send({})
                .expect(400)
        })
        it('POST comment by article_id - returns status 400 if passed post content with required column missing', () => {
            return request
                .post('/api/articles/cheese/comments')
                .send({
                    body: 'here is some text, here is some text'
                })
                .expect(400)
        })
        it('POST comment by article_id - returns status 400 if passed post content with non-existing column', () => {
            return request
                .post('/api/articles/cheese/comments')
                .send({
                    username: 'butter_bridge',
                    body: 'here is some text, here is some text',
                    goodness: 0
                })
                .expect(400)
        })
        it('POST comment by article_id - returns status 422 if passed valid but non-existing article_id', () => {
            return request
                .post('/api/articles/999/comments')
                .send({
                    username: 'butter_bridge',
                    body: 'here is some text, here is some text'
                })
                .expect(422)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('unprocessable entity')
                })
        })
        it('returns 405 for all other methods', () => {
            const invalidMethods = ['delete', 'patch', 'put'];
            const methodPromises = invalidMethods.map(method => {
                return request[method]('/api/articles/1/comments')
                    .expect(405)
                    .then(({body}) => {
                        expect(body.msg).to.equal('method not allowed')
                    })
                })
            return Promise.all(methodPromises)
        })
    })
    describe('/comments', () => {
        it('PATCH comment by comment_id - returns status 200', () => {
            return request
                .patch('/api/comments/1')
                .send({
                    inc_votes: 1
                })
                .expect(200)
        })
        it('PATCH comment by comment_id - updates values accordingly and returns comment-object', () => {
            return request
                .patch('/api/comments/1')
                .send({
                    inc_votes: 1
                })
                .then(({body}) => {
                    expect(body.comment.votes).to.equal(17)
                })
        })
        it('PATCH comment by comment_id - returns status 400 if passed invalid comment_id', () => {
            return request
                .patch('/api/comments/ninetynine')
                .send({
                    inc_votes: 1
                })
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('PATCH comment by comment_id - returns status 400 if passed invalid update value', () => {
            return request
                .patch('/api/comments/1')
                .send({
                    inc_votes: 'cheese'
                })
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('PATCH comment by comment_id - returns status 400 if passed no update value', () => {
            return request
                .patch('/api/comments/1')
                .send({})
                .expect(200)
                .then(({body}) => {
                    expect(body.comment.votes).to.equal(16)
                })
        })
        it('PATCH comment by comment_id - returns status 404 if passed valid but non-existing article_id', () => {
            return request
                .patch('/api/comments/999')
                .send({
                    inc_votes: 1
                })
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
                })
        })
        it('DELETE comment by comment_id - returns status 204', () => {
            return request
                .delete('/api/comments/1')
                .expect(204)
        })
        it('DELETE comment by comment_id - returns status 404 when passed valid but non-existing comment_id', () => {
            return request
                .delete('/api/comments/9999')
                .expect(404)
        })
        it('returns 405 for all other methods', () => {
            const invalidMethods = ['get', 'post', 'put'];
            const methodPromises = invalidMethods.map(method => {
                return request[method]('/api/comments/1')
                    .expect(405)
                    .then(({body}) => {
                        expect(body.msg).to.equal('method not allowed')
                    })
                })
            return Promise.all(methodPromises)
        })
    })
})