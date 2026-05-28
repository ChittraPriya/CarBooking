const express = require('express')
const { register, login, getMe, logoutUser } = require('../controllers/authController.js')
const { isAuthenticated } = require('../middlewares/auth.js')

const authRouter = express.Router()

authRouter.post('/register',register)
authRouter.post('/login',login)

//protected routes
authRouter.get('/getme',isAuthenticated, getMe)
authRouter.post('/logout', logoutUser)

module.exports = authRouter