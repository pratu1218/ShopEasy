
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

export default function CartDrawer() {
  const navigate = useNavigate();

  const {
    cart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart
  } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) return;

    setIsCartOpen(false);

    // Navigation is intentionally not awaited.
    void navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="cart-layer">

          {/* Backdrop */}
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />

          {/* Cart Drawer */}
          <motion.aside
            className="premium-cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >

            {/* Header */}
            <div className="cart-top">
              <div>
                <span className="eyebrow">
                  YOUR SELECTION
                </span>
                <h2>Shopping Bag.</h2>
              </div>

              <button
                className="icon-button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
              >
                <X />
              </button>
            </div>

            {/* Cart Items */}
            <div className="cart-content">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag
                    size={48}
                    strokeWidth={1}
                  />

                  <h3>Your bag is empty.</h3>

                  <p>
                    Something great is waiting for you.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    className="premium-cart-item"
                    key={item._id}
                  >
                    <img
                      src={
                        item.image ||
                        "https://placehold.co/150"
                      }
                      alt={item.name}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://placehold.co/150";
                      }}
                    />

                    <div className="cart-item-details">
                      <h4>{item.name}</h4>

                      <strong>
                        {formatPrice(item.price)}
                      </strong>

                      <div className="cart-item-actions">

                        {/* Quantity Controls */}
                        <div className="qty-control">
                          <button
                            onClick={() =>
                              updateQuantity(item._id, -1)
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            disabled={
                              item.quantity >= item.stock
                            }
                            onClick={() =>
                              updateQuantity(item._id, 1)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Remove Product */}
                        <button
                          className="remove-item"
                          onClick={() =>
                            removeFromCart(item._id)
                          }
                          aria-label="Remove product"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Section */}
            {cart.length > 0 && (
              <div className="cart-checkout">

                <div className="subtotal">
                  <span>Subtotal</span>
                  <strong>
                    {formatPrice(cartTotal)}
                  </strong>
                </div>

                <p>
                  Shipping and taxes calculated at checkout.
                </p>

                <button
                  className="primary-button"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                  <ArrowRight size={17} />
                </button>

              </div>
            )}

          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
