const express = require("express");
const router = express.Router();

// ADMIN LOGOUT
router.post("/logout", (req, res) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    message: "Admin logged out successfully",
  });
});

module.exports = router;