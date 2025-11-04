import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();

// Registro
export const register = async (req, res) => {
  try {
    const { name, email, password, role = "client", listNumber } = req.body;

    // Verifica si ya existe el usuario
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

  

    // 👇 Validaciones específicas
    if (role !== "admin" && !listNumber) {
      return res
        .status(400)
        .json({ message: "El número de lista es obligatorio para usuarios no admin" });
    }

    // 👇 Preparamos los datos según el tipo de usuario
    const userData = {
      name,
      email,
      password,
      role,
      active: true,
      listNumber: role === "admin" ? null : listNumber, // Solo null si es admin
    };

    // Crea el usuario
    const newUser = await User.create(userData);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: newUser.id_User,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
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
    const { email, password } = req.body;

    // Busca usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Compara contraseñas
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Crea token
    const token = jwt.sign(
      { id: user.id_User, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id_User,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
