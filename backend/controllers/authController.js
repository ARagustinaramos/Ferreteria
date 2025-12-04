import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, password, role = "client", listNumber } = req.body;

    const existing = await User.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    if (role !== "admin" && !listNumber) {
      return res.status(400).json({
        message: "El número de lista es obligatorio para usuarios no admin",
      });
    }

    const newUser = await User.create({
      name,
      password,
      role,
      active: true,
      listNumber: role === "admin" ? null : listNumber,
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser.id_User,
        name: newUser.name,
        role: newUser.role,
        listNumber: newUser.listNumber,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ where: { name } });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // 🚫 Verificar si el usuario está inactivo
    if (!user.active) {
      return res
        .status(403)
        .json({ message: "Tu cuenta está desactivada. Contactá al administrador." });
    }

    
    if (password !== user.password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { 
        id: user.id_User, 
        role: user.role, 
        name: user.name, 
        listNumber: user.listNumber 
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id_User,
        name: user.name,
        role: user.role,
        listNumber: user.listNumber,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
