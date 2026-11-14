
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    [products]
  );

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, search, category, sort]);

  return (
    <main className="shop-page">
      <div className="shop-heading">
        <span className="eyebrow">EXPLORE THE COLLECTION</span>
        <h1>Find your <em>favorite.</em></h1>
        <p>Everyday essentials and unexpected discoveries.</p>
      </div>

      <div className="shop-toolbar">
        <div className="shop-search">
          <Search size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="What are you looking for?"
          />
        </div>

        <div className="shop-sort">
          <SlidersHorizontal size={18} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="category-pills">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "selected" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="shop-results">
        <span>
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </span>
      </div>

      {loading && <p className="status-box">Loading collection...</p>}
      {error && <p className="status-box">{error}</p>}

      {!loading && !error && (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="status-box">
          <h3>No products found.</h3>
          <p>Try a different search or category.</p>
        </div>
      )}
    </main>
  );
}
