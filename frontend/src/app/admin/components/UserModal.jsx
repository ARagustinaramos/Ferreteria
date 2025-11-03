"use client";
import { useState } from "react";
import axios from "axios";

export default function UserModal({ user, onClose, onUserChange }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    listNumber: user?.listNumber || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
       
        await axios.put(`http://localhost:3001/admin/user/${user.id_User}/list`, {
          listNumber: form.listNumber,
        });
      } else {
       
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
