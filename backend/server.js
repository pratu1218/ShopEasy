
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to ShopEasy API!");
});

// Health check route
app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "ShopEasy backend is running!"
    });
});

// Product API routes
app.use("/api/products", productRoutes);

// Order API routes
app.use("/api/orders", orderRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });
