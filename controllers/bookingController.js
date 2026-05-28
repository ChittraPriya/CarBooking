const Booking = require("../models/booking");
const Car = require("../models/cars");
const Driver = require("../models/driver");

const autoAssignDriverInternal = async (bookingId) => {
  const driver = await Driver.findOneAndUpdate(
    { status: "Available" },
    {
      status: "On Trip",
      currentBooking: bookingId,
    },
    { new: true },
  );

  if (!driver) return null;

  await Booking.findByIdAndUpdate(bookingId, {
    driverId: driver._id,
    // ❌ DO NOT change status here
  });

  return driver;
};

exports.createBooking = async (req, res) => {
  try {
    const {
      carId,
      pickupLocation,
      dropLocation,
      startDate,
      endDate,
      pickupTime,
    } = req.body;

    const userId = req.user.id;

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const pricePerDay = car.price || car.pricePerDay;

    if (!pricePerDay) {
      return res.status(400).json({
        message: "Car price missing in database",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!startDate || !endDate || end < start) {
      return res.status(400).json({
        message: "Invalid dates",
      });
    }

    const totalDays = Math.max(
      1,
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
    );

    const totalPrice = totalDays * pricePerDay;

    const booking = await Booking.create({
      userId,
      carId,
      pickupLocation,
      dropLocation,
      startDate,
      endDate,
      pickupTime,
      pricePerDay,
      totalDays,
      totalPrice,

      // ✅ IMPORTANT FIX
      status: "pending",
      paymentStatus: "pending",
      driverId: null,
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.log("CREATE BOOKING ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
// ===============================
// GET USER BOOKINGS
// ===============================
exports.getUserBookings = async (req, res) => {
  try {
    //check if user is coming from token
    console.log("REQ.USER:", req.user);

    const userId = req.user.id;

    // confirm userId used in query
    console.log("USER ID USED:", userId);

    const bookings = await Booking.find({ userId })
      .populate("carId", "name brand image pricePerDay")
      .populate("driverId", "name phone license")
      .populate("userId", "name email");

    //  check what DB returns
    console.log("BOOKINGS FOUND:", bookings);

    return res.status(200).json(bookings);

  } catch (error) {
    console.log("GET BOOKINGS ERROR:", error); // optional debug

    return res.status(500).json({
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};
// GET SINGLE BOOKING
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("carId")
      .populate("userId")
      .populate("driverId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Cannot cancel completed booking",
      });
    }

    const previousStatus = booking.status;

    booking.status = "cancelled";
    await booking.save();

    // restore only if active booking
    if (previousStatus === "confirmed" || previousStatus === "ongoing") {
      await Car.findByIdAndUpdate(booking.carId, {
        available: true,
      });

      if (booking.driverId) {
        await Driver.findByIdAndUpdate(booking.driverId, {
          status: "Available",
          currentBooking: null,
        });
      }
    }

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error cancelling booking",
      error: error.message,
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔥 restore car if needed
    if (booking.status === "confirmed" || booking.status === "ongoing") {
      await Car.findByIdAndUpdate(booking.carId, {
        available: true,
      });
    }

    // 🔥 restore driver if assigned
    if (booking.driverId) {
      await Driver.findByIdAndUpdate(booking.driverId, {
        status: "Available",
        currentBooking: null,
      });
    }

    await Booking.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting booking",
      error: error.message,
    });
  }
};