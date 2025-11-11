"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";

export default function PriceListsPanel() {
  const { user, token } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🆕 estados para subir archivos
  const [selectedFile, setSelectedFile] = useState(null);
  const [listNumber, setListNumber] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [category, setCategory] = useState("lista");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchFiles = async () => {
      try {
        setLoading(true);

        const url =
          user.role === "admin"
            ? "http://localhost:3001/files"
            : `http://localhost:3001/files/visible/${user.id}`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFiles(res.data);
      } catch (err) {
        console.error("Error al obtener archivos:", err);
        setError("No se pudieron cargar las listas de precios.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [user, token]);

  // 📤 Subir archivo
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Seleccioná un archivo");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileType", fileType);
    formData.append("listNumber", listNumber);
    formData.append("category", category);

    try {
      await axios.post("http://localhost:3001/files/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Archivo subido correctamente");

      // refrescamos la lista
      const res = await axios.get("http://localhost:3001/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
      setSelectedFile(null);
      setListNumber("");
    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert("❌ Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return <p className="text-gray-600 text-center mt-8">Cargando listas...</p>;

  if (error)
    return <p className="text-red-600 text-center mt-8">{error}</p>;

  return (
    <Card className="mt-8 bg-gray-50 border shadow-md">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-lg font-semibold">
          {user.role === "admin"
            ? "📂 Panel de administración de listas"
            : "📄 Listas de precios disponibles"}
        </h2>

        {/* 🧾 Panel de subida (solo admin) */}
        {user.role === "admin" && (
          <form
            onSubmit={handleUpload}
            className="flex flex-col md:flex-row items-center gap-3 bg-white p-4 rounded-lg border shadow-sm"
          >
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="border p-2 rounded-md w-full md:w-auto"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded-md"
            >
              <option value="lista">Lista</option>
              <option value="ofertas">Ofertas</option>
              <option value="maquinas">Máquinas</option>
            </select>

            {category === "lista" && (
              <input
                type="number"
                value={listNumber}
                onChange={(e) => setListNumber(e.target.value)}
                placeholder="N° de lista"
                className="border p-2 rounded-md w-32"
              />
            )}

            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="border p-2 rounded-md"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>

            <Button
              type="submit"
              disabled={uploading}
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              {uploading ? "Subiendo..." : "Subir archivo"}
            </Button>
          </form>
        )}

        {/* 📂 Archivos listados */}
        {files.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            No hay archivos disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id_File}
                className="flex flex-col items-start p-3 bg-white rounded-xl shadow-sm border"
              >
                <span className="font-medium mb-2">
                  {file.category === "lista"
                    ? `Lista ${file.listNumber}`
                    : file.category === "ofertas"
                    ? "Ofertas"
                    : "Máquinas"}
                </span>

                <Button
                  variant="default"
                  className="bg-gray-800 text-white hover:bg-gray-700"
                  onClick={() =>
                    window.open(
                      `http://localhost:3001/${file.filePath}`,
                      "_blank"
                    )
                  }
                >
                  Ver archivo ({file.fileType?.toUpperCase()})
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
