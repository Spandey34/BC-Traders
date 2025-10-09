import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import { api } from "../api/api";
import Cookies from "js-cookie";
import { SignInButton } from "@clerk/clerk-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authUser, setAuthUser] = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = { email, password };
    try {
      const res = await axios.post(api + "/user/login", payload, {
        withCredentials: true,
      });
      setAuthUser(res.data.user);
      navigate("/");
      //window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Login failed. Please check your credentials and try again.");
      return;
    }
  };
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
