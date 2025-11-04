import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,   // 🔹 Tomamos el puerto de PostgreSQL desde .env
    dialect: "postgres",
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida correctamente.");

    // ⚡️ Sincronizar sin bloquear: no usar alter ni force
    sequelize.sync()
      .then(() => console.log("🗂️ Modelos sincronizados con la base de datos."))
      .catch(err => console.error("❌ Error en sync:", err));
      
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    throw error;
  }
};

