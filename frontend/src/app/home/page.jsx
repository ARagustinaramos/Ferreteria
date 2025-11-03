"use client";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const params = useSearchParams();
  const name = params.get("name") || "Cliente";

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Header */}
      <header className="bg-emerald-800 text-white w-full text-center py-4 font-bold text-xl">
        HOLA {name.toUpperCase()} ...
      </header>

      {/* Listas */}
      <div className="mt-8 flex flex-col items-center space-y-4">
        <div className="flex space-x-8">
          <div className="flex flex-col items-center">
            <img src="/pdf-icon.png" alt="PDF" className="w-16 h-16" />
            <p className="text-sm mt-2">lista de precios en PDF</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="/pdf-icon.png" alt="PDF" className="w-16 h-16" />
            <p className="text-sm mt-2">ofertas de la semana</p>
          </div>
        </div>

        <div className="flex space-x-8">
          <div className="flex flex-col items-center">
            <img src="/excel-icon.png" alt="Excel" className="w-16 h-16" />
            <p className="text-sm mt-2">lista de precios en EXCEL</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="/excel-icon.png" alt="Excel" className="w-16 h-16" />
            <p className="text-sm mt-2">lista de máquinas en EXCEL</p>
          </div>
        </div>
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
