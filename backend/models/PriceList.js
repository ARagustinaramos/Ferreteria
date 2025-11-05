import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PriceList = sequelize.define(
  "PriceList",
  {
    id_List: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    listNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "PriceLists",
    timestamps: false, 
  }
);
