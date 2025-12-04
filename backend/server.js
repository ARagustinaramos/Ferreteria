import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { PriceList } from "./models/PriceList.js";
import { File } from "./models/File.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
 
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoutes);

// Conexión a la base de datos y levantar servidor solo si DB está lista
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Conexión a PostgreSQL establecida correctamente.");

    // Definir asociaciones
    PriceList.hasMany(File, { foreignKey: "listNumber", sourceKey: "listNumber" });
    File.belongsTo(PriceList, { foreignKey: "listNumber", targetKey: "listNumber" });

    PriceList.hasMany(User, { foreignKey: "listNumber", sourceKey: "listNumber" });
    User.belongsTo(PriceList, { foreignKey: "listNumber", targetKey: "listNumber" });

    // Rutas
    app.get("/", (req, res) => {
      res.send("🚀 API Ferretería con PostgreSQL funcionando");
    });

    app.use("/user", userRoutes);
    app.use("/admin", adminRoutes);
    app.use("/files", fileRoutes);
    app.use("/uploads", express.static("uploads"));
    // Servidor
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  } catch (err) {
    console.error("❌ No se pudo conectar a la base de datos:", err);
    process.exit(1);
  }
};

startServer();
