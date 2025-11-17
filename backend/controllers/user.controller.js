const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendPasswordResetEmail } = require("../utils/emailService");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists" 
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword 
    });
    await newUser.save();
    res.status(201).json({ 
      message: "User registered successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Server error" 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        message: "All fields are required" 
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ 
        message: "Invalid credentials" 
      });
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: "Invalid credentials" 
      });
    }
    const payload = {
      id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 12 * 60 * 60 * 1000
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email
      }
    });
  }
  catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ 
        message: "Email is required" 
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }
    const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    
    try {
      await sendPasswordResetEmail(email, resetToken);
      res.status(200).json({
        message: "Password reset link has been sent to your email"
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({
        message: "Failed to send email. Please try again later."
      });
    }
  }
  catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      message: "Server error"
    });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({
        message: "Password is required"
      });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({
      message: "Password reset successful"
    });
  }
  catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      message: "Server error"
    });
  }
}