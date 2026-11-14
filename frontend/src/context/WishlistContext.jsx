import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("shopeasy-wishlist") || "[]"
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "shopeasy-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  const isWishlisted = (productId) =>
    wishlist.some((item) => item._id === productId);

  const toggleWishlist = (product) => {
    if (!product?._id) return;

    if (isWishlisted(product._id)) {
      setWishlist((current) =>
        current.filter((item) => item._id !== product._id)
      );
      return false;
    }

    setWishlist((current) => [...current, product]);
    return true;
  };

  const removeFromWishlist = (productId) => {
    setWishlist((current) =>
      current.filter((item) => item._id !== productId)
    );
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}