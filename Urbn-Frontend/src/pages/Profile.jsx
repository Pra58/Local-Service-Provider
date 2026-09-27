import React, { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "../services/authService.js";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { extractErrorMessage } from "../utils/formatters.js";

export default function Profile() {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setProfile(data);
        setForm({ name: data.name, phone: data.phone || "", password: "" });
      })
      .catch((err) => setError(extractErrorMessage(err, "Could not load your profile")))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const updated = await updateCurrentUser({
        name: form.name,
        phone: form.phone,
        password: form.password || undefined,
      });
      setProfile(updated);
      setForm({ ...form, password: "" });
      setSuccess("Profile updated.");
    } catch (err) {
      setError(extractErrorMessage(err, "Could not update your profile"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <Card>
        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
        {success && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-4">
            {success}
          </p>
        )}
        {profile && (
          <p className="text-sm text-slate-500 mb-4">
            {profile.email} · <span className="font-medium">{profile.role}</span>
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            id="name"
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            id="phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            id="password"
            label="New password (leave blank to keep current)"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
