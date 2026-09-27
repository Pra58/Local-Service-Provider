import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { getMyBookings } from "../services/bookingService.js";
import BookingCard from "../components/BookingCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { extractErrorMessage } from "../utils/formatters.js";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .catch((err) => setError(extractErrorMessage(err, "Could not load your bookings")))
      .finally(() => setLoading(false));
  }, []);

  const pending = bookings.filter((b) => b.status === "PENDING");
  const upcoming = bookings.filter((b) => b.status === "ACCEPTED");
  const completed = bookings.filter((b) => b.status === "COMPLETED");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}</h1>
      <p className="text-slate-500 mb-8">Here's a snapshot of your bookings.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Pending" value={pending.length} />
        <StatCard label="Upcoming" value={upcoming.length} />
        <StatCard label="Completed" value={completed.length} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Recent Bookings</h2>
        <div className="flex items-center gap-4">
          <Link to="/bookings" className="text-brand-600 text-sm font-medium">
            View all →
          </Link>
          <Link
            to="/services"
            className="text-sm bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md"
          >
            Book a Service
          </Link>
        </div>
      </div>

      {loading && <Loading />}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && bookings.length === 0 && (
        <p className="text-slate-500">No bookings yet — browse services to get started.</p>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {bookings.slice(0, 4).map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
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
