
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck
} from "lucide-react";
import toast from "react-hot-toast";

import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const {
    isWishlisted,
    toggleWishlist
  } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError("");
    setProduct(null);

    getProductById(id)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);

  // Add product to shopping cart
  const handleAdd = () => {
    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    addToCart(product);
    toast.success("Added to your shopping bag");
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

  // Loading State
  if (loading) {
    return (
      <div className="status-box">
        Loading product...
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="status-box">
        <h2>Product unavailable</h2>
        <p>
          {error || "This product could not be found."}
        </p>
        <Link to="/shop">Return to Shop</Link>
      </div>
    );
  }

  const saved = isWishlisted(product._id);
  const isOutOfStock = product.stock <= 0;

  return (
    <main className="product-details-page">

      {/* Back Navigation */}
      <Link to="/shop" className="back-link">
        <ArrowLeft size={17} />
        Back to collection
      </Link>

      <div className="product-details-layout">

        {/* Product Image */}
        <div className="details-image">
          <img
            src={
              product.image ||
              "https://placehold.co/700x700?text=ShopEasy"
            }
            alt={product.name}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                "https://placehold.co/700x700?text=ShopEasy";
            }}
          />
        </div>

        {/* Product Information */}
        <div className="details-info">

          <span className="eyebrow">
            {product.category || "ShopEasy Collection"}
          </span>

          <h1>{product.name}</h1>

          <h2>{formatPrice(product.price)}</h2>

          <div className="details-divider" />

          <p className="details-description">
            {product.description ||
              "Discover something extraordinary with this carefully selected ShopEasy product."}
          </p>

          {/* Stock Information */}
          <p
            className="details-stock"
            style={{
              color: isOutOfStock ? "#c45b4b" : "#56845f"
            }}
          >
            {isOutOfStock
              ? "Currently out of stock"
              : `${product.stock} items available`}
          </p>

          {/* Add to Cart */}
          <button
            className="primary-button details-add"
            onClick={handleAdd}
            disabled={isOutOfStock}
          >
            <ShoppingBag size={18} />

            {isOutOfStock
              ? "Sold out"
              : "Add to shopping bag"}
          </button>

          {/* Wishlist Button */}
          <button
            className={`details-wishlist ${
              saved ? "is-saved" : ""
            }`}
            onClick={handleWishlist}
          >
            <Heart
              size={18}
              fill={saved ? "currentColor" : "none"}
            />

            {saved
              ? "Saved to Wishlist"
              : "Add to Wishlist"}
          </button>

          {/* Product Benefits */}
          <div className="details-benefits">

            <div>
              <ShoppingBag size={19} />
              <span>Carefully curated collection</span>
            </div>

            <div>
              <Heart size={19} />
              <span>Discover products you'll love</span>
            </div>

            <div>
              <ShieldCheck size={19} />
              <span>Secure shopping experience</span>
            </div>

            <div>
              <Truck size={19} />
              <span>Convenient shopping experience</span>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
