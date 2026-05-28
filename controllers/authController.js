const User = require("../models/user");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email.js");
const jwt = require("jsonwebtoken");
const { NODE_ENV } = require("../utils/config.js");
const { JWT_SECRET } = require("../utils/config.js");

const authController = {
  register: async (req, res) => {
    try {
      //get the details from the request body
      const { name, email, password } = req.body;

      //user is already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User is Already Exists" });
      }

      //encrypt the password
      const hashedPassword = await bcrypt.hash(password, 12);

      //create a new user
      const newUser = new User({ name, email, password: hashedPassword });

      //save the user to the database
      await newUser.save();

      //sent email to the user
      await sendEmail(
        email,
        "Welcome to Our Car Booking & Spare Parts Store",
        `Hello,Welcome to our platform!

            You can now:
                ✔ Book cars (quickly & easily)
                ✔ Explore a wide range of spare parts
                ✔ Get reliable service at your fingertips

            We’re excited to have you with us.

            Happy Driving! 🚘

            Best regards,
            Customer Support Team
`,
      );

      res.status(201).json({ message: "User Registered Successfully" });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      res
        .status(500)
        .json({ message: "Error User Registration", error: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      //check user is exists or not
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Email does not exist" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(500).json({ message: "Invalid Password" });
      }

      //generate a jwt token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" },
      );

      //set a token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, //24hours
      });

      return res.status(200).json({
        message: "Login SuccessFully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.log("Login Error:", error)
      res.status(500).json({ message: "Login Failed", error: error.message });
    }
  },
  getMe: async (req, res) => {
    try {
      //get the user id
      const userId = req.user.id;

      //find the user by id
      const user = await User.findById(userId).select("name email role");

      //if the user does not exits,return no error
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error Fetching", error: error.message });
    }
  },

logoutUser : (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
}
}
module.exports = authController;
