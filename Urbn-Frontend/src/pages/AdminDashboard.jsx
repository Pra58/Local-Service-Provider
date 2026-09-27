import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { extractErrorMessage } from "../utils/formatters.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((r) => setStats(r.data))
      .catch((err) => setError(extractErrorMessage(err, "Could not load dashboard stats")))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Providers" value={stats.totalProviders} />
        <StatCard label="Total Services" value={stats.totalServices} />
        <StatCard label="Total Bookings" value={stats.totalBookings} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/admin/users" className="bg-white border border-slate-200 rounded-lg p-5 hover:border-brand-400">
          <h3 className="font-semibold mb-1">Manage Users</h3>
          <p className="text-sm text-slate-500">View, promote, or remove accounts.</p>
        </Link>
        <Link to="/admin/services" className="bg-white border border-slate-200 rounded-lg p-5 hover:border-brand-400">
          <h3 className="font-semibold mb-1">Manage Services</h3>
          <p className="text-sm text-slate-500">Browse and moderate the service catalog.</p>
        </Link>
        <Link to="/admin/bookings" className="bg-white border border-slate-200 rounded-lg p-5 hover:border-brand-400">
          <h3 className="font-semibold mb-1">Manage Bookings</h3>
          <p className="text-sm text-slate-500">Monitor all bookings across the platform.</p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 text-center">
      <div className="text-3xl font-bold text-brand-600">{value}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}
