/**
 * EXAMPLE: Production-Ready Axios Usage with JWT Authentication
 */

import React, { useEffect, useState } from "react";
import { productApiService, authApiService, APIError } from "@/lib/api-service";

// ============================================================================
// EXAMPLE 1: Get All Products (Protected Endpoint)
// ============================================================================
export async function exampleGetAllProducts() {
  try {
    console.log("📦 Fetching all products from /api/adminproduct...");
    const products = await productApiService.getAllProducts();
    console.log("✅ Success! Products:", products);
    return products;
  } catch (error) {
    if (error instanceof APIError) {
      console.error(`❌ API Error [${error.status}]: ${error.message}`);

      switch (error.status) {
        case 401:
          console.warn("🔐 Unauthorized: token missing / expired / invalid");
          console.warn("💡 Try logging in again");
          break;
        case 403:
          console.warn("🚫 Forbidden: insufficient permissions (role issue)");
          break;
        case 500:
          console.error("💥 Backend server error");
          break;
        case 0:
          console.error("🌐 Network error - backend unreachable at https://localhost:7038");
          break;
      }
    }
    throw error;
  }
}

// ============================================================================
// EXAMPLE 2: Login and Get Token
// ============================================================================
export async function exampleAdminLogin(email: string, password: string) {
  try {
    console.log("🔐 Attempting admin login...");
    const response = await authApiService.adminLogin(email, password);

    console.log("✅ Login successful!");
    console.log('📝 Token stored in localStorage with key: "token"');
    console.log("👤 User:", response?.user ?? response);

    return response;
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 401) {
        console.error("❌ Invalid email or password");
      } else if (error.status === 400) {
        console.error("❌ Email or password is missing");
      } else {
        console.error(`❌ Login failed [${error.status}]: ${error.message}`);
      }
    }
    throw error;
  }
}

// ============================================================================
// EXAMPLE 3: Using in React Component
// ============================================================================
type Product = {
  id: number;
  name?: string;
  price?: number;
  stock?: number;
  stockQuantity?: number;
};

export function ExampleAdminProductsComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("📦 Loading products...");
        const data = await productApiService.getAllProducts();

        if (!isMounted) return;

        setProducts(Array.isArray(data) ? data : []);
        console.log("✅ Loaded", Array.isArray(data) ? data.length : 0, "products");
      } catch (err) {
        if (!isMounted) return;

        if (err instanceof APIError) {
          setError(`Error [${err.status}]: ${err.message}`);

          if (err.status === 401) {
            console.warn("🔐 Redirecting to login...");
            setTimeout(() => {
              window.location.href = "/admin/login";
            }, 1500);
          }
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Admin Products ({products.length})</h1>

      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: 12 }}>
          <h2>{product.name ?? "Unnamed product"}</h2>
          <p>Price: {product.price ?? "-"} ₼</p>
          <p>Stock: {product.stock ?? product.stockQuantity ?? "-"}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Manual localStorage Token Verification
// ============================================================================
export function debugTokenStorage() {
  console.log("🔍 Debugging token storage...");

  const token = localStorage.getItem("token")?.trim();
  if (!token) {
    console.warn("❌ No token found in localStorage (key: token)");
    console.log("💡 Login first, then re-check.");
    return;
  }

  console.log("✅ Token found in localStorage");
  console.log("📝 Token length:", token.length, "characters");

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("❌ Invalid JWT format (expected 3 parts)");
      return;
    }

    const payload = JSON.parse(atob(parts[1]));
    console.log("📋 Token Payload:", payload);

    if (payload.exp) {
      const expiresAt = new Date(payload.exp * 1000);
      console.log("⏰ Expires at:", expiresAt.toLocaleString());

      if (Date.now() > expiresAt.getTime()) {
        console.warn("⚠️ Token is EXPIRED");
      } else {
        console.log("✅ Token is not expired (time-wise)");
      }
    }
  } catch (e) {
    console.error("❌ Failed to decode token payload:", e);
  }
}

// ============================================================================
// EXAMPLE 6: Error Handling Patterns
// ============================================================================
export async function exampleErrorHandling() {
  try {
    await productApiService.getAllProducts();
  } catch (error) {
    if (error instanceof APIError) {
      console.error(`API Error [${error.status}]:`, error.message);
      console.error("Response data:", error.data);

      if (error.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
      } else if (error.status === 403) {
        console.error("You do not have permission to access this resource");
      } else if (error.status === 0) {
        console.error("Backend is unreachable. Check backend running + CORS + HTTPS.");
      }
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

// ============================================================================
// EXAMPLE 7: Checking Token Before Making Requests
// ============================================================================
export async function exampleCheckTokenBeforeRequest() {
  const token = localStorage.getItem("token")?.trim();

  if (!token) {
    console.warn("❌ No token found. You must login first.");
    window.location.href = "/admin/login";
    return;
  }

  try {
    console.log("✅ Token exists, making request...");
    const products = await productApiService.getAllProducts();
    console.log("✅ Request successful:", products);
  } catch (error) {
    console.error("Request failed:", error instanceof APIError ? error.message : String(error));
  }
}

// ============================================================================
// EXPORT for testing in console
// ============================================================================
export const examples = {
  getAllProducts: exampleGetAllProducts,
  adminLogin: exampleAdminLogin,
  errorHandling: exampleErrorHandling,
  checkTokenBeforeRequest: exampleCheckTokenBeforeRequest,
  debugToken: debugTokenStorage,
};
