"use client";
import { useState } from "react";
import axios from "axios";

export default function UserModal({ user, onClose, onUserChange }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    listNumber: user?.listNumber || "",
    role: user?.role || "cliente", 
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        // Actualiza lista si es cliente
        if (form.role === "cliente") {
          await axios.put(
            `http://localhost:3001/admin/user/${user.id_User}/list`,
            { listNumber: form.listNumber }
          );
        }
      } else {
        // Crea usuario nuevo
        await axios.post("http://localhost:3001/admin/user", form);
      }

      onUserChange();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el usuario");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {user ? "Modificar Usuario" : "Agregar Usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!!user}
              className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!!user}
              className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Contraseña (solo al crear) */}
          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
                required
              />
            </div>
          )}

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Lista de precios (solo si es cliente) */}
          {form.role === "cliente" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lista de precios
              </label>
              <input
                type="number"
                name="listNumber"
                value={form.listNumber}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {user ? "Guardar cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
