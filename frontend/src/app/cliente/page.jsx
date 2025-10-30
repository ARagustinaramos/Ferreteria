"use client";
import { useAuth } from "../context/AuthContext";

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#004d40]">
        Hola {user?.name} 👋
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <a href="/pdf/herrajes.pdf" className="text-center">
          <img src="/pdf-icon.png" className="w-16 mx-auto" />
          <p>Catálogo de Herrajes</p>
        </a>

        <a href="/pdf/maquinas.pdf" className="text-center">
          <img src="/pdf-icon.png" className="w-16 mx-auto" />
          <p>Catálogo de Máquinas</p>
        </a>

        <a href="/excel/lista1.xlsx" className="text-center">
          <img src="/excel-icon.png" className="w-16 mx-auto" />
          <p>Lista de Precios</p>
        </a>
      </div>

      <div className="mt-10 text-sm text-gray-600">
        <p>📧 herrajes123@gmail.com</p>
        <p>📦 Realizamos envíos hasta el local</p>
      </div>
    </div>
  );
}
