const formatDate = list => {
    return list.map(({created_at, ...rest}) => ({
        created_at: new Date(created_at), ...rest
    }));
};

const makeRefObj = (list) => {
    const output = {}
    list.map(ele => {
        output[ele.title] = ele.article_id
    })
    return output
}
;

const formatComments = (comments, articleRef) => {
    return comments.map(ele => ({
        body: ele.body,
        article_id: articleRef[ele.belongs_to],
        author: ele.created_by,
        votes: ele.votes,
        created_at: new Date(ele.created_at)
    }))
};

module.exports = {formatDate, makeRefObj, formatComments}
