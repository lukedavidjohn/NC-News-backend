const express = require('express');
const apiRouter = express.Router();
const { articlesRouter } = require('./articlesRouter')
const { commentsRouter } = require('./commentsRouter')
const { topicsRouter } = require('./topicsRouter');
const { usersRouter } = require('./usersRouter')
const { handle405error } = require('../errors')

const fetchEndpoints = () => {

}

const sendEndpoints = (req, res, next) => {
    res.sendFile()
        .then(endpoints => {
            res.status(200).send(endpoints)
        })
        .catch(next)
}

apiRouter
    .route('/')
    .get(sendEndpoints)
    .all(handle405error)

apiRouter.use('/articles', articlesRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/users', usersRouter)

module.exports = { apiRouter };
