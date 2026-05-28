const Driver = require("../models/driver");
const Booking = require("../models/booking");
const Car = require("../models/cars");

// Approve booking
exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({ message: "Already approved" });
    }

    // 🚗 Mark car unavailable
    await Car.findByIdAndUpdate(booking.carId, {
      available: false,
    });

    // ✅ Update booking
    booking.status = "confirmed";
    booking.paymentAllowed = true; // 🔥 IMPORTANT

    // 📩 Notification to user
    booking.notifications.push({
      message: "Booking confirmed. You can proceed to payment.",
      date: new Date(),
    });

    await booking.save();

    res.status(200).json({
      message: "Booking approved + payment enabled",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL BOOKINGS (ADMIN)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId")
      .populate("carId")
      .populate("driverId");

    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "confirmed") {
      await Car.findByIdAndUpdate(booking.carId, {
        available: true
      });

      if (booking.driverId) {
        await Driver.findByIdAndUpdate(booking.driverId, {
          status: "Available",
          currentBooking: null,
        });
      }
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Booking rejected & deleted"
    });

  } catch (err) {
    console.log("Reject error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async(req,res) => {
  try {
    const users = await UserActivation.find().select("-password");
    res.status(200).json({users: users})
  } catch (error) {
    res.status(500).json({message: "Server Error"})
  }
}