"use client";

import React, { useState, useEffect, useRef } from "react";
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

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleUserChange = () => setReload((prev) => !prev);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.users || [];

      if (isMounted.current) {
        setUsers(data);
        setError("");
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("Usuarios recibidos:", data.length);
      }
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      if (isMounted.current) {
        const status = err?.response?.status;
        if (status === 401)
          setError("No autenticado. Iniciá sesión nuevamente.");
        else if (status === 403)
          setError("Acceso restringido. Se requiere rol administrador.");
        else setError("No se pudieron cargar los usuarios.");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [reload, token]);

  const toggleActive = async (id) => {
    try {
      await axios.put(
        `http://localhost:3001/admin/user/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (isMounted.current) handleUserChange();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { field: "name", headerName: "Nombre completo", flex: 1 },
    { field: "listNumber", headerName: "Lista de Precios", flex: 0.5 },
  
    {
      field: "active",
      headerName: "Estado",
      flex: 0.5,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            params.row.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {params.row.active ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.7,
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
  
  if (!isMounted.current) return null; 

  return (
    <div className="w-full p-4">
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

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
        <div className="text-sm text-gray-500 mt-3">
          No hay usuarios para mostrar.
        </div>
      )}

      {showModal && isMounted.current && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onUserChange={handleUserChange}
        />
      )}
    </div>
  );
}
