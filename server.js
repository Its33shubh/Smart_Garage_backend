require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});