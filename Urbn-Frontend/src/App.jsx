import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import ServiceDetails from "./pages/ServiceDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import ProviderDashboard from "./pages/ProviderDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminServices from "./pages/AdminServices.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
import Bookings from "./pages/Bookings.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/customer"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider"
          element={
            <ProtectedRoute roles={["PROVIDER"]}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute roles={["CUSTOMER", "PROVIDER"]}>
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
