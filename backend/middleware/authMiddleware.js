import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error al verificar token:", error.message);
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
};

export const verifyAdmin = (req, res, next) => {
  console.log("👤 Usuario autenticado:", req.user);

  if (!req.user) {
    return res.status(401).json({ message: "No se encontró información de usuario en el token." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso restringido. Se requiere rol administrador." });
  }

  next();
};
