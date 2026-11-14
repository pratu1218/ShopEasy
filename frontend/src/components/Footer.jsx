
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="premium-footer" id="about">
      <div className="footer-top">
        <div>
          <span className="eyebrow">THE SHOPEASY EXPERIENCE</span>
          <h2>
            Good things.
            <br />
            Better living.
          </h2>
        </div>

        <Link to="/shop" className="footer-shop">
          Explore the collection <ArrowUpRight size={20} />
        </Link>
      </div>

      <div className="footer-bottom">
        <span className="footer-brand">shopeasy.</span>
        <p>Curated for the everyday extraordinary.</p>
        <span>© 2026 ShopEasy</span>
      </div>
    </footer>
  );
}
