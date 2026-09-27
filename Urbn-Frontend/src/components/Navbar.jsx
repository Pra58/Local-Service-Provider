import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? "text-brand-700 bg-brand-50" : "text-slate-600 hover:text-brand-600"
  }`;

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardPath =
    user?.role === "ADMIN" ? "/admin" : user?.role === "PROVIDER" ? "/provider" : "/customer";

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        <NavLink to="/" className="text-xl font-bold text-brand-700">
          Urbn
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/services" className={linkClass}>
            Services
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to={dashboardPath} className={linkClass}>
                Dashboard
              </NavLink>
              {user.role === "CUSTOMER" && (
                <NavLink to="/bookings" className={linkClass}>
                  My Bookings
                </NavLink>
              )}
              {user.role === "PROVIDER" && (
                <NavLink to="/bookings" className={linkClass}>
                  Bookings
                </NavLink>
              )}
              {user.role === "ADMIN" && (
                <>
                  <NavLink to="/admin/users" className={linkClass}>
                    Users
                  </NavLink>
                  <NavLink to="/admin/bookings" className={linkClass}>
                    Bookings
                  </NavLink>
                </>
              )}
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-slate-500">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded-md"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
