
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/api/products`);

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(
    `${API_BASE_URL}/api/products/${id}`
  );

  if (!response.ok) {
    throw new Error("Product not found");
  }

  return response.json();
}
