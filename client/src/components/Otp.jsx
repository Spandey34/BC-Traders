import React from "react";
import { useState, useRef, useEffect } from "react";

const Otp = ({ length = 6, onComplete}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.join("").length === length) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(new Array(length).fill("").map((_, i) => newOtp[i] || ""));
      onComplete(pasteData);
      inputRefs.current[pasteData.length - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 md:gap-3" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          className="w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-semibold border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
        />
      ))}
    </div>
  );
};

export default Otp;
