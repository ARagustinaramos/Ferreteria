"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // asegurate que esta ruta sea correcta

export default function HomePage() {
  const { user, token } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchFiles = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/files/visible/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFiles(res.data);
      } catch (err) {
        console.error("Error al obtener archivos visibles:", err);
        setError("No se pudieron cargar las listas de precios.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [user, token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Cargando tus listas...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  const grouped = {
    lista: files.filter((f) => f.category === "lista"),
    ofertas: files.filter((f) => f.category === "ofertas"),
    maquinas: files.filter((f) => f.category === "maquinas"),
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Header */}
      <header className="bg-emerald-800 text-white w-full text-center py-4 font-bold text-xl">
        HOLA {user?.name?.toUpperCase()} 👋
      </header>

      {/* Contenido principal */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        {/* 🧾 Lista de precios */}
        {grouped.lista.length > 0 && (
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-3">Lista de Precios</h2>
            {grouped.lista.map((file) => (
              <button
                key={file.id_File}
                onClick={() =>
                  window.open(`http://localhost:3001/${file.filePath}`, "_blank")
                }
                className={`flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 transition ${
                  file.fileType === "pdf" ? "text-red-600" : "text-green-600"
                }`}
              >
                <img
                  src={`/${
                    file.fileType === "pdf" ? "pdf-icon.png" : "excel-icon.png"
                  }`}
                  alt={file.fileType}
                  className="w-16 h-16 mb-2"
                />
                <p className="text-sm">
                  Descargar {file.fileType.toUpperCase()}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* 💰 Ofertas */}
        {grouped.ofertas.length > 0 && (
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-3">Ofertas</h2>
            {grouped.ofertas.map((file) => (
              <button
                key={file.id_File}
                onClick={() =>
                  window.open(`http://localhost:3001/${file.filePath}`, "_blank")
                }
                className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 transition text-red-600"
              >
                <img
                  src="/pdf-icon.png"
                  alt="ofertas"
                  className="w-16 h-16 mb-2"
                />
                <p className="text-sm">Ver ofertas ({file.fileType.toUpperCase()})</p>
              </button>
            ))}
          </div>
        )}

        {/* ⚙️ Máquinas */}
        {grouped.maquinas.length > 0 && (
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow md:col-span-2">
            <h2 className="font-semibold text-lg mb-3">Catálogo de Máquinas</h2>
            {grouped.maquinas.map((file) => (
              <button
                key={file.id_File}
                onClick={() =>
                  window.open(`http://localhost:3001/${file.filePath}`, "_blank")
                }
                className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 transition text-red-600"
              >
                <img
                  src="/pdf-icon.png"
                  alt="maquinas"
                  className="w-16 h-16 mb-2"
                />
                <p className="text-sm">
                  Ver catálogo ({file.fileType.toUpperCase()})
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
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
