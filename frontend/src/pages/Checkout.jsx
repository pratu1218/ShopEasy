
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  MapPin,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    cartTotal,
    removeFromCart
  } = useCart();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      toast.error("Your shopping bag is empty");
      return;
    }

    if (loading) return;

    setLoading(true);

    const orderData = {
      customer: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim()
      },
      shippingAddress: {
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim()
      },
      items: cart.map((item) => ({
        product: item._id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(orderData)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to place your order"
        );
      }

      // Clear purchased products from cart
      cart.forEach((item) => {
        removeFromCart(item._id);
      });

      toast.success("Your order has been placed!");

      // Navigate after successful order placement
      void navigate(
        `/order-confirmation/${result.order.orderId}`,
        {
          state: { order: result.order }
        }
      );

    } catch (error) {
      toast.error(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="checkout-empty">
        <ShoppingBag size={45} strokeWidth={1} />
        <h2>Your shopping bag is empty.</h2>
        <p>Add some products before proceeding to checkout.</p>

        <Link to="/shop" className="checkout-back-button">
          Explore Shop <ArrowRight size={17} />
        </Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <Link to="/shop" className="back-link">
        <ArrowLeft size={17} />
        Continue shopping
      </Link>

      <div className="checkout-heading">
        <span className="eyebrow">ALMOST YOURS</span>
        <h1>Checkout<span>.</span></h1>
        <p>Complete your details to place your order.</p>
      </div>

      <div className="checkout-layout">

        {/* Customer Information */}
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span className="checkout-step">01</span>
              <div>
                <h2>Contact information</h2>
                <p>How can we reach you?</p>
              </div>
            </div>

            <div className="checkout-fields">
              <div className="checkout-field full">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  maxLength={100}
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  maxLength={254}
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  pattern="[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number"
                  required
                />
              </div>
            </div>
          </section>

          <div className="checkout-divider" />

          {/* Delivery Address */}
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span className="checkout-step">02</span>
              <div>
                <h2>Delivery address</h2>
                <p>Where should we deliver your order?</p>
              </div>
            </div>

            <div className="checkout-fields">
              <div className="checkout-field full">
                <label htmlFor="address">Street address</label>
                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House number, street, area..."
                  rows={3}
                  autoComplete="street-address"
                  required
                  maxLength={300}
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  autoComplete="address-level2"
                  required
                  maxLength={100}
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  autoComplete="address-level1"
                  required
                  maxLength={100}
                />
              </div>

              <div className="checkout-field full">
                <label htmlFor="pincode">PIN code</label>
                <input
                  id="pincode"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  inputMode="numeric"
                  pattern="[1-9][0-9]{5}"
                  title="Enter a valid 6-digit Indian PIN code"
                  autoComplete="postal-code"
                  required
                />
              </div>
            </div>
          </section>

          <div className="checkout-divider" />

          {/* Payment Method */}
          <section className="checkout-section">
            <div className="checkout-section-heading">
              <span className="checkout-step">03</span>
              <div>
                <h2>Payment method</h2>
                <p>Choose how you want to pay.</p>
              </div>
            </div>

            <div className="cod-option">
              <div className="cod-radio">
                <span />
              </div>

              <div className="cod-information">
                <strong>Cash on Delivery</strong>
                <p>Pay when your order arrives.</p>
              </div>

              <span className="cod-label">COD</span>
            </div>
          </section>

          <button
            type="submit"
            className="primary-button checkout-submit"
            disabled={loading || cart.length === 0}
          >
            {loading
              ? "Placing your order..."
              : "Place Order"}

            {!loading && <ArrowRight size={18} />}
          </button>

          <p className="checkout-secure-note">
            <ShieldCheck size={16} />
            Your order details are securely processed by ShopEasy.
          </p>
        </form>

        {/* Order Summary */}
        <aside className="checkout-summary">
          <div className="summary-heading">
            <div>
              <span className="eyebrow">YOUR SELECTION</span>
              <h2>Order Summary</h2>
            </div>
            <span>{cart.length} items</span>
          </div>

          <div className="summary-products">
            {cart.map((item) => (
              <div
                className="summary-product"
                key={item._id}
              >
                <div className="summary-product-image">
                  <img
                    src={
                      item.image ||
                      "https://placehold.co/120x120?text=ShopEasy"
                    }
                    alt={item.name}
                  />
                  <span>{item.quantity}</span>
                </div>

                <div className="summary-product-info">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>

                <strong>
                  {formatPrice(item.price * item.quantity)}
                </strong>
              </div>
            ))}
          </div>

          <div className="summary-calculation">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>Free</strong>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
          </div>

          <div className="summary-delivery">
            <MapPin size={18} />
            <p>
              Your delivery address will be confirmed when
              you place the order.
            </p>
          </div>
        </aside>

      </div>
    </main>
  );
}
