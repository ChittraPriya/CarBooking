require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-booking';
const PORT = process.env.PORT || 5000;
const EMAIL_USER = process.env.EMAIL_USER
const GOOGLE_KEY_PASSWORD = process.env.GOOGLE_KEY_PASSWORD
const JWT_SECRET = process.env.JWT_SECRET
const NODE_ENV = process.env.NODE_ENV

module.exports = {
    MONGODB_URI,
    PORT,
    EMAIL_USER,
    GOOGLE_KEY_PASSWORD,
    JWT_SECRET,
    NODE_ENV
}
