import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { AppProvider } from "./redux/ReduxProvider.jsx"
import { TabProvider } from "./context/ActiveTabContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <TabProvider>
        <AppProvider>
          <ThemeProvider>
                <CartProvider>
                  <App />
                </CartProvider>
          </ThemeProvider>
        </AppProvider>
      </TabProvider>
    </ClerkProvider>
  </BrowserRouter>
);
