const express = require("express");
const { createOrder, verifyPayment } = require("../controllers/paymentController");

const paymentRouter = express.Router();

paymentRouter.post("/create-order", createOrder);
paymentRouter.post("/verify", verifyPayment);

module.exports = paymentRouter;