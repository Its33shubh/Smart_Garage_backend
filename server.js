require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const customerRoutes = require("./routes/customerRoutes")

const app = express();
const PORT = process.env.PORT || 5000;


// Connect Database
connectDB();


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Test Route
app.get("/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Smart Garage Backend is Working"
    });
});

app.use("/api/customer", customerRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});