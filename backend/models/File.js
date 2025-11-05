import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const File = sequelize.define(
  "File",
  {
    id_File: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    listNumber: {
      type: DataTypes.INTEGER,
      allowNull: true, 
    },
    category: {
      type: DataTypes.ENUM("lista", "ofertas", "maquinas"),
      allowNull: false,
      defaultValue: "lista", 
    },
  },
  {
    tableName: "Files",
    timestamps: false,
  }
);
