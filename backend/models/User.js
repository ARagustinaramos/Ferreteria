import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../config/db.js";

export const User = sequelize.define("User", {
  id_User: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "client"),
    defaultValue: "client",
  },
  listNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});
