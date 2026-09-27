import React from "react";
import { Link } from "react-router-dom";
import { SERVICE_CATEGORIES } from "../utils/constants.js";

export default function Home() {
  return (
    <div>
      <section className="text-center py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          Local services, booked in minutes.
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Urbn connects you with trusted electricians, plumbers, carpenters and more —
          right in your neighbourhood.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/services"
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Browse Services
          </Link>
          <Link
            to="/register"
            className="border border-brand-600 text-brand-600 hover:bg-brand-50 px-6 py-3 rounded-md font-medium"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/services?category=${encodeURIComponent(cat)}`}
              className="bg-white border border-slate-200 rounded-lg p-4 text-center hover:border-brand-400 hover:shadow-sm transition"
            >
              <span className="font-medium text-slate-700">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 grid sm:grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="font-semibold mb-1">1. Find a service</h3>
          <p className="text-sm text-slate-600">Search and compare local providers by category.</p>
        </div>
        <div>
          <div className="text-3xl mb-2">📅</div>
          <h3 className="font-semibold mb-1">2. Book instantly</h3>
          <p className="text-sm text-slate-600">Pick a date and time that works for you.</p>
        </div>
        <div>
          <div className="text-3xl mb-2">✅</div>
          <h3 className="font-semibold mb-1">3. Get it done</h3>
          <p className="text-sm text-slate-600">Track your booking from confirmed to completed.</p>
        </div>
      </section>
    </div>
  );
}
