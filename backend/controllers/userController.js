import { User } from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id_User",
        "name",
        "password",
        "role",
        "listNumber",
        "active",
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
