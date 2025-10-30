"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:3001/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.error(err));
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold mb-6 text-[#004d40]">
        Hola, {user?.name}
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Clientes registrados</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Nombre</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Lista</th>
              <th className="p-3 border">Rol</th>
              <th className="p-3 border">Activo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id_User} className="hover:bg-gray-50">
                <td className="p-3 border">{u.name}</td>
                <td className="p-3 border">{u.email}</td>
                <td className="p-3 border">{u.listNumber ?? "-"}</td>
                <td className="p-3 border">{u.role}</td>
                <td className="p-3 border">{u.active ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-3 mt-6">
          <button className="bg-[#00796b] text-white px-4 py-2 rounded-lg">
            Agregar Cliente
          </button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">
            Modificar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
