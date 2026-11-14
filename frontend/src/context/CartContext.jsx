
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const CartContext = createContext(null);

function loadCart() {
  try {
    const saved = localStorage.getItem("shopeasy-cart");
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("shopeasy-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (product.stock <= 0) return false;

    setCart((current) => {
      const existing = current.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return current.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  product.stock
                )
              }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });

    return true;
  };

  const removeFromCart = (id) => {
    setCart((current) =>
      current.filter((item) => item._id !== id)
    );
  };

  const updateQuantity = (id, change) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item._id !== id) return item;

          return {
            ...item,
            quantity: Math.min(
              item.stock,
              item.quantity + change
            )
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
