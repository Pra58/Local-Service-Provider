import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllServices } from "../services/serviceService.js";
import ServiceCard from "../components/ServiceCard.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { SERVICE_CATEGORIES } from "../utils/constants.js";
import { extractErrorMessage } from "../utils/formatters.js";

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getAllServices({ category: category || undefined, q: searchParams.get("q") || undefined })
      .then((data) => {
        if (active) setServices(data);
      })
      .catch((err) => {
        if (active) setError(extractErrorMessage(err, "Could not load services"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (q) next.set("q", q);
    else next.delete("q");
    setSearchParams(next);
  };

  const handleCategoryClick = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === category) next.delete("category");
    else next.set("category", cat);
    setSearchParams(next);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Browse Services</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search services..."
          className="flex-1 rounded-md border border-slate-300 px-3 py-2"
        />
        <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md">
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              category === cat
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-slate-600 border-slate-300 hover:border-brand-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <Loading />}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && services.length === 0 && (
        <p className="text-slate-500 text-center py-12">No services found. Try a different search.</p>
      )}
      {!loading && !error && services.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
