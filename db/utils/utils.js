const formatDate = list => {
    return list.map(({created_at, ...rest}) => ({
        created_at: new Date(created_at), ...rest
    }));
};

const makeRefObj = (list) => {
    return list.reduce((acc, cur)=>{
        acc[cur.title] = cur.article_id
        return acc
    },{})
};

const formatComments = (comments, articleRef) => {
    return comments.map(({created_at, created_by, belongs_to, ...rest}) => ({
        article_id: articleRef[belongs_to],
        author: created_by,
        created_at: new Date(created_at),
        ...rest,
    }))
};

module.exports = {formatDate, makeRefObj, formatComments}
