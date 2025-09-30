import React from "react";
import { useNavigate } from "react-router-dom";
import Otp from "../components/Otp";
import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../api/api";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthProvider";

const ForgotPasswordPage = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [notification, setNotification] = useState("");
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [authUser, setAuthUser, role, setRole] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let messageTimer;
    if (notification) {
      messageTimer = setTimeout(() => {
        setNotification("");
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(messageTimer);
  }, [notification]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      // Allow resend
      setOtpSent(false);
      setError("");
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const payload = {
      email
    } 
    try {
      const res = await axios.post(api+"/forgotpassword",payload, {withCredentials: true});
      console.log(res.data);
    } catch (error) {
      console.log(error);
      setError("Failed to send OTP. Please check mail again.");
      setTimer(30); 
      return;
    }

    setOtpSent(true);
    setNotification("OTP sent successfully!");
    setTimer(30); 
    setError("");
  };

  const handleOtpSubmit = async (otp) => {

    try {
      const payload = { email, otp };
      const res = await axios.post(api+"/resetpassword", payload, { withCredentials: true });
      const token = Cookies.get("BC-Traders");
      const role = Cookies.get("role");
      setRole(role);
      setAuthUser(token);
    } catch (error) {
      console.log(error);
      setError("OTP verification failed. Please try again.");
      return;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            Forgot Password
          </h1>
          <p className="mt-2 text-m text-gray-600 dark:text-gray-400">
            {otpSent
              ? "Enter the OTP sent to your email."
              : "We'll send a recovery code to your email."}
          </p>
          {error && (!otpSent) && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {notification && (
          <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200 text-center transition-opacity duration-300">
            {notification}
          </div>
        )}

        {!otpSent ? (
          <form className="space-y-6" onSubmit={handleSendOtp}>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 mt-2 text-base text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <Otp length={6} onComplete={handleOtpSubmit}/>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive code?{" "}
              {timer > 0 ? (
                <span className="text-gray-500 dark:text-gray-500">
                  Resend in {timer}s
                </span>
              ) : (
                <button
                  onClick={handleSendOtp}
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          <a
            onClick={() => navigate("/login")}
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer"
          >
            &larr; Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
