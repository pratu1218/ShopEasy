
const express = require("express");
const cors = require("cors");

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

module.exports = app;
