require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-booking';
const PORT = process.env.PORT || 5000;
const EMAIL_USER = process.env.EMAIL_USER
const GOOGLE_KEY_PASSWORD = process.env.GOOGLE_KEY_PASSWORD
const JWT_SECRET = process.env.JWT_SECRET
const NODE_ENV = process.env.NODE_ENV
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
const CLOUDINARY_CLOUD_NAME=process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY=process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET=process.env.CLOUDINARY_API_SECRET

module.exports = {
    MONGODB_URI,
    PORT,
    EMAIL_USER,
    GOOGLE_KEY_PASSWORD,
    JWT_SECRET,
    NODE_ENV,
    RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
}
