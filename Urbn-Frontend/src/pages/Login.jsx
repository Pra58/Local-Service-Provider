import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Card from "../components/Card.jsx";
import { extractErrorMessage } from "../utils/formatters.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectByRole = (role) => {
    if (role === "ADMIN") return "/admin";
    if (role === "PROVIDER") return "/provider";
    return "/customer";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form);
      const target = location.state?.from?.pathname || redirectByRole(user.role);
      navigate(target, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, "Invalid email or password"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Card>
        <h1 className="text-2xl font-bold mb-6">Log in to Urbn</h1>
        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
        <form onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Logging in..." : "Log In"}
          </Button>
        </form>
        <p className="text-sm text-slate-500 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-600 font-medium">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
