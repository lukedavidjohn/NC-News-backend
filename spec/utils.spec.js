const { expect } = require('chai');
const { formatDate, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDate', () => {
    it('returns an empty object when passed empty array', () => {
        expect(formatDate([])).to.eql([])
    })
    it('returns array of one SQL timestamp reformatted as JS date-object', () => {
        const input = [{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
        }];
        expect(formatDate(input)).to.eql(['Wed Nov 22 2017 12:36:03 GMT+0000 (Greenwich Mean Time)'])
    })
    it('works for multiple date-objects', () => {
        const input = [{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
        },{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
        }]
        expect(formatDate(input)).to.eql(['Wed Nov 22 2017 12:36:03 GMT+0000 (Greenwich Mean Time)', 'Wed Nov 22 2017 12:36:03 GMT+0000 (Greenwich Mean Time)'])
    })
    it('does not mutate the original array', () => {
        const input = [{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
        },{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
        }]
        formatDate(input)
        expect(input).to.eql([{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
        },{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389,
        }])
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