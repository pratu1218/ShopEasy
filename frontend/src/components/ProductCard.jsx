
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ShoppingBag,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const {
    isWishlisted,
    toggleWishlist
  } = useWishlist();

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isSaved = isWishlisted(product._id);

  const image =
    product.image ||
    "https://placehold.co/600x600?text=ShopEasy";

  // Add product to cart
  const handleAdd = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to your bag`);
  };

  // Add or remove product from wishlist
  const handleWishlist = () => {
    const added = toggleWishlist(product);

    toast.success(
      added
        ? "Added to your wishlist"
        : "Removed from your wishlist"
    );
  };

  return (
    <motion.article
      className="premium-product-card"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Product Image */}
      <div className="premium-product-image">

        <Link
          to={`/product/${product._id}`}
          aria-label={`View ${product.name}`}
        >
          <img
            src={image}
            alt={product.name || "ShopEasy product"}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                "https://placehold.co/600x600?text=ShopEasy";
            }}
          />
        </Link>

        {/* Category */}
        <span className="product-category">
          {product.category || "Collection"}
        </span>

        {/* Stock Status */}
        {isOutOfStock && (
          <span className="product-category stock-badge">
            Sold Out
          </span>
        )}

        {/* Wishlist Button */}
        <button
          className={`wishlist-button ${
            isSaved ? "is-saved" : ""
          }`}
          onClick={handleWishlist}
          aria-label={
            isSaved
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          title={
            isSaved
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <Heart
            size={19}
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>

        {/* Quick Add Button */}
        <button
          className="quick-add"
          onClick={handleAdd}
          disabled={isOutOfStock}
          aria-label={`Add ${product.name} to cart`}
          title="Add to shopping bag"
        >
          <ShoppingBag size={18} />
        </button>

      </div>

      {/* Product Information */}
      <div className="premium-product-info">

        <Link
          to={`/product/${product._id}`}
          className="product-title-row product-title-link"
        >
          <h3>{product.name}</h3>
          <ArrowUpRight size={17} />
        </Link>

        <p>
          {product.description ||
            "Discover this ShopEasy exclusive."}
        </p>

        {/* Price and Availability */}
        <div className="product-price-row">
          <strong>{formatPrice(product.price)}</strong>

          <span>
            {isOutOfStock
              ? "Sold out"
              : `${product.stock} in stock`}
          </span>
        </div>

      </div>
    </motion.article>
  );
}
