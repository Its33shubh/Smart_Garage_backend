const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

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

module.exports = {
  register
};