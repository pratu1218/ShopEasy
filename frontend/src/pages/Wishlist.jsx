
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to your bag`);
  };

  const handleRemove = (product) => {
    removeFromWishlist(product._id);
    toast.success("Removed from your wishlist");
  };

  return (
    <main className="wishlist-page">
      <div className="wishlist-heading">
        <div>
          <span className="eyebrow">YOUR PERSONAL COLLECTION</span>
          <h1>Things you <em>love.</em></h1>
          <p>
            Keep your favourite finds close until you're ready.
          </p>
        </div>

        <div className="wishlist-count">
          <Heart size={17} />
          {wishlist.length} saved
        </div>
      </div>

      {wishlist.length === 0 ? (
        <section className="wishlist-empty">
          <div className="wishlist-empty-icon">
            <Heart size={30} />
          </div>

          <h2>Your wishlist is waiting.</h2>

          <p>
            Save the pieces you love and they'll be waiting here
            whenever you return.
          </p>

          <Link to="/shop" className="wishlist-shop-link">
            Explore the collection <ArrowRight size={17} />
          </Link>
        </section>
      ) : (
        <section className="wishlist-grid">
          {wishlist.map((product) => (
            <article className="wishlist-card" key={product._id}>
              <Link
                to={`/product/${product._id}`}
                className="wishlist-image"
              >
                <img
                  src={
                    product.image ||
                    "https://placehold.co/600x600?text=ShopEasy"
                  }
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      "https://placehold.co/600x600?text=ShopEasy";
                  }}
                />
              </Link>

              <div className="wishlist-card-info">
                <span className="wishlist-category">
                  {product.category || "Collection"}
                </span>

                <Link
                  to={`/product/${product._id}`}
                  className="wishlist-product-name"
                >
                  {product.name}
                </Link>

                <strong>{formatPrice(product.price)}</strong>

                <div className="wishlist-actions">
                  <button
                    className="wishlist-cart-button"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingBag size={16} />
                    {product.stock <= 0 ? "Sold out" : "Add to bag"}
                  </button>

                  <button
                    className="wishlist-remove-button"
                    onClick={() => handleRemove(product)}
                    aria-label={`Remove ${product.name}`}
                    title="Remove"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
