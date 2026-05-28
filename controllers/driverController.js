const Driver = require("../models/driver");
const Booking = require("../models/booking");

// CREATE DRIVER (ADMIN)
exports.createDriver = async (req, res) => {
  try {
    const driver = await Driver.create({
      name: req.body.name,
      license: req.body.license,
      phone: req.body.phone,
      status: "Available",
    });

    res.status(201).json(driver);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Assign driver to booking
exports.assignDriver = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { driverId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.driverId) {
      return res.status(400).json({
        message: "Driver already assigned",
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        message: "Booking must be confirmed",
      });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    if (driver.status !== "Available") {
      return res.status(400).json({
        message: "Driver not available",
      });
    }

    // Assign driver
    booking.driverId = driverId;
    await booking.save();

    await Driver.findByIdAndUpdate(driverId, {
      status: "On Trip",
      currentBooking: booking._id,
    });

    res.status(200).json({
      message: "Driver assigned successfully",
      booking,
    });

  } catch (error) {
    console.log("Assign error:", error);
    res.status(500).json({ message: error.message });
  }
};
// GET /drivers
exports.getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ status: "Available" });
    res.json( drivers ); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.autoAssignDriver = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // 1. Check booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.driverId) {
      return res.status(400).json({
        message: "Driver already assigned",
      });
    }

    // 2. Atomically find & assign driver
    const driver = await Driver.findOneAndUpdate(
      { status: "Available" }, // filter
      {
        status: "On Trip",
        currentBooking: bookingId,
      },
      { new: true }
    );

    if (!driver) {
      return res.status(400).json({
        message: "No available drivers",
      });
    }

    // 3. Assign driver to booking
    booking.driverId = driver._id;
    booking.status = "confirmed";
    await booking.save();

    res.status(200).json({
      message: "Driver auto-assigned successfully",
      driver,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const autoAssignDriverInternal = async (bookingId) => {
  const driver = await Driver.findOneAndUpdate(
    { status: "Available" },
    {
      status: "On Trip",
      currentBooking: bookingId,
    },
    { new: true }
  );

  if (!driver) return null;

  await Booking.findByIdAndUpdate(bookingId, {
    driverId: driver._id,
    status: "Confirmed",
  });

  return driver;
};

exports.toggleDriverStatus = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.status =
      driver.status === "Available" ? "On Trip" : "Available";

    await driver.save();

    res.json({
      message: "Driver status updated",
      driver,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};