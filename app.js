const express = require('express');
const authRouter = require('./routes/authRoutes.js');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const carRouter = require('./routes/carRoutes.js');
const branchRoute = require('./routes/branchRoutes.js');
const bookingRoute = require('./routes/bookingRoutes.js');
const adminRouter = require('./routes/adminRoutes.js');
const driverRoutes = require('./routes/driverRoutes.js');
const paymentRouter = require('./routes/paymentRoute.js');
const adminAuthRouter = require("./routes/adminAuthRoutes");
const offerRouter = require('./routes/offerRoutes.js');

//create an express app
const app = express();

//Middleware to parse the body of incoming request
app.use(express.json())

//Middleware to parse cookies
app.use(cookieParser());

app.use(cors({
    origin:'http://localhost:5173',
    credentials: true
}))

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cars', carRouter);
app.use("/api/v1/admin/auth", adminAuthRouter);
app.use('/api/v1/branch', branchRoute);
app.use('/api/v1/bookings', bookingRoute);
app.use('/api/v1/admin', adminRouter);
app.use("/api/v1/offers", offerRouter);
app.use("/api/v1/drivers", driverRoutes);
app.use('/api/v1/payment', paymentRouter)


module.exports = app