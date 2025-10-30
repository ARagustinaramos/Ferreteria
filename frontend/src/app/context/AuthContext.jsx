"use client";
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  // Cargar usuario guardado (por ejemplo, tras refrescar la página)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });

      const { user: userResp, token: tokenResp } = response.data;
      setUser(userResp);
      setToken(tokenResp);
      localStorage.setItem("user", JSON.stringify(userResp));
      localStorage.setItem("token", tokenResp);

      // Redirigir según el rol
      if (userResp.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/cliente");
      }
    } catch (error) {
      alert("Error al iniciar sesión. Verificá tus datos.");
      console.error(error);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
