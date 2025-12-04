"use client";

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import api from "@/utils/axiosConfig";
import { Button } from "@mui/material";
import { Card, CardContent } from "@/components/ui/card";
import UserModal from "./UserModal";
import { useAuth } from "../../context/AuthContext";

export default function UserTable() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reload, setReload] = useState(false);

  const reloadUsers = () => setReload((prev) => !prev);

  // 🔥 Obtener usuarios
  const fetchUsers = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.users || [];
      setUsers(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);

      const status = err?.response?.status;

      if (status === 401)
        setError("Tu sesión expiró. Iniciá sesión nuevamente.");
      else if (status === 403)
        setError("Acceso denegado. Solo administradores.");
      else setError("Error cargando usuarios.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Cargar usuarios al montar / recargar
  useEffect(() => {
    fetchUsers();
  }, [token, reload]);

  // 🔥 Activar / desactivar usuario
  const toggleActive = async (id, active) => {
    if (active && !confirm("¿Seguro que querés desactivar este usuario?"))
      return;

    try {
      const res = await api.put(
        `/admin/user/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data.user;

      setUsers((prev) =>
        prev.map((u) => (u.id_User === updated.id_User ? updated : u))
      );

      alert(res.data.message);
    } catch (err) {
      console.error("Error cambiando estado:", err);
      alert("No se pudo cambiar el estado del usuario.");
    }
  };

  // 🔥 Activar / desactivar todos
  const toggleAllUsers = async () => {
    try {
      const res = await api.put(
        "/admin/users/toggleAll",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      reloadUsers();
    } catch (err) {
      console.error("Error estado global:", err);
      alert("No se pudo cambiar el estado global.");
    }
  };

  const columns = [
    { field: "name", headerName: "Nombre completo", flex: 1 },
    { field: "listNumber", headerName: "Lista de Precios", flex: 0.5 },

    {
      field: "active",
      headerName: "Estado",
      flex: 0.6,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.row.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {params.row.active ? "Activo" : "Inactivo"}
        </span>
      ),
    },

    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            className="px-2 py-1 rounded-md text-yellow-700 border border-yellow-300 bg-yellow-50/30 hover:bg-yellow-100 transition text-sm"
            onClick={() => {
              setSelectedUser(params.row);
              setShowModal(true);
            }}
          >
            Editar
          </button>
      
          <button
            className={`px-2 py-1 rounded-md border text-sm transition
              ${params.row.active
                ? "text-red-700 border-red-300 bg-red-50/30 hover:bg-red-100"
                : "text-green-700 border-green-300 bg-green-50/30 hover:bg-green-100"
              }
            `}
            onClick={() => toggleActive(params.row.id_User, params.row.active)}
          >
            {params.row.active ? "Desactivar" : "Activar"}
          </button>
        </div>
      )
      
    },
  ];

  return (
    <Card className="mt-10 bg-white shadow-lg border border-gray-100 max-w-5xl mx-auto">
      <CardContent className="p-6">
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-300 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={toggleAllUsers}
            className={`px-4 py-2 rounded-md text-white transition ${
              users.every((u) => !u.active || u.role === "admin")
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {users.every((u) => !u.active || u.role === "admin")
              ? "Activar todos"
              : "Desactivar todos"}
          </button>

          <button
            onClick={() => {
              setSelectedUser(null);
              setShowModal(true);
            }}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
          >
            Agregar usuario
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-2" style={{ height: 500 }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.id_User}
            loading={loading}
            disableColumnMenu
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
          />
        </div>

        {!loading && !error && users.length === 0 && (
          <div className="text-sm text-gray-500 mt-3">
            No hay usuarios para mostrar.
          </div>
        )}

        {showModal && (
          <UserModal
            user={selectedUser}
            onClose={() => setShowModal(false)}
            onUserChange={reloadUsers}
          />
        )}
      </CardContent>
    </Card>
  );
}
