import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { ProductsProvider } from "./context/ProductsProvider.jsx";
import { OrdersProvider } from "./context/OrdersProvider.jsx";
import { TabProvider } from "./context/ActiveTabContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <TabProvider>
        <AuthProvider>
          <ThemeProvider>
            <ProductsProvider>
              <OrdersProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </OrdersProvider>
            </ProductsProvider>
          </ThemeProvider>
        </AuthProvider>
      </TabProvider>
    </ClerkProvider>
  </BrowserRouter>
);
