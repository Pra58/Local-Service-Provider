import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} Urbn. All rights reserved.</span>
        <span>Local services, booked simply.</span>
      </div>
    </footer>
  );
}
