import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 p-5 ${className}`}>
      {children}
    </div>
  );
}
