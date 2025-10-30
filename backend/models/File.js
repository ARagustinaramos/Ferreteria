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
      allowNull: false, // pdf / excel
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    listNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Files",
    timestamps: false, // Desactiva createdAt/updatedAt automáticos
  }
);
