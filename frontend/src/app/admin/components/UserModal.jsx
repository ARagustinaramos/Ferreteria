"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function UserModal({ user, onClose, onUserChange }) {
  const { token } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState(user?.password || "");
  const [role, setRole] = useState(user?.role || "client");
  const [listNumber, setListNumber] = useState(user?.listNumber || "");
  const [priceLists, setPriceLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchLists() {
      try {
        setLoadingLists(true);
        const res = await axios.get("http://localhost:3001/admin/pricelists", {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (mounted) setPriceLists(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          if (mounted) setError("No se pudieron cargar las listas.");
        }
      } finally {
        if (mounted) setLoadingLists(false);
      }
    }

    fetchLists();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { name, password, role, listNumber };

    try {
      if (user) {
        await axios.put(
          `http://localhost:3001/admin/user/${user.id_User}/list`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:3001/admin/user", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
          {/* ✅ nombre y apellido en un solo campo */}
          <input
            type="text"
            placeholder="Nombre y apellido"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border rounded px-3 py-2"
          />

          {/* ✅ contraseña visible con botón para mostrar/ocultar */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!user}
              className="border rounded px-3 py-2 w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

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
                    key={`${list.listNumber}-${index}`}
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
