"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Usuario o contraseña incorrectos");
      }

      // Guardar token
      localStorage.setItem("token", data.token);

      // Redirección según el rol
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push(`/home?name=${encodeURIComponent(data.user.name)}`);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Header verde */}
      <header className="bg-emerald-800 text-white w-full text-center py-4 font-bold text-xl">
        BIENVENIDOS !!
      </header>

      {/* Imagen y catálogos */}
      <div className="mt-8 flex flex-col items-center space-y-4">
        <div className="flex space-x-8">
          <div className="flex flex-col items-center">
            <img src="/pdf-icon.png" alt="PDF" className="w-16 h-16" />
            <p className="text-sm mt-2">catálogo de herrajes</p>
          </div>
          <div className="flex flex-col items-center">
            <img src="/pdf-icon.png" alt="PDF" className="w-16 h-16" />
            <p className="text-sm mt-2">catálogo de máquinas</p>
          </div>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleLogin} className="flex flex-col mt-6 space-y-2">
          <input
            type="text"
            placeholder="Nombre y apellido"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-red-500 px-2 py-1 rounded-md text-center"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-red-500 px-2 py-1 rounded-md text-center"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white mt-4 py-1 rounded hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "INGRESAR"}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-700">
          PARA PODER INGRESAR A LA LISTA DE PRECIOS <br />
          <span className="text-red-600 font-bold">
            COMUNICATE CON NOSOTROS
          </span>
        </p>
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
