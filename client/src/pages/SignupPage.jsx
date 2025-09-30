import React from "react";
import { useState, useEffect } from "react";
import Otp from "../components/Otp";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import Cookies from "js-cookie";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [otpRequested, setOtpRequested] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [authUser, setAuthUser, role, setRole] = useAuth();

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    let interval;
    if (otpRequested && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpRequested(false);
      setTimer(30);
    }
    return () => clearInterval(interval);
  }, [otpRequested, timer]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      email,
      password
    } 
    try {
      const res = await axios.post(api+"/user/signup",payload, {withCredentials: true});
      console.log(res.data);
    } catch (error) {
      console.log(error);
      setError("Failed to send OTP. Please try again.");
      return;
    }

    setOtpRequested(true);
    setError("");
  };

  const handleOtpSubmit = async (otp) => {

    try {
      const payload = { name, email, password, otp };
      const res = await axios.post(api+"/user/signup/verify", payload, { withCredentials: true });
      const token = Cookies.get("BC-Traders");
      setAuthUser(token);
      localStorage.setItem("BC-Traders", token);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("OTP verification failed. Please try again.");
      return;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            B.C. Traders 
          </h1>
          <p className="mt-2 text-m text-gray-600 dark:text-gray-400">
             Create an Account
          </p>
        </div>

        {!otpRequested ? (
          <form className="space-y-4">
            <input
              placeholder="Full Name"
              type="text"
              className="w-full px-4 py-2 text-base text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="Email Address"
              type="email"
              required
              className="w-full px-4 py-2 text-base text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-base text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <div>
              <input
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 text-base text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
                  passwordsMatch
                    ? "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                    : "border-red-500 focus:ring-red-500"
                }`}
              />
              {!passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords do not match.
                </p>
              )}
            </div>
            <button
              onClick={handleRequestOtp}
              className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed"
              disabled={!passwordsMatch || !password}
            >
              Request OTP
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Enter the 6-digit code sent to your email.
            </p>
            <Otp length={6} onComplete={handleOtpSubmit} email={email} type={"signup"}/>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive code?{" "}
              {timer > 0 ? (
                <span className="text-gray-500 dark:text-gray-500">
                  Resend in {timer}s
                </span>
              ) : (
                <button
                  onClick={() => setTimer(30)}
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a
            onClick={() => navigate("/login")}
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400 cursor-pointer"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
