import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceById } from "../services/serviceService.js";
import { getFeedbackForService } from "../services/feedbackService.js";
import { createBooking } from "../services/bookingService.js";
import useAuth from "../hooks/useAuth.js";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { extractErrorMessage } from "../utils/formatters.js";

export default function ServiceDetails() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingForm, setBookingForm] = useState({ scheduledAt: "", address: "", notes: "" });
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([getServiceById(id), getFeedbackForService(id)])
      .then(([serviceData, feedbackData]) => {
        if (!active) return;
        setService(serviceData);
        setFeedback(feedbackData);
      })
      .catch((err) => active && setError(extractErrorMessage(err, "Service not found")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setBookingError("");
    setBookingSuccess("");
    setSubmitting(true);
    try {
      await createBooking({
        serviceId: Number(id),
        scheduledAt: bookingForm.scheduledAt,
        address: bookingForm.address,
        notes: bookingForm.notes,
      });
      setBookingSuccess("Booking requested! You can track its status from My Bookings.");
      setBookingForm({ scheduledAt: "", address: "", notes: "" });
    } catch (err) {
      setBookingError(extractErrorMessage(err, "Could not create the booking"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!service) return null;

  const avgRating = feedback.length
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : null;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {service.category}
        </span>
        <h1 className="text-3xl font-bold mt-1 mb-2">{service.title}</h1>
        <p className="text-slate-600 mb-4">{service.description}</p>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl font-bold">₹{service.price}</span>
          <span className="text-sm text-slate-500">by {service.providerName}</span>
          {avgRating && (
            <span className="text-sm text-amber-600 font-medium">★ {avgRating} ({feedback.length})</span>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-3">Reviews</h2>
        {feedback.length === 0 && <p className="text-slate-500 text-sm">No reviews yet.</p>}
        <div className="space-y-3">
          {feedback.map((f) => (
            <Card key={f.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{f.userName}</span>
                <span className="text-amber-600 text-sm">★ {f.rating}/5</span>
              </div>
              {f.comment && <p className="text-sm text-slate-600">{f.comment}</p>}
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Card>
          <h2 className="text-lg font-semibold mb-4">Book this service</h2>
          {bookingSuccess && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-4">
              {bookingSuccess}
            </p>
          )}
          {bookingError && <div className="mb-3"><ErrorMessage message={bookingError} /></div>}
          {user?.role === "PROVIDER" || user?.role === "ADMIN" ? (
            <p className="text-sm text-slate-500">
              Only customers can book services. Log in with a customer account to book.
            </p>
          ) : (
            <form onSubmit={handleBook}>
              <Input
                id="scheduledAt"
                label="Date & time"
                type="datetime-local"
                required
                value={bookingForm.scheduledAt}
                onChange={(e) => setBookingForm({ ...bookingForm, scheduledAt: e.target.value })}
              />
              <Input
                id="address"
                label="Address"
                required
                value={bookingForm.address}
                onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
              />
              <Input
                id="notes"
                label="Notes (optional)"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
              />
              <Button type="submit" fullWidth disabled={submitting}>
                {submitting ? "Booking..." : isAuthenticated ? "Book Now" : "Log in to book"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
