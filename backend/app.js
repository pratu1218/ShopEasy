
const express = require("express");
const cors = require("cors");

const app = express();

// Hide Express framework information
app.disable("x-powered-by");

// CORS configuration
const allowedOrigin =
    process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
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
