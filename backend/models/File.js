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
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    publicId: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    listNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM("listas-pdf", "listas-excel", "ofertas", "maquinas"),
      allowNull: false,
    },    
  },
  {
    tableName: "Files",
    timestamps: false,
  }
);
