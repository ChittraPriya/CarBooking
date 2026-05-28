const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // User who booked the car
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //  Car being booked
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    // Pickup & Drop locations
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },

    pickupTime: {
      type: String,
      required: true,
    },

    dropLocation: {
      type: String,
      trim: true,
    },

    // Rental period
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },

    // Pricing
    pricePerDay: {
      type: Number,
      required: true,
    },

    totalDays: {
      type: Number,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    // Booking status
    status: {
      type: String,
      enum: ["pending", "confirmed", "ongoing", "completed", "cancelled"],
      default: "pending",
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "online"],
    },

    // notes
    notes: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
