"use client";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { logout, user, loading } = useAuth();
  if (loading) return null;

  const username =
    user?.name || user?.username || user?.email?.split("@")[0];

  return (
    <header className="w-full bg-gradient-to-r from-[#003f2f] via-[#058f6b] to-[#8fff9b] shadow-lg border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-white shadow-xl overflow-hidden ring-4 ring-white/40">
            <Image
              src="/dhm.png"
              alt="Logo DHM"
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight drop-shadow-md">
            Distribuidora DHM
          </h1>
        </div>

        {/* SALUDO / LOGIN */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-white text-xl font-medium">
            {user ? `Hola ${username}` : "Bienvenidos"}
          </span>

          {user && (
            <button
              onClick={logout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-md border border-white/30 shadow-md transition-all"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
