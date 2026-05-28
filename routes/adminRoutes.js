const express = require('express');
const { isAdmin } = require('../middlewares/admin');
const { approveBooking, rejectBooking, getAllBookings, getAllUsers } = require('../controllers/adminController');
const { assignDriver, getAvailableDrivers, autoAssignDriver, createDriver } = require('../controllers/driverController');

const { isAuthenticated } = require('../middlewares/auth');

const adminRouter = express.Router();

adminRouter.use(isAuthenticated); // apply globally

adminRouter.get("/users",isAdmin, getAllUsers);

adminRouter.put('/:id/approve', isAdmin, approveBooking);
adminRouter.get('/bookings', isAdmin, getAllBookings)
adminRouter.put('/:id/reject', isAdmin, rejectBooking);


/* ================= DRIVERS ================= */
adminRouter.get("/drivers", getAvailableDrivers);
adminRouter.get("/drivers", createDriver)
adminRouter.post("/assign-driver/:bookingId", assignDriver);
adminRouter.post("/auto-assign/:bookingId", autoAssignDriver);

module.exports= adminRouter