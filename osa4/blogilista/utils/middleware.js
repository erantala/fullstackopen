const logger = require('./logger')
const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
    if (process.env.NODE_ENV === 'test') {
        return next()
    }
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } else if (error.name === 'MongoServerError') {
        if (error.errmsg && error.errmsg.startsWith('E11000 duplicate key error collection')) {
            return response.status(400).json({error: 'expected `username` to be unique'})
        } else {
            return response.status(400).json({error: 'unexpected Mongo server error'})
        }
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({error: 'invalid JsonWebToken'})
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {
    let authorizationHeaderContent = request.get('authorization')
    if (authorizationHeaderContent && authorizationHeaderContent.startsWith('Bearer ')) {
        authorizationHeaderContent = authorizationHeaderContent.replace('Bearer ', '')
    } else {
        request.token = null
        return next()
    }

    request.token = jwt.verify(authorizationHeaderContent, process.env.SECRET)
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor
}