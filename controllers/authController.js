const User = require("../models/user");
const bcrypt = require("bcrypt");
const sendEmail = require('../utils/email.js')

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
      res
        .status(500)
        .json({ message: "Error User Registration", error: error.message });
    }
  },
  login: async(req,res) => {
    try {

      const {email, password} = req.body;

      //check user is exists or not
      const user =await User.findOne({email})

      if(!user) {
        res.status(500).json({message: 'Email is not Exists'})
      }

      const isMatch = await bcrypt.compare(password, user.password) 

      if(!isMatch){
        return res.status(500).json({message: "Invalid Password"})
      }

      return res.status(200).json({message:'Login SuccessFully'})
      
    } catch (error) {
       res
        .status(500)
        .json({ message: "Login Failed", error: error.message });
    }
  }
};

module.exports = authController;
