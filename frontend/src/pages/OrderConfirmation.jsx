
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  MapPin,
  ShoppingBag,
  ArrowRight
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(
    location.state?.order?.orderId === orderId
      ? location.state.order
      : null
  );

  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order) return;

    let active = true;

    fetch(
      `${API_BASE_URL}/api/orders/${encodeURIComponent(orderId)}`
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Order not found");
        }

        return data;
      })
      .then((data) => {
        if (active) setOrder(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId, order]);

  if (loading) {
    return (
      <main className="status-box">
        Loading your order...
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="status-box">
        <h2>Order unavailable</h2>
        <p>{error || "We couldn't find this order."}</p>
        <Link to="/shop">Return to Shop</Link>
      </main>
    );
  }

  return (
    <main className="confirmation-page">
      <section className="confirmation-success">
        <div className="confirmation-icon">
          <CheckCircle2 size={42} />
        </div>

        <span className="eyebrow">ORDER CONFIRMED</span>

        <h1>Thank you for <em>your order.</em></h1>

        <p>
          Your order has been placed successfully.
          We appreciate you shopping with ShopEasy.
        </p>

        <div className="confirmation-order-id">
          <span>ORDER NUMBER</span>
          <strong>{order.orderId}</strong>
        </div>
      </section>

      <div className="confirmation-layout">
        <section className="confirmation-card">
          <div className="confirmation-card-heading">
            <Package size={20} />
            <h2>Order details</h2>
          </div>

          {order.items.map((item, index) => (
            <div
              className="confirmation-product"
              key={`${item.product}-${index}`}
            >
              <img
                src={
                  item.image ||
                  "https://placehold.co/100x100?text=ShopEasy"
                }
                alt={item.name}
              />

              <div>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
              </div>

              <strong>
                {formatPrice(item.price * item.quantity)}
              </strong>
            </div>
          ))}

          <div className="confirmation-total">
            <span>Total paid on delivery</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </section>

        <section className="confirmation-card">
          <div className="confirmation-card-heading">
            <MapPin size={20} />
            <h2>Delivery information</h2>
          </div>

          <div className="confirmation-address">
            <strong>{order.customer.name}</strong>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </p>
            <p>{order.customer.phone}</p>
            <p>{order.customer.email}</p>
          </div>

          <div className="confirmation-status">
            <div>
              <span>Order status</span>
              <strong>{order.orderStatus}</strong>
            </div>

            <div>
              <span>Payment method</span>
              <strong>Cash on Delivery</strong>
            </div>

            <div>
              <span>Payment status</span>
              <strong>{order.paymentStatus}</strong>
            </div>
          </div>
        </section>
      </div>

      <Link to="/shop" className="confirmation-shop-link">
        <ShoppingBag size={17} />
        Continue shopping
        <ArrowRight size={17} />
      </Link>
    </main>
  );
}
