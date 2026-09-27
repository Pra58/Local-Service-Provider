import React from "react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">About Urbn</h1>
      <p className="text-slate-600 mb-4">
        Urbn is a local service booking platform built to make it simple to find and book
        trusted professionals — electricians, plumbers, carpenters, AC technicians, cleaners,
        and more — in your area.
      </p>
      <p className="text-slate-600 mb-4">
        Customers can browse verified providers, compare pricing, and track a booking from
        request through completion. Providers get a dashboard to manage their service listings
        and incoming bookings. Admins oversee the whole platform, keeping listings and users in
        good standing.
      </p>
      <p className="text-slate-600">
        This project was built as a full-stack demo using React, Spring Boot, and PostgreSQL.
      </p>
    </div>
  );
}
