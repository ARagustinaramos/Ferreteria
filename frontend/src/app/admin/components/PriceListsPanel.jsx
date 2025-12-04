"use client";

import React, { useState } from "react";
import api from "@/utils/axiosConfig";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { Upload, FileText, FileSpreadsheet, Loader2 } from "lucide-react";

export default function PriceListsPanel() {
  const { user } = useAuth();

  const [selectedFile, setSelectedFile] = useState(null);
  const [listNumber, setListNumber] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [category, setCategory] = useState("lista");
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  if (user.role !== "admin")
    return (
      <Card className="mt-8 bg-gray-50 border shadow-md">
        <CardContent className="p-6 text-center text-gray-700">
          <h2 className="text-lg font-semibold mb-3">📄 Listas de precios</h2>
          <p className="text-sm text-gray-500">
            Solo los administradores pueden subir y gestionar archivos.
          </p>
        </CardContent>
      </Card>
    );

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile)
      return setErrorMessage("Seleccioná un archivo para subir.");

    // Validar tipo permitido
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      return setErrorMessage("Solo se permiten archivos PDF o Excel.");
    }

    setUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileType", fileType);
    formData.append("listNumber", listNumber);
    formData.append("category", category);

    try {
      await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("✅ Archivo subido correctamente.");

      // agregar al historial local
      setUploadedFiles((prev) => [...prev, selectedFile.name]);

      // resetear campos
      setSelectedFile(null);
      setListNumber("");
    } catch (error) {
      console.error("Error al subir archivo:", error);
      setErrorMessage(
        error.response?.data?.message || "❌ Error al subir el archivo."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mt-10 bg-white shadow-lg border border-gray-100 max-w-3xl mx-auto">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Upload className="w-5 h-5 text-gray-700" />
            Subida de listas de precios
          </h2>

          {uploading && (
            <Loader2 className="animate-spin w-5 h-5 text-gray-500" />
          )}
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleUpload}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Archivo
            </label>

            <input
              key={selectedFile ? selectedFile.name : "file"}
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="border rounded-lg p-2 text-sm text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            />

            {/* Mostrar nombre del archivo elegido */}
            {selectedFile && (
              <p className="mt-1 text-xs text-gray-500">
                Archivo seleccionado:{" "}
                <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg p-2 text-sm text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            >
              <option value="lista">Lista</option>
              <option value="ofertas">Ofertas</option>
              <option value="maquinas">Máquinas</option>
            </select>
          </div>

          {category === "lista" && (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                N° de lista
              </label>
              <input
                type="number"
                value={listNumber}
                onChange={(e) => setListNumber(e.target.value)}
                placeholder="Ej. 1"
                className="border rounded-lg p-2 text-sm text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              />
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Tipo de archivo
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="border rounded-lg p-2 text-sm text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>

          <div className="md:col-span-2 flex justify-center mt-4">
            <Button
              type="submit"
              disabled={uploading}
              className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-2 rounded-lg transition-all"
            >
              {uploading ? "Subiendo..." : "Subir archivo"}
            </Button>
          </div>
        </form>

        {successMessage && (
          <p className="text-green-600 text-sm text-center">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-sm text-center">{errorMessage}</p>
        )}

        {/* Información general */}
        <div className="border-t pt-5 mt-6 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Archivos esperados:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-500">
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Lista 1–5 (PDF o Excel)
            </li>
            <li className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-gray-400" />
              Ofertas (Excel)
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Listado de máquinas
            </li>
          </ul>
        </div>

        {/* Historial local de archivos subidos */}
        {uploadedFiles.length > 0 && (
          <div className="border-t pt-5 mt-6 text-sm text-gray-700">
            <h3 className="font-semibold mb-2">Últimos archivos subidos:</h3>
            <ul className="space-y-1">
              {uploadedFiles
                .slice(-3)
                .reverse()
                .map((name, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <Upload className="w-4 h-4 text-gray-500" />
                    {name}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
