import React from "react";

export default function Input({ label, error, id, className = "", ...rest }) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 ${
          error ? "border-red-500" : "border-slate-300"
        } ${className}`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
