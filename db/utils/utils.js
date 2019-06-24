const formatDate = list => {
    return list.map(ele => new Date(ele.created_at).toString())
};

const makeRefObj = list => {};

const formatComments = (comments, articleRef) => {};

module.exports = {formatDate, makeRefObj, formatComments}

