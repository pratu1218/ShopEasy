
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <AnnouncementBar />
          <Navbar />

          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />

            {/* Product Pages */}
            <Route
              path="/product/:id"
              element={<ProductDetails />}
            />

            {/* Wishlist */}
            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            {/* Checkout */}
            <Route
              path="/checkout"
              element={<Checkout />}
            />

            {/* Order Confirmation */}
            <Route
              path="/order-confirmation/:orderId"
              element={<OrderConfirmation />}
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <main className="status-box">
                  <h1>404 — Page not found</h1>
                  <a href="/">Return home</a>
                </main>
              }
            />
          </Routes>

          <Footer />
          <CartDrawer />

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "#242424",
                color: "#fff"
              }
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
