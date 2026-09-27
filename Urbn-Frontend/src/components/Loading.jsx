import React from "react";

export default function Loading({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-16 text-slate-500">
      <div className="h-5 w-5 mr-3 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      {label}
    </div>
  );
}
