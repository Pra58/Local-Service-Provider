import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Card from "../components/Card.jsx";
import { extractErrorMessage } from "../utils/formatters.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await register(form);
      const target = user.role === "PROVIDER" ? "/provider" : "/customer";
      navigate(target, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, "Could not create your account"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Card>
        <h1 className="text-2xl font-bold mb-6">Create your Urbn account</h1>
        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
        <form onSubmit={handleSubmit}>
          <Input
            id="name"
            label="Full name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            id="phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">I am a</label>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="CUSTOMER">Customer — I want to book services</option>
              <option value="PROVIDER">Provider — I offer services</option>
            </select>
          </div>
          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Creating account..." : "Register"}
          </Button>
        </form>
        <p className="text-sm text-slate-500 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 font-medium">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
