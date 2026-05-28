const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { createBooking, getUserBookings, cancelBooking, getSingleCar, deleteBooking, getBookingById } = require("../controllers/bookingController");
const bookingRouter = express.Router();


// Create booking
bookingRouter.post("/create", isAuthenticated, createBooking);

// Get user bookings
bookingRouter.get("/", isAuthenticated, getUserBookings);
bookingRouter.get("/:id",isAuthenticated, getBookingById);
// Cancel booking
bookingRouter.put("/:id/cancel", isAuthenticated, cancelBooking);
bookingRouter.delete('/:id', isAuthenticated,deleteBooking)

module.exports = bookingRouter;