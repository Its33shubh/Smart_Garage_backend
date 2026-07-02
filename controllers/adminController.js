const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Receptionist = require("../models/Receptionist");


// Register Admin
const register = async (req, res) => {
    try {
        const { adminId, name, password } = req.body;

        // Validation
        if (!adminId || !name || !password) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Admin ID, Name and Password are required.",
            });
        }

        // Check Admin ID
        const existingAdminId = await Admin.findOne({ adminId: adminId.trim() });

        if (existingAdminId) {
            return res.status(409).json({
                error: true,
                success: false,
                message: "Admin ID already exists.",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Admin
        const admin = await Admin.create({
            adminId: adminId.trim(),
            name: name.trim(),
            password: hashedPassword,
        });

        return res.status(201).json({
            error: false,
            success: true,
            message: "Admin registered successfully.",
            data: {
                adminId: admin.adminId,
                name: admin.name,
                role: admin.role,
                isActive: admin.isActive
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

// Admin Login
const login = async (req, res) => {
  try {
    const { adminId, name, password } = req.body;

    // Validation
    if (!adminId || !name || !password) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Admin ID, Name and Password are required.",
      });
    }

    // Find Admin
    const admin = await Admin.findOne({
      adminId: adminId.trim(),
      name: name.trim(),
    });

    if (!admin) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Invalid Admin ID or Name.",
      });
    }

    // Check Status
    if (!admin.isActive) {
      return res.status(403).json({
        error: true,
        success: false,
        message: "Admin account is inactive.",
      });
    }

    // Compare Password
    const isPasswordMatch = await bcrypt.compare(
      password,
      admin.password
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
        id: admin._id,
        adminId: admin.adminId,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn:"7d",
      }
    );

    return res.status(200).json({
      error: false,
      success: true,
      message: "Admin Login Successfully.",
      token,
      data: {
        id: admin._id,
        adminId: admin.adminId,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive
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

//create Receptionist
const createReceptionist = async (req, res) => {
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

    // Check Receptionist ID
    const existingReceptionist = await Receptionist.findOne({
      receptionistId: receptionistId.trim(),
    });

    if (existingReceptionist) {
      return res.status(409).json({
        error: true,
        success: false,
        message: "Receptionist ID already exists.",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Receptionist
    const receptionist = await Receptionist.create({
      receptionistId: receptionistId.trim(),
      name: name.trim(),
      password: hashedPassword,
    });

    return res.status(201).json({
      error: false,
      success: true,
      message: "Receptionist created successfully.",
      data: {
        receptionistId: receptionist.receptionistId,
        name: receptionist.name,
        role: receptionist.role,
        isActive: receptionist.isActive,
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
  register,
  login,
  createReceptionist
};