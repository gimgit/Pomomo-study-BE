const Router = require('express').Router()

const { recordStudyTime } = require('./controller/studyTimer')

Router.post('/users/recordTime', recordStudyTime)

module.exports = Router
