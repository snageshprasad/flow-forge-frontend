import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./layout/Layout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import CreateOrganization from "./pages/CreateOrganization";
import Organization from "./pages/Organization";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Default ── */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Auth ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── Protected ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/organizations/new" element={<CreateOrganization />} />
            <Route path="/organizations/manage" element={<Organization />} />
          </Route>
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
