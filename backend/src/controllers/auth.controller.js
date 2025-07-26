import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ email });

    if (password.length < 6) {
      return res.json(400).json({
        status: "error",
        message: "Password must be at least 6 characters long.",
      });
    }

    if (user) {
      return res.status(400).json({
        status: "error",
        message: "User already exists with this email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        message: "User registered successfully",
        status: "success",
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
        },
      });
    } else {
      return res
        .status(400)
        .send({ message: "User registration failed", status: "error" });
    }
  } catch (error) {
    console.log("Error in register controller:", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found. Please register.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email or password.",
      });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({
      status: "success",
      message: "Logout successful",
    });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
