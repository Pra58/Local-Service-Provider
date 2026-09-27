import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth.js";
import {
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking,
} from "../services/bookingService.js";
import BookingCard from "../components/BookingCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Button from "../components/Button.jsx";
import { extractErrorMessage } from "../utils/formatters.js";

export default function Bookings() {
  const { user } = useAuth();
  const isProvider = user?.role === "PROVIDER";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    const fetcher = isProvider ? getProviderBookings : getMyBookings;
    fetcher()
      .then(setBookings)
      .catch((err) => setError(extractErrorMessage(err, "Could not load bookings")))
      .finally(() => setLoading(false));
  };

  useEffect(load, [isProvider]);

  const handleStatus = async (id, status) => {
    setActionError("");
    try {
      await updateBookingStatus(id, status);
      load();
    } catch (err) {
      setActionError(extractErrorMessage(err, "Could not update the booking"));
    }
  };

  const handleCancel = async (id) => {
    setActionError("");
    try {
      await cancelBooking(id);
      load();
    } catch (err) {
      setActionError(extractErrorMessage(err, "Could not cancel the booking"));
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isProvider ? "Bookings" : "My Bookings"}</h1>
      {error && <ErrorMessage message={error} />}
      {actionError && <div className="mb-4"><ErrorMessage message={actionError} /></div>}

      {!error && bookings.length === 0 && (
        <p className="text-slate-500">No bookings yet.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {bookings.map((b) => (
          <BookingCard
            key={b.id}
            booking={b}
            actions={
              isProvider ? (
                <>
                  {b.status === "PENDING" && (
                    <>
                      <Button variant="primary" onClick={() => handleStatus(b.id, "ACCEPTED")}>
                        Accept
                      </Button>
                      <Button variant="danger" onClick={() => handleStatus(b.id, "REJECTED")}>
                        Reject
                      </Button>
                    </>
                  )}
                  {b.status === "ACCEPTED" && (
                    <Button variant="primary" onClick={() => handleStatus(b.id, "COMPLETED")}>
                      Mark Completed
                    </Button>
                  )}
                </>
              ) : (
                (b.status === "PENDING" || b.status === "ACCEPTED") && (
                  <Button variant="danger" onClick={() => handleCancel(b.id)}>
                    Cancel
                  </Button>
                )
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
