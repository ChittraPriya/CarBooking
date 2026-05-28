const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/booking"); // ✅ FIXED

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= CREATE ORDER =================
// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        message: "Booking not approved yet",
      });
    }

    // USE FRONTEND FINAL AMOUNT
    const options = {
      amount: amount, // already in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.log("CREATE ORDER ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};
// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: "paid",
      });

      return res.json({
        success: true,
        message: "Payment verified & booking paid",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid signature",
    });
  } catch (err) {
    console.log("VERIFY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
