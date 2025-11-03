"use client";

import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Button } from "@mui/material";
import UserModal from "./UserModal";
import { useAuth } from "../../context/AuthContext";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reload, setReload] = useState(false);
  const { token } = useAuth();

  // 🔁 Refrescar lista de usuarios
  const handleUserChange = () => setReload(!reload);

  // 🧭 Obtener usuarios
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data?.users || [];
      setUsers(data);
      if (process.env.NODE_ENV !== "production") {
        // Debug mínimo para confirmar datos en cliente
        console.log("Usuarios recibidos:", data.length);
      }
      setError("");
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      const status = err?.response?.status;
      if (status === 401) setError("No autenticado. Iniciá sesión nuevamente.");
      else if (status === 403) setError("Acceso restringido. Se requiere rol administrador.");
      else setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Alternar estado activo/inactivo
  const toggleActive = async (id) => {
    try {
      await axios.put(
        `http://localhost:3001/admin/user/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  // 🕓 Cargar usuarios al montar y cuando cambia reload
  useEffect(() => {
    if (token) fetchUsers();
  }, [reload, token]);

  // 📊 Columnas de la tabla
  const columns = [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "listNumber", headerName: "Lista de Precios", flex: 0.7 },
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
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Button
            variant="contained"
            size="small"
            color="warning"
            onClick={() => {
              setSelectedUser(params.row);
              setShowModal(true);
            }}
          >
            Editar
          </Button>

          <Button
            variant="contained"
            size="small"
            color={params.row.active ? "error" : "success"}
            onClick={() => toggleActive(params.row.id_User)}
          >
            {params.row.active ? "Desactivar" : "Activar"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-4">
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>
      )}
      {/* 🔘 Botón para agregar usuario */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Agregar usuario
        </button>
      </div>

      {/* 🧮 Tabla de usuarios */}
      <div className="bg-white shadow rounded-lg p-2" style={{ height: 500 }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.id_User ?? row.id ?? row.email}
          loading={loading}
          disableColumnMenu
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </div>
      {!loading && !error && users.length === 0 && (
        <div className="text-sm text-gray-500 mt-3">No hay usuarios para mostrar.</div>
      )}

      {/* 🪟 Modal para agregar/editar */}
      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onUserChange={handleUserChange}
        />
      )}
    </div>
  );
}
