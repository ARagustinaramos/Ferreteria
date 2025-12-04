import { User } from "../models/User.js";
import { File } from "../models/File.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, password, role, listNumber } = req.body;

    const user = await User.create({
      name,
      password,  
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
      user.password = password; 
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

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Cambia el estado actual
    user.active = !user.active;
    await user.save();

    const message = user.active
      ? "Usuario activado correctamente"
      : "Usuario desactivado correctamente";

    res.json({
      message,
      user: {
        id_User: user.id_User,
        name: user.name,
        role: user.role,
        listNumber: user.listNumber,
        active: user.active,
        password: user.password, 
      },
    });
  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const toggleAllClients = async (req, res) => {
  try {
    // Buscar todos los clientes
    const clients = await User.findAll({ where: { role: "client" } });

    if (clients.length === 0) {
      return res.status(404).json({ message: "No hay usuarios cliente para actualizar." });
    }

    // Ver si todos están activos
    const allActive = clients.every((user) => user.active);

    // Si todos están activos → desactivar todos, si no → activar todos
    await User.update(
      { active: !allActive },
      { where: { role: "client" } }
    );

    res.json({
      message: allActive
        ? "Todos los usuarios fueron desactivados."
        : "Todos los usuarios fueron activados.",
      newState: !allActive,
    });
  } catch (error) {
    console.error("Error al alternar estado de los usuarios:", error);
    res.status(500).json({ error: error.message });
  }
};



export const getPriceLists = async (req, res) => {
  try {
    const files = await File.findAll({
      where: { category: ["listas-pdf", "listas-excel"] },
      attributes: ["listNumber"],
      group: ["listNumber"],
      order: [["listNumber", "ASC"]],
    });

    const priceLists = files.map((file) => ({
      listNumber: file.listNumber,
    }));

    res.json(priceLists);
  } catch (error) {
    console.error("Error al obtener listas de precios:", error);
    res.status(500).json({ message: "Error al obtener listas de precios" });
  }
};

