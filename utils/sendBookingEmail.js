const sendEmail = require("./email.js");

const sendBookingEmail = async (userEmail, booking) => {
  const subject = "Car Booking Confirmed 🚗";

  const text = `Your booking is confirmed for ${booking.carId.name}`;

  const html = `
    <h2>Booking Confirmed 🎉</h2>
    <p><b>Car:</b> ${booking.carId.name} (${booking.carId.brand})</p>
    <p><b>Branch:</b> ${booking.branchId.name}</p>
    <p><b>Start Date:</b> ${new Date(booking.startDate).toDateString()}</p>
    <p><b>End Date:</b> ${new Date(booking.endDate).toDateString()}</p>
    <p><b>Status:</b> ${booking.status}</p>
  `;

  await sendEmail(userEmail, subject, text, html);
};

module.exports = sendBookingEmail;