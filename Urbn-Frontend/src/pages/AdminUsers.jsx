import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserRole, deleteUserAdmin } from "../services/adminService.js";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { ROLES } from "../utils/constants.js";
import { extractErrorMessage } from "../utils/formatters.js";
import useAuth from "../hooks/useAuth.js";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(extractErrorMessage(err, "Could not load users")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      load();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not update role"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await deleteUserAdmin(id);
      load();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not delete user"));
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
      <div className="space-y-3">
        {users.map((u) => (
          <Card key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-slate-500">{u.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                value={u.role}
                disabled={u.id === currentUser.id}
                onChange={(e) => handleRoleChange(u.id, e.target.value)}
              >
                {Object.values(ROLES).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <Button
                variant="danger"
                disabled={u.id === currentUser.id}
                onClick={() => handleDelete(u.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
