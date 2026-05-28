const { JWT_SECRET } = require("../utils/config")
const User = require('../models/user.js')
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
  }
};
const allowRoles = (roles) => {
  return async (req, res, next) => {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.userData = user; // ✅ DO NOT overwrite req.user
    next();
  };
};

module.exports = {
    isAuthenticated,
    allowRoles
}