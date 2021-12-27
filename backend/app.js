require("dotenv").config();
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors());


const Router = require('./routes/router')
app.use('/api', Router)

app.use(express.urlencoded({extended : true}))
app.use('/public', express.static('public'))




module.exports = app;
