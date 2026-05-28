const express = require("express");
const {
  assignDriver,
  getAvailableDrivers,
  autoAssignDriver,
  createDriver,
  toggleDriverStatus,
} = require("../controllers/driverController");

const { isAuthenticated } = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/admin");

const driverRoutes = express.Router();

/* PUBLIC (or logged-in users) */
driverRoutes.get("/", getAvailableDrivers);

/* 🔒 ADMIN ONLY */
driverRoutes.post("/", isAuthenticated, isAdmin, createDriver);

driverRoutes.put("/:id/toggle", isAuthenticated, isAdmin , toggleDriverStatus);

driverRoutes.post(
  "/assign-driver/:bookingId",
  isAuthenticated,
  isAdmin,
  assignDriver
);

driverRoutes.post(
  "/auto-assign/:bookingId",
  isAuthenticated,
  isAdmin,
  autoAssignDriver
);

module.exports = driverRoutes;