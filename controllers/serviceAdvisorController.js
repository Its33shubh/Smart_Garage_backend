const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ServiceAdvisor = require("../models/ServiceAdvisor");

// Service Advisor Login
const login = async (req, res) => {
  try {
    const { advisorId, name, password } = req.body;

    // Validation
    if (!advisorId || !name || !password) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Advisor ID, Name and Password are required.",
      });
    }

    // Check Service Advisor
    const advisor = await ServiceAdvisor.findOne({
      advisorId: advisorId.trim(),
      name: name.trim(),
    });

    if (!advisor) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Service Advisor not found.",
      });
    }

    // Check Active Status
    if (!advisor.isActive) {
      return res.status(403).json({
        error: true,
        success: false,
        message: "Service Advisor account is inactive.",
      });
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(
      password,
      advisor.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        error: true,
        success: false,
        message: "Invalid Password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: advisor._id,
        advisorId: advisor.advisorId,
        role: advisor.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || "7d",
      }
    );

    return res.status(200).json({
      error: false,
      success: true,
      message: "Service Advisor Login Successfully.",
      token,
      data: {
        id: advisor._id,
        advisorId: advisor.advisorId,
        name: advisor.name,
        role: advisor.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
};