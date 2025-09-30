import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import { api } from "../api/api";
import Cookies from "js-cookie";

const LoginPage = () => {
    const navigate = useNavigate();
    const [authUser, setAuthUser, role, setRole] = useAuth();
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    const handleLogin = async (e) => {
        const payload = { email, password };

        try {
          const res = await axios.post(api+"/user/login", payload, { withCredentials: true });
          const token = Cookies.get("BC-Traders");
          setAuthUser(token);
          localStorage.setItem("BC-Traders", token);
          console.log(token);
          navigate("/");
        } catch (error) {
          console.log(error);
          alert("Login failed. Please check your credentials and try again.");
          return;
        }
    }
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
        <form className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 mt-2 text-base text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange = {(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <a
                onClick={() => navigate("/forgotpassword")}
                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer"
              >
                Forgot Password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 mt-2 text-base text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            onClick={(e) => handleLogin(e)}
            className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a
            onClick={() => navigate("/signup")}
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
