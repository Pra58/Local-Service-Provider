import React from "react";
import { Link } from "react-router-dom";
import Card from "./Card.jsx";

export default function ServiceCard({ service }) {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {service.category}
        </span>
        {!service.active && (
          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Inactive</span>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
      <p className="text-sm text-slate-600 flex-1 line-clamp-3">{service.description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className="font-bold text-slate-900">₹{service.price}</span>
        <span className="text-sm text-slate-500">{service.providerName}</span>
      </div>
      <Link
        to={`/services/${service.id}`}
        className="mt-4 inline-block text-center bg-brand-600 hover:bg-brand-700 text-white rounded-md py-2 text-sm font-medium"
      >
        View Details
      </Link>
    </Card>
  );
}
