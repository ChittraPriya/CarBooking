const express = require('express');
const authRouter = require('./routes/authRoutes.js');

//create an express app
const app = express();

//Middleware to parse the body of incoming request
app.use(express.json())

app.use('/api/v1/auth', authRouter)

module.exports = app