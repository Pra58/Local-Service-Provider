import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-6xl font-bold text-brand-600 mb-4">404</h1>
      <p className="text-lg text-slate-600 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-brand-600 font-medium hover:underline">
        Back to home
      </Link>
    </div>
  );
}
