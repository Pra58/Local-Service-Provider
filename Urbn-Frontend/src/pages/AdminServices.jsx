import React, { useEffect, useState } from "react";
import { getAllServicesAdmin } from "../services/adminService.js";
import { deleteService, setServiceActive } from "../services/serviceService.js";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { extractErrorMessage } from "../utils/formatters.js";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getAllServicesAdmin()
      .then(setServices)
      .catch((err) => setError(extractErrorMessage(err, "Could not load services")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      load();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not delete the service"));
    }
  };

  const handleToggle = async (s) => {
    try {
      await setServiceActive(s.id, !s.active);
      load();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not update the service"));
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Services</h1>
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => (
          <Card key={s.id}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{s.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
                {s.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-2">by {s.providerName} · {s.category}</p>
            <p className="font-bold mb-3">₹{s.price}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleToggle(s)}>
                {s.active ? "Deactivate" : "Activate"}
              </Button>
              <Button variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
