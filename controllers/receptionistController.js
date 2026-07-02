const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Receptionist = require("../models/Receptionist");

const login = async (req, res) => {
  try {
    const { receptionistId, name, password } = req.body;

    // Validation
    if (!receptionistId || !name || !password) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Receptionist ID, Name and Password are required.",
      });
    }

    // Check Receptionist
    const receptionist = await Receptionist.findOne({
      receptionistId: receptionistId.trim(),
      name: name.trim(),
    });

    if (!receptionist) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Receptionist not found.",
      });
    }

    // Check Active Status
    if (!receptionist.isActive) {
      return res.status(403).json({
        error: true,
        success: false,
        message: "Receptionist account is inactive.",
      });
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(
      password,
      receptionist.password
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
        id: receptionist._id,
        receptionistId: receptionist.receptionistId,
        role: receptionist.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || "7d",
      }
    );

    return res.status(200).json({
      error: false,
      success: true,
      message: "Receptionist Login Successfully.",
      token,
      data: {
        id: receptionist._id,
        receptionistId: receptionist.receptionistId,
        name: receptionist.name,
        role: receptionist.role,
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