import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInButton, useAuth } from "@clerk/clerk-react";

const LoginPage = () => {

  const {isSignedIn} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/"); // redirect to home
    }
  }, [isSignedIn]);
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            B.C. Traders
          </h1>
          <p className="mt-2 text-m text-gray-600 dark:text-gray-400">
            Login To Your Account
          </p>
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          <SignInButton mode="modal">
            <button className="font-medium text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer">
              Login
            </button>
          </SignInButton>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
