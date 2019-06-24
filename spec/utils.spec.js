const { expect } = require('chai');
const { formatDate, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDate', () => {
    it('returns an empty object when passed empty array', () => {
        expect(formatDate([])).to.eql([])
    })
    it('returns array of one SQL timestamp reformatted as JS date-object', () => {
        expect(formatDate(['2019-06-24 16:25:53.629092+01'])).to.eql([1561334400000])
    })
    it('works for multiple date-objects', () => {
        expect(formatDate(['2019-06-24 16:25:53.629092+01', '2019-06-24 16:25:53.629092+01'])).to.eql([1561334400000, 1561334400000])
    })
    it('does not mutate the original array', () => {
        const input = []
        formatDate(input)
        expect(input).to.eql([])
    })
})

// take an array (list) and return new array
// each item in new array should have its timestamp converted to JS date object

describe('makeRefObj', () => {});

// take an array (list) of article-objects and return ref object
// ref obj keys should be article title, value article id

describe('formatComments', () => {});

// takes array of comment-objects
// created by renamed to author
// belongs to renamed to article_id
// article id must correspond to original title value provided
// created at reformatted as JS date-object