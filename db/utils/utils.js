const formatDate = list => {
    if (!list.length) return [];
    const workList = list.map(ele => new Date(ele.split('').slice(0,10).join('')));
    return workList.map(ele => ele.getTime());
};

const makeRefObj = list => {};

const formatComments = (comments, articleRef) => {};

module.exports = {formatDate, makeRefObj, formatComments}

