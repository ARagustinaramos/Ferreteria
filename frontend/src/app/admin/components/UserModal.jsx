"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function UserModal({ user, onClose, onUserChange }) {
  const { token } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role || "client");
  const [listNumber, setListNumber] = useState(user?.listNumber || "");
  const [priceLists, setPriceLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    let mounted = true;

    async function fetchPriceLists() {
      try {
        setLoadingLists(true);
        const res = await axios.get("http://localhost:3001/admin/pricelists", {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });

        if (mounted) {
          setPriceLists(res.data);
          setError("");
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error al obtener listas de precios:", err);
          if (mounted) setError("No se pudieron cargar las listas de precios.");
        }
      } finally {
        if (mounted) setLoadingLists(false);
      }
    }

    fetchPriceLists();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (user) {
        await axios.put(
          `http://localhost:3001/admin/user/${user.id_User}/list`,
          { name, email, role, listNumber, password },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:3001/admin/user",
          { name, email, password, role, listNumber },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      onUserChange();
      onClose();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      setError("Error al guardar el usuario.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {user ? "Editar usuario" : "Agregar nuevo usuario"}
        </h2>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />

          {!user && (
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border rounded px-3 py-2"
            />
          )}

          {user && (
            <input
              type="password"
              placeholder="Nueva contraseña (opcional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded px-3 py-2"
            />
          )}

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="client">Cliente</option>
            <option value="admin">Administrador</option>
          </select>

          {role === "client" && (
            <select
              value={listNumber}
              onChange={(e) => setListNumber(e.target.value)}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Seleccione una lista</option>
              {loadingLists ? (
                <option>Cargando...</option>
              ) : (
                priceLists.map((list, index) => (
                  <option
                    key={`${list.listNumber}-${list.name || index}`}
                    value={list.listNumber}
                  >
                    Lista {list.listNumber} - {list.name}
                  </option>
                ))
              )}
            </select>
          )}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              {user ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
