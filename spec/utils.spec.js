const { expect } = require('chai');
const { formatDate, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDate', () => {
    it('returns an empty array unchanged', () => {
        expect(formatDate([])).to.eql([])
    })
    it('returns array of one object with its timestamp reformatted as JS date-object', () => {
        const input = [{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100
            }];
        const expected = formatDate(input)
        expect(expected[0].created_at).to.eql(new Date(1542284514171))
    })
    it('works for multiple object arrays', () => {
        const input = [{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100
        },{
            title: 'Eight pug gifs that remind me of mitch',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'some gifs',
            created_at: 1289996514171,
        }];
        const expected = formatDate(input)
        expect(expected[0].created_at).to.eql(new Date(1542284514171))
        expect(expected[1].created_at).to.eql(new Date(1289996514171))
    })
    it('does not mutate the original array', () => {
        const input = [{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100
        },{
            title: 'Eight pug gifs that remind me of mitch',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'some gifs',
            created_at: 1289996514171,
        }]
        formatDate(input)
        expect(input).to.eql([{
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: 1542284514171,
            votes: 100
        },{
            title: 'Eight pug gifs that remind me of mitch',
            topic: 'mitch',
            author: 'icellusedkars',
            body: 'some gifs',
            created_at: 1289996514171,
        }])
    })
})

describe('makeRefObj', () => {
    it('returns empty array unchanged', () => {
        expect(makeRefObj([])).to.eql({})
    })
    it('makes a reference object from a one-object array', () => {
        const input = [{
            article_id: 1,
            title: "They're not exactly dogs, are they?",
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'Well? Think about it.',
            created_at: 533132514171,
            votes: 0
        }];
        expect(makeRefObj(input)).to.eql({"They're not exactly dogs, are they?": 1})
    })
    it('works for multiple-object arrays', () => {
        const input = [{
            article_id: 1,
            title: "They're not exactly dogs, are they?",
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'Well? Think about it.',
            created_at: 533132514171,
            votes: 0
        },
        {
            article_id: 2,
            title: 'Seven inspirational thought leaders from Manchester UK',
            topic: 'mitch',
            author: 'rogersop',
            body: "Who are we kidding, there is only one, and it's Mitch!",
            created_at: 406988514171,
            votes: 0
          }
        ];
        expect(makeRefObj(input)).to.eql({"They're not exactly dogs, are they?": 1, "Seven inspirational thought leaders from Manchester UK": 2})
    })
    it('does not mutate the original array', () => {
        const input = [{
            article_id: 1,
            title: "They're not exactly dogs, are they?",
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'Well? Think about it.',
            created_at: 533132514171,
            votes: 0
        },
        {
            article_id: 2,
            title: 'Seven inspirational thought leaders from Manchester UK',
            topic: 'mitch',
            author: 'rogersop',
            body: "Who are we kidding, there is only one, and it's Mitch!",
            created_at: 406988514171,
            votes: 0
          }
        ];
        makeRefObj(input)
        expect(input).to.eql([{
            article_id: 1,
            title: "They're not exactly dogs, are they?",
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'Well? Think about it.',
            created_at: 533132514171,
            votes: 0
        },
        {
            article_id: 2,
            title: 'Seven inspirational thought leaders from Manchester UK',
            topic: 'mitch',
            author: 'rogersop',
            body: "Who are we kidding, there is only one, and it's Mitch!",
            created_at: 406988514171,
            votes: 0
          }
        ])
    })
})

describe('formatComments', () => {
    it('returns an empty array unchanged', () => {
        expect(formatComments([], {})).to.eql([])
    })
    it('correctly formats a one-object array', () => {
        const input = [{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389
        }]
        const articleLookup = {"They're not exactly dogs, are they?": 1}
        expect(formatComments(input, articleLookup)).to.eql([{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 1,
            author: 'butter_bridge',
            votes: 16,
            created_at: new Date(1511354163389)
        }])
    })
    it('correctly formats a multi-object array', () => {
        const input = [{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389
        },{
            body:
              'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
            belongs_to: 'Living in the shadow of a great man',
            created_by: 'someone_else',
            votes: 14,
            created_at: 1479818163389,
          }]
        const articleLookup = {"They're not exactly dogs, are they?": 1, 'Living in the shadow of a great man': 2}
        expect(formatComments(input, articleLookup)).to.eql([{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 1,
            author: 'butter_bridge',
            votes: 16,
            created_at: new Date(1511354163389)
        },{
            body:
            'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
            article_id: 2,
            author: 'someone_else',
            votes: 16,
            created_at: new Date(1479818163389)
        }])
    })
    it('does not mutate the array', () => {
        const input = [{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389
        },{
            body:
              'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
            belongs_to: 'Living in the shadow of a great man',
            created_by: 'someone_else',
            votes: 14,
            created_at: 1479818163389,
          }]
        const articleLookup = {"They're not exactly dogs, are they?": 1, 'Living in the shadow of a great man': 2}
        formatComments(input, articleLookup)
        expect(input).to.eql([{
            body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16,
            created_at: 1511354163389
        },{
            body:
              'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
            belongs_to: 'Living in the shadow of a great man',
            created_by: 'someone_else',
            votes: 14,
            created_at: 1479818163389,
          }])
    })
});