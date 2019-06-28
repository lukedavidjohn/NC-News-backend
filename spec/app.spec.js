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
    describe('/topics', () => {
        it('GET - returns status 200', () => {
            return request.get('/api/topics').expect(200);
        })
        it('GET - returns an array of topic-objects with correct keys', () => {
            return request.get('/api/topics').then(({body}) => {
                expect(body.topics).to.be.an('array');
                expect(body.topics.length).to.be.greaterThan(0);
                expect(body.topics[0]).to.contain.keys('slug', 'description');
            })
        })
    })
    describe('/users', () => {
        it('GET by username - returns status 200', () => {
            return request.get('/api/users/lurker')
                .expect(200);
        })
        it('GET by username - returns a user-object with correct keys', () => {
            return request.get('/api/users/lurker')
                .then(({body}) => {
                expect(body).to.be.an('object');
                expect(body).to.contain.keys('username', 'avatar_url', 'name');
                expect(body.username).to.equal('lurker')
            })
        })
        it('GET by username - returns status 404 if passed non-existing username', () => {
            return request.get('/api/users/smirker')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).to.equal('not found')
            })
        })
    })
    describe('/articles', () => {
        it('GET - returns status 200', () => {
            return request
                .get('/api/articles')
                .expect(200)
        })
        it('GET - returns an array of article-objects with correct keys, with added comment_count column', () => {
            return request
                .get('/api/articles')
                .then(({body}) => {
                    expect(body[0]).to.contain.keys('title', 'body', 'topic', 'author', 'comment_count')
                    expect(body[0].comment_count).to.equal('13')
                })
        })
        it('GET - has a default sort column of "created_at" and order of "desc"', () => {
            return request
                .get('/api/articles')
                .then(({body}) => {
                    expect(body).to.be.descendingBy('created_at')
                })
        })
        it('GET - sort column and order can be determined by query', () => {
            return request
                .get('/api/articles?sort_by=topic&order=asc')
                .then(({body}) => {
                    expect(body).to.be.ascendingBy('topic')
                })
        })
        it('GET - sorting is case-insensitive', () => {
            return request
                .get('/api/articles?sort_by=TOPIC&order=ASC')
                .then(({body}) => {
                    expect(body).to.be.ascendingBy('topic')
                })
        })
        it('GET - can be filtered by author', () => {
            return request
                .get('/api/articles?author=butter_bridge')
                .then(({body}) => {
                    expect(body.length).to.equal(3)
                })
        })
        it('GET - author filter is case-insensitive', () => {
            return request
                .get('/api/articles?author=BUTTER_BRIDGE')
                .then(({body}) => {
                    expect(body.length).to.equal(3)
                })
        })
        it('GET - can be filtered by topic', () => {
            return request
                .get('/api/articles?topic=cats')
                .then(({body}) => {
                    expect(body.length).to.equal(1)
                })
        })
        it('GET - returns status 400 if passed invalid sort column', () => {
            return request
                .get('/api/articles?sort_by=cheese&order=asc')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('GET - returns status 400 if passed invalid sort order', () => {
            return request
                .get('/api/articles?sort_by=topic&order=left')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('GET - returns status 404 if passed non-existing filter author', () => {
            return request
                .get('/api/articles?author=cheese')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
                })
        })
        it('GET - returns status 404 if passed non-existing filter topic', () => {
            return request
                .get('/api/articles?topic=cheese')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
                })
        })
    })
    describe('/articles/:article_id', () => {
        it('GET by article_id - returns status 200', () => {
            return request
                .get('/api/articles/1')
                .expect(200);
        })
        it('GET by article_id - returns an article-object with correct keys, with added comment_count column', () => {
            return request
                .get('/api/articles/1')
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.contain.keys('title', 'body', 'votes'
                    , 'comment_count'
                    );
                    expect(body.title).to.equal('Living in the shadow of a great man')
                    expect(body.comment_count).to.equal('13')
                })
        })
        it('GET by article_id - returns status 400 if passed invalid article_id', () => {
            return request
                .get('/api/articles/ninetynine')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('GET by article_id - returns status 404 if passed valid but non-existing article_id', () => {
            return request.get('/api/articles/999999')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
            })
        })
        it('PATCH by article_id - returns status 200', () => {
            return request
                .patch('/api/articles/1')
                .send({votes: 1})
                .expect(200)
        })
        // it returns updated comment
        it('PATCH by article_id - updates value accordingly', () => {
            return request
                .patch('/api/articles/1')
                .send({votes: 1})
                .then(({body}) => {
                    expect(body.votes).to.equal(101)
                })
        })
        it('PATCH by article_id - returns status 400 if passed invalid article_id', () => {
            return request
                .patch('/api/articles/ninetynine')
                .send({votes: 1})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('PATCH by article_id - returns status 400 if passed invalid update value', () => {
            return request
                .patch('/api/articles/1')
                .send({votes: 'cheese'})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('PATCH by article_id - returns status 400 if passed no update value', () => {
            return request
                .patch('/api/articles/1')
                .send({})
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('PATCH by article_id - returns status 404 if passed valid but non-existing article_id', () => {
            return request
                .patch('/api/articles/999999')
                .send({votes: 1})
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
                })
        })
    })
    describe('/articles/:article_id/comments', () => {
        it('GET by article_id - returns status 200', () => {
            return request
                .get('/api/articles/1/comments')
                .expect(200)
        })
        it('GET by article_id - returns array of comment-objects with correct keys', () => {
            return request 
                .get('/api/articles/1/comments')
                .then(({body: {comments}}) => {
                    expect(comments[0]).to.contain.keys('author', 'body')
                    expect(comments.length).to.equal(13)
                })
        })
        it('GET by article_id - has a default sort column of "created_by" and order of "asc"', () => {
            return request
                .get('/api/articles/1/comments')
                .then(({body: {comments}}) => {
                    expect(comments).to.be.ascendingBy('created_at')
                })
        })
        it('GET by article_id - sort column and order can be determined by query', () => {
            return request
                .get('/api/articles/1/comments?sort_by=author&order=desc')
                .then(({body: {comments}}) => {
                    expect(comments).to.be.descendingBy('author')
                })
        })
        it('GET by article_id - sorting is case-insensitive', () => {
            return request
                .get('/api/articles/1/comments?sort_by=AUTHOR&order=DESC')
                .then(({body: {comments}}) => {
                    expect(comments).to.be.descendingBy('author')
                })
        })
        it('GET by article_id - returns status 400 if passed invalid article_id', () => {
            return request
                .get('/api/articles/cheese/comments')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('GET by article_id - returns status 404 if passed valid but non-existing article_id', () => {
            return request 
                .get('/api/articles/999999/comments')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).to.equal('not found')
                })
        })
        it('GET by article_id - returns status 400 if passed invalid sort column', () => {
            return request
                .get('/api/articles/1/comments?sort_by=cheese&order=desc')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('GET by article_id - returns status 400 if passed invalid sort order', () => {
            return request
                .get('/api/articles/1/comments?sort_by=author&order=right')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).to.equal('bad request')
                })
        })
        it('POST by article_id - returns status 201', () => {
            return request
                .post('/api/articles/1/comments')
                .send({
                    author: 'butter_bridge',
                    body: 'here is some text, here is some text'
                })
                .expect(201)
        })
        it('POST by article_id - returns posted comment with correctly populated values', () => {
            return request
            .post('/api/articles/1/comments')
            .send({
                author: 'butter_bridge',
                body: 'here is some text, here is some text'
            })
            .then(({body}) => {
                expect(body.comment_id).to.equal(19)
                expect(body.author).to.equal("butter_bridge")
                expect(body.article_id).to.equal(1)
                expect(body.votes).to.equal(0)
                expect(body.created_at).to.not.be.null
                expect(body.body).to.equal('here is some text, here is some text')
                })
        })
        it('POST by article_id - returns status 400 if passed invalid article_id', () => {
            return request
                .post('/api/articles/cheese/comments')
                .send({
                    author: 'butter_bridge',
                    body: 'here is some text, here is some text'
                })
                .expect(400)
        })
        it('POST by article_id - returns status 400 if passed no post content', () => {
            return request
                .post('/api/articles/1/comments')
                .send({})
                .expect(400)
        })
        it('POST by article_id - returns status 400 if passed post content with required column missing', () => {
            return request
                .post('/api/articles/cheese/comments')
                .send({
                    body: 'here is some text, here is some text'
                })
                .expect(400)
        })
        it('POST by article_id - returns status 400 if passed post content with non-existing column', () => {
            return request
                .post('/api/articles/cheese/comments')
                .send({
                    author: 'butter_bridge',
                    body: 'here is some text, here is some text',
                    goodness: 0
                })
                .expect(400)
        })
        it('POST by article_id - returns status 422 if passed valid but non-existing article_id', () => {
            return request
                .post('/api/articles/999/comments')
                .send({
                    author: 'butter_bridge',
                    body: 'here is some text, here is some text'
                })
                .expect(422)
                .then(({body: {msg}}) => {
                    expect(msg).to.equal('unprocessable entity')
                })
        })
    })
    describe.only('/comments', () => {
        it('PATCH by comment_id - returns status 200', () => {
            return request
                .patch('/api/comments/1')
                .send({
                    inc_votes: 1
                })
                .expect(200)
        })
        // it returns updated comment
        it('PATCH by comment_id - updates values accordingly', () => {
            return request
                .patch('/api/comments/1')
                .send({
                    inc_votes: 1
                })
                .then(({body}) => {
                    expect(body.comment.votes).to.equal(17)
                })
        })
    })
})