const bcrypt = require("bcrypt");
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

        const customerId = `CUS${String(totalCustomers + 1).padStart(4, "0")}`;

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


module.exports = {
    register
}