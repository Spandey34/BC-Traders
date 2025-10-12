import React, { useEffect, useState } from "react";
import UserHomePage from "./pages/user/UserHomePage";
import { Toaster } from "react-hot-toast";
import AdminHomePage from "./pages/admin/AdminHomePage";
import { useAuth } from "./redux/ReduxProvider";
import { useUser } from "@clerk/clerk-react";

function App() {
  const [authUser, setAuthUser] = useAuth();
  const { user, isLoaded } = useUser();
  const[role,setRole] = useState("user");
  useEffect(() => {
    setRole(user?.unsafeMetadata?.role);
  }, [user, authUser]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading Application...</p>
      </div>
    );
  }

  return (
    <>
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
        {/* This logic now runs AFTER isLoaded is true using the direct user data */}
        
        {role=="admin" ? <AdminHomePage /> : <UserHomePage />}
      </div>
    </>
  );
}

export default App;