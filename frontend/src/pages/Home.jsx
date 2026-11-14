
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, MoveUpRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="premium-hero">
        <div className="hero-text">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">
              ✦ THE NEW WAY TO SHOP
            </span>

            <h1>
              Find your
              <br />
              <em>kind of</em>
              <br />
              extraordinary<span className="accent-dot">.</span>
            </h1>

            <p>
              Thoughtfully curated essentials, standout finds,
              and everything in between. Your next favorite
              thing is just a click away.
            </p>

            <Link to="/shop" className="primary-button hero-cta">
              Explore collection
              <ArrowUpRight size={19} />
            </Link>
          </motion.div>

          <div className="hero-bottom-note">
            <span>01 / 03</span>
            <span>DISCOVER MORE <ArrowRight size={15} /></span>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop"
            alt="Curated modern fashion collection"
          />
          <div className="hero-image-label">
            <span>THE EVERYDAY EDIT</span>
            <MoveUpRight size={20} />
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <span>CURATED WITH CARE</span>
        <span>✳</span>
        <span>DESIGNED FOR EVERYDAY</span>
        <span>✳</span>
        <span>DISCOVER SOMETHING NEW</span>
      </section>

      <section className="featured-section">
        <div className="section-top">
          <div>
            <span className="eyebrow">HANDPICKED FOR YOU</span>
            <h2>
              The good <em>stuff.</em>
            </h2>
          </div>

          <Link to="/shop" className="text-link">
            View all products <ArrowUpRight size={18} />
          </Link>
        </div>

        {loading && (
          <div className="product-grid">
            {[1, 2, 3].map((item) => (
              <div className="skeleton-card" key={item} />
            ))}
          </div>
        )}

        {error && (
          <div className="status-box">
            <p>We couldn't load the collection.</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="status-box">
            <h3>Something good is coming.</h3>
            <p>Our collection is being prepared.</p>
          </div>
        )}

        {!loading && !error && (
          <div className="product-grid">
            {products.slice(0, 6).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      <section className="editorial-banner">
        <div>
          <span className="eyebrow">MORE THAN JUST SHOPPING</span>
          <h2>
            A little less ordinary.
            <br />
            <em>A lot more you.</em>
          </h2>
          <p>
            Discover the pieces that make every day feel
            a little more special.
          </p>
          <Link to="/shop" className="light-button">
            Shop the collection <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
