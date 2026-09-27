import React, { useEffect, useState } from "react";
import { getAllBookingsAdmin } from "../services/adminService.js";
import BookingCard from "../components/BookingCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { extractErrorMessage } from "../utils/formatters.js";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllBookingsAdmin()
      .then(setBookings)
      .catch((err) => setError(extractErrorMessage(err, "Could not load bookings")))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      {error && <ErrorMessage message={error} />}
      {!error && bookings.length === 0 && <p className="text-slate-500">No bookings yet.</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
      </div>
    </div>
  );
}
