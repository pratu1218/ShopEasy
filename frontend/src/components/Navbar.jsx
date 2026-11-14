
import { Link, NavLink } from "react-router-dom";
import {
  ShoppingBag,
  ArrowUpRight,
  Heart
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <header className="site-header">
      <nav className="premium-navbar">

        {/* Brand */}
        <Link to="/" className="brand">
          shop<span>easy</span><b>.</b>
        </Link>

        {/* Main Navigation */}
        <div className="nav-menu">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/shop">
            Shop
          </NavLink>

          <a href="/#about">
            Our Story
          </a>
        </div>

        {/* Navigation Actions */}
        <div className="nav-actions">

          {/* Explore */}
          <Link to="/shop" className="explore-link">
            Explore <ArrowUpRight size={15} />
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="navbar-wishlist"
            aria-label={`Wishlist with ${wishlistCount} saved items`}
          >
            <Heart
              size={19}
              fill={wishlistCount > 0 ? "currentColor" : "none"}
            />

            <span>Wishlist</span>

            {wishlistCount > 0 && (
              <span className="wishlist-nav-count">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Shopping Cart */}
          <button
            className="nav-cart"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open cart with ${cartCount} items`}
          >
            <ShoppingBag size={20} />

            <span>{cartCount}</span>
          </button>

        </div>
      </nav>
    </header>
  );
}
