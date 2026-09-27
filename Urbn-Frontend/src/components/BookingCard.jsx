import React from "react";
import Card from "./Card.jsx";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-slate-200 text-slate-700",
};

export default function BookingCard({ booking, actions }) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{booking.serviceTitle}</h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            statusColors[booking.status] || "bg-slate-100 text-slate-700"
          }`}
        >
          {booking.status}
        </span>
      </div>
      <p className="text-sm text-slate-600">
        {new Date(booking.scheduledAt).toLocaleString()}
      </p>
      <p className="text-sm text-slate-600">Address: {booking.address}</p>
      {booking.userName && (
        <p className="text-sm text-slate-500">Customer: {booking.userName}</p>
      )}
      {booking.providerName && (
        <p className="text-sm text-slate-500">Provider: {booking.providerName}</p>
      )}
      {actions && <div className="flex gap-2 mt-2">{actions}</div>}
    </Card>
  );
}
