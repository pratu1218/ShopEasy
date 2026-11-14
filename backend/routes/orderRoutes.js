
const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

// CREATE NEW ORDER
router.post("/", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      customer,
      shippingAddress,
      items
    } = req.body;

    // Basic validation
    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Please provide all required order details."
      });
    }

    // Validate and combine duplicate product IDs
    const quantities = new Map();

    for (const item of items) {
      if (
        !mongoose.isValidObjectId(item.product) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Invalid product or quantity."
        });
      }

      const id = String(item.product);
      quantities.set(
        id,
        (quantities.get(id) || 0) + item.quantity
      );
    }

    let createdOrder;

    await session.withTransaction(async () => {
      const orderItems = [];
      let subtotal = 0;

      for (const [productId, quantity] of quantities) {
        const product = await Product.findOneAndUpdate(
          {
            _id: productId,
            stock: { $gte: quantity }
          },
          {
            $inc: { stock: -quantity }
          },
          {
            new: true,
            session
          }
        );

        if (!product) {
          throw new Error(
            `Product unavailable or insufficient stock: ${productId}`
          );
        }

        const itemTotal = product.price * quantity;
        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity
        });
      }

      const [order] = await Order.create(
        [
          {
            orderId: `SE-${Date.now()}-${Math.floor(
              Math.random() * 1000
            )}`,
            customer,
            shippingAddress,
            items: orderItems,
            subtotal,
            total: subtotal,
            paymentMethod: "COD",
            paymentStatus: "Pending",
            orderStatus: "Placed"
          }
        ],
        { session }
      );

      createdOrder = order;
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order: createdOrder
    });
  } catch (error) {
    console.error("Order creation error:", error);

    res.status(400).json({
      message: error.message || "Unable to place order."
    });
  } finally {
    await session.endSession();
  }
});

// GET ALL ORDERS (DEMO / ADMIN)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders."
    });
  }
});

// GET ORDER BY ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.id
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found."
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order."
    });
  }
});

module.exports = router;
