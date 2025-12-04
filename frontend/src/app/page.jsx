"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Wrench, Percent, FileArchive } from "lucide-react";
import { useAuth } from "./context/AuthContext";

export default function Page() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [publicFiles, setPublicFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPublicFiles = async () => {
      try {
        const res = await axios.get("http://localhost:3001/files/public");
        setPublicFiles(res.data);
      } catch (error) {
        console.error("Error al obtener archivos públicos:", error);
      }
    };
    fetchPublicFiles();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !password.trim()) {
      return setErrorMessage("Completá todos los campos.");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      login(data.user, data.token);

      router.push(data.user.role === "admin" ? "/admin" : "/home");
    } catch (error) {
      setErrorMessage(error.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (category) => {
    switch (category) {
      case "maquinas":
        return Wrench;
      case "ofertas":
        return Percent;
      default:
        return FileArchive;
    }
  };

  const getLabelForCategory = (category) => {
    switch (category) {
      case "maquinas":
        return "Catálogo Máquinas";
      case "ofertas":
        return "Ofertas Especiales";
      default:
        return "Archivo";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white/80">
      <div className="mt-8 flex flex-col items-center space-y-4">
        <div className="flex space-x-10">
          {publicFiles.map((file) => {
            const Icon = getIconForCategory(file.category);

            return (
              <div
                key={file.id_File}
                className="flex flex-col items-center text-center cursor-pointer"
              >
                <a
                  href={`http://localhost:3001/files/serve/${file.id_File}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="bg-white p-6 rounded-full shadow-md hover:scale-110 transition-transform">
                    <Icon size={72} className="text-red-600" />
                  </div>
                </a>

                <p className="text-sm mt-3 font-medium text-gray-700">
                  {getLabelForCategory(file.category)}
                </p>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col mt-6 space-y-3 w-full max-w-xs"
        >
          <input
            type="text"
            placeholder="Nombre y apellido"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-red-500 px-3 py-2 rounded-md text-center text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-red-500 px-3 py-2 rounded-md text-center text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
          />

          {errorMessage && (
            <p className="text-red-600 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white mt-2 py-2 rounded-md font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "INGRESAR"}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-700">
          PARA PODER INGRESAR A LA LISTA DE PRECIOS <br />
          <span className="text-red-600 font-bold">COMUNICATE CON NOSOTROS</span>
        </p>
      </div>

      <footer className="mt-auto mb-4 text-center text-sm text-gray-800">
        <p>📞 1E+09</p>
        <p>
          📧{" "}
          <a href="mailto:herrajes123@gmail.com" className="text-blue-600">
            herrajes123@gmail.com
          </a>
        </p>
        <p>🚚 Realizamos los envíos hasta el local</p>
      </footer>
    </div>
  );
}
