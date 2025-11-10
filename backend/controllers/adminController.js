import { User } from "../models/User.js";
import { File } from "../models/File.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, password, role, listNumber } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: hashed,
      role,
      listNumber: role === "client" ? listNumber : null,
    });

    res.json(user);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, listNumber, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.name = name ?? user.name;
    user.role = role ?? user.role;
    user.listNumber = role === "client" ? listNumber : null;

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

export const toggleUserActive = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.active = !user.active;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getPriceLists = async (req, res) => {
  try {
    const files = await File.findAll({
      where: { category: "lista" },
      attributes: ["listNumber", "fileName"],
      group: ["listNumber", "fileName"],
      order: [["listNumber", "ASC"]],
    });

    const priceLists = files.map((file) => ({
      listNumber: file.listNumber,
      name: file.fileName,
    }));

    res.json(priceLists);
  } catch (error) {
    console.error("Error al obtener listas de precios:", error);
    res.status(500).json({ message: "Error al obtener listas de precios" });
  }
};
