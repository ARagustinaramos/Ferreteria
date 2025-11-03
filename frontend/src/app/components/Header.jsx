"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header({ username }) {
  const [greeting, setGreeting] = useState("BIENVENIDOS !!");

  useEffect(() => {
    if (username) {
      setGreeting(`HOLA ${username.toUpperCase()} ...`);
    }
  }, [username]);

  return (
    <header className="relative bg-emerald-800 text-white h-28 flex items-center justify-center shadow-md">
      {/* Fondo verde */}
      <h1 className="text-xl font-bold tracking-wide">{greeting}</h1>

      {/* Imagen circular superpuesta */}
      <div className="absolute -bottom-8 left-10 w-24 h-24 rounded-full border-4 border-emerald-800 overflow-hidden shadow-lg">
        <Image
          src="/logo_dhm.png" // <-- tu imagen circular (ej. el logo de DHM)
          alt="Logo DHM"
          width={100}
          height={100}
          className="object-cover"
        />
      </div>

      {/* Imagen decorativa detrás (opcional, como el recorte verde) */}
      <div className="absolute top-0 left-0 w-24 h-28 bg-emerald-800 clip-path-triangle"></div>
    </header>
  );
}
