"use client";

console.log("🚨🚨🚨 CLIENT DASHBOARD CARGÓ 🚨🚨🚨");

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Wrench, Percent, FileArchive, FileSpreadsheet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  const [files, setFiles] = useState([]);
  const router = useRouter();

  console.log("👉 USER EN DASHBOARD:", user);


  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchFiles = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/files/visible/${user.id}`
        );

        console.log("📂 ARCHIVOS RECIBIDOS DEL BACKEND:", res.data);
        setFiles(res.data);
      } catch (error) {
        console.error("❌ Error cargando archivos:", error);
      }
    };

    fetchFiles();
  }, [user]);

  if (loading || (!user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 bg-white/80">
        Cargando...
      </div>
    );
  }
  if (!user) return null;

  const iconForCategory = (category) => {
    switch (category) {
      case "maquinas":
        return Wrench;
      case "ofertas":
        return Percent;
      case "listas-excel":
        return FileSpreadsheet;
      case "listas-pdf":
      default:
        return FileArchive;
    }
  };

  const labelForCategory = (category) => {
    switch (category) {
      case "listas-pdf":
        return "Lista de Precios (PDF)";
      case "listas-excel":
        return "Lista de Precios (Excel)";
      case "ofertas":
        return "Ofertas Especiales";
      case "maquinas":
        return "Catálogo Máquinas";
      default:
        return "Archivo";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white/80">

          <div className="mt-12 grid grid-cols-2 gap-10">

        {files.length === 0 && (
          <p className="text-gray-600 text-lg">No hay archivos para mostrar 😕</p>
        )}

        {files.map((file) => {
          const Icon = iconForCategory(file.category);

          return (
            <div
              key={file.id_File}
              className="flex flex-col items-center cursor-pointer"
            >
              <a
                href={`http://localhost:3001/files/serve/${file.id_File}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-white p-6 rounded-full shadow-md hover:scale-110 transition-transform flex items-center justify-center">
                  <Icon size={72} className="text-red-600" />
                </div>
              </a>

              <p className="text-sm mt-3 font-medium text-gray-700">
                {labelForCategory(file.category)}
              </p>

              <a
                href={`http://localhost:3001/files/serve/${file.id_File}?download=true`}
                download
                className="mt-2 bg-red-600 text-white text-xs px-4 py-1.5 rounded-md shadow hover:bg-red-700 transition"
              >
                Descargar
              </a>
            </div>
          );
        })}
      </div>

      <footer className="mt-auto mb-6 text-center text-sm text-gray-700">
        <p>📞 1135684589</p>
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
