const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customer");

// Customer Register
const register = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Check required fields
        if (!name || !password) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Name and Password are required.",
            });
        }

        // Check if customer already exists
        const existingCustomer = await Customer.find({
            name: name.trim(),
        });

        if (existingCustomer.length > 0) {
            return res.status(409).json({
                error: true,
                success: false,
                message: "Customer already registered with this name.",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate Customer ID
        const totalCustomers = await Customer.countDocuments();

        const customerId = `CU${String(totalCustomers + 1).padStart(4, "0")}`;

        // Create Customer
        const customer = await Customer.create({
            customerId,
            name: name.trim(),
            password: hashedPassword,
        });

        return res.status(201).json({
            error: false,
            success: true,
            message: "Customer registered successfully.",
            data: {
                customerId: customer.customerId,
                name: customer.name,
                role: customer.role,
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

//customer login
const login = async (req, res) => {
    try {
        const { customerId, password } = req.body;

        // Validation
        if (!customerId || !password) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Customer ID and Password are required.",
            });
        }

        // Find Customer by Customer ID
        const customer = await Customer.findOne({
            customerId: customerId.trim(),
        });

        if (!customer) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Customer not found.",
            });
        }

        // Check Status
        if (!customer.isActive) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "Your account has been deactivated.",
            });
        }

        // Compare Password
        const isPasswordMatch = await bcrypt.compare(
            password,
            customer.password
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
                id: customer._id,
                customerId: customer.customerId,
                role: customer.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            error: false,
            success: true,
            message: "Customer Login Successfully.",
            token,
            data: {
                id: customer._id,
                customerId: customer.customerId,
                name: customer.name,
                role: customer.role,
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

// Get Customer Profile
// customer/profile  and jWT token 
const getProfile = async (req, res) => {
    try {

        const customer = await Customer.findById(req.user.id).select("-password");

        if (!customer) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Customer not found.",
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            data: customer,
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            success: false,
            message: error.message,
        });
    }
};

// // Update Customer Profile
// const updateProfile = async (req, res) => {
//     try {

//         const { name } = req.body;

//         const customer = await Customer.findById(req.user.id);

//         if (!customer) {
//             return res.status(404).json({
//                 error: true,
//                 success: false,
//                 message: "Customer not found.",
//             });
//         }

//         customer.name = name || customer.name;

//         await customer.save();

//         return res.status(200).json({
//             error: false,
//             success: true,
//             message: "Profile updated successfully.",
//             data: {
//                 customerId: customer.customerId,
//                 name: customer.name,
//                 role: customer.role,
//             },
//         });

//     } catch (error) {
//         return res.status(500).json({
//             error: true,
//             success: false,
//             message: error.message,
//         });
//     }
// };

// Change Customer Password
const changePassword = async (req, res) => {
    try {

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Current Password and New Password are required.",
            });
        }

        const customer = await Customer.findById(req.user.id);

        if (!customer) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Customer not found.",
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            customer.password
        );

        if (!isMatch) {
            return res.status(401).json({
                error: true,
                success: false,
                message: "Current Password is incorrect.",
            });
        }

        customer.password = await bcrypt.hash(newPassword, 10);

        await customer.save();

        return res.status(200).json({
            error: false,
            success: true,
            message: "Password changed successfully.",
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
    getProfile,
    changePassword
}