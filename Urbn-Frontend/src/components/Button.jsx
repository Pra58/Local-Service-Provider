import React from "react";

const variants = {
  primary: "bg-brand-600 hover:bg-brand-700 text-white",
  secondary: "bg-slate-200 hover:bg-slate-300 text-slate-800",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  outline: "border border-brand-600 text-brand-600 hover:bg-brand-50",
};

export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
        variants[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
