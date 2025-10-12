import React from "react";
import UserHomePage from "./pages/user/UserHomePage";
import { Toaster } from "react-hot-toast";
import AdminHomePage from "./pages/admin/AdminHomePage";
import { useAuth } from "./redux/ReduxProvider";

function App() {
  const [authUser, setAuthUser] = useAuth();

  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            style: {
              background: "#059669",
            },
          },
          error: {
            style: {
              background: "#dc2626",
            },
          },
        }}
      />
      {!authUser ? (
        <UserHomePage />
      ) : (
        <>{authUser.role == "admin" ? <AdminHomePage /> : <UserHomePage />}</>
      )}
    </div>
  );
}

export default App;
