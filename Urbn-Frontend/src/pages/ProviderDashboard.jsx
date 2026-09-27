import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth.js";
import {
  getMyServices,
  createService,
  updateService,
  deleteService,
  setServiceActive,
} from "../services/serviceService.js";
import { getProviderBookings } from "../services/bookingService.js";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Modal from "../components/Modal.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { SERVICE_CATEGORIES } from "../utils/constants.js";
import { extractErrorMessage } from "../utils/formatters.js";

const emptyForm = { title: "", description: "", category: SERVICE_CATEGORIES[0], price: "" };

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getMyServices(), getProviderBookings()])
      .then(([s, b]) => {
        setServices(s);
        setBookings(b);
      })
      .catch((err) => setError(extractErrorMessage(err, "Could not load your dashboard")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditing(service);
    setForm({
      title: service.title,
      description: service.description || "",
      category: service.category,
      price: service.price,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editing) {
        await updateService(editing.id, payload);
      } else {
        await createService(payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(extractErrorMessage(err, "Could not save the service"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service? This cannot be undone.")) return;
    try {
      await deleteService(id);
      load();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not delete the service"));
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await setServiceActive(service.id, !service.active);
      load();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not update the service"));
    }
  };

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "ACCEPTED").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Provider Dashboard</h1>
      <p className="text-slate-500 mb-8">Manage your services and bookings, {user?.name}.</p>
      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

      <div className="grid sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Services" value={services.length} />
        <StatCard label="Pending" value={pendingCount} />
        <StatCard label="Confirmed" value={confirmedCount} />
        <StatCard label="Completed" value={completedCount} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">My Services</h2>
        <Button onClick={openCreate}>+ Add Service</Button>
      </div>

      {services.length === 0 && <p className="text-slate-500 mb-8">You haven't added any services yet.</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {services.map((s) => (
          <Card key={s.id}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{s.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.active ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
                {s.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-2 line-clamp-2">{s.description}</p>
            <p className="font-bold mb-3">₹{s.price}</p>
            <div className="flex gap-2 flex-wrap">
              <Button variant="secondary" onClick={() => openEdit(s)}>Edit</Button>
              <Button variant="outline" onClick={() => handleToggleActive(s)}>
                {s.active ? "Deactivate" : "Activate"}
              </Button>
              <Button variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} title={editing ? "Edit Service" : "Add Service"} onClose={() => setModalOpen(false)}>
        {formError && <div className="mb-3"><ErrorMessage message={formError} /></div>}
        <form onSubmit={handleSave}>
          <Input
            id="title"
            label="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Input
            id="price"
            label="Price (₹)"
            type="number"
            min="0"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <Button type="submit" fullWidth disabled={saving}>
            {saving ? "Saving..." : editing ? "Save Changes" : "Add Service"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 text-center">
      <div className="text-3xl font-bold text-brand-600">{value}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}
