import { sequelize } from "./config/db.js";
import { User } from "./models/User.js";
import { PriceList } from "./models/PriceList.js";
import { File } from "./models/File.js";
import dotenv from "dotenv";

dotenv.config();

const initializeDatabase = async () => {
  try {
    console.log("🌱 Inicializando base de datos...");

    await sequelize.authenticate();
    console.log("✅ Conexión establecida correctamente.");

    console.log("🔄 Sincronizando base de datos...");
    await sequelize.sync({ force: true }); // ⚠️ borra y recrea tablas
    console.log("✅ Tablas creadas correctamente.");

    // Crear listas de precios
    const priceLists = [
      { listNumber: 1, name: "Lista de Precios 1", description: "Clientes con pago contado" },
      { listNumber: 2, name: "Lista de Precios 2", description: "Clientes con pago semanal" },
      { listNumber: 3, name: "Lista de Precios 3", description: "Clientes con pago mensual" },
      { listNumber: 4, name: "Lista de Precios 4", description: "Clientes con pago especial" },
      { listNumber: 5, name: "Lista de Precios 5", description: "Mayoristas o cuentas especiales" },
    ];
    await PriceList.bulkCreate(priceLists);
    console.log("✅ Listas de precios iniciales creadas.");

    // Crear usuarios (con un admin)
    const users = [
      { name: "Fulanito Gómez", password: "1234", role: "client", listNumber: 1 },
      { name: "Pedrito Pérez", password: "2345", role: "client", listNumber: 2 },
      { name: "Juancito López", password: "3456", role: "client", listNumber: 3 },
      { name: "Administrador General", password: "admin123", role: "admin" },
    ];
    await User.bulkCreate(users);
    console.log("✅ Usuarios iniciales creados.");

    // Crear archivos ejemplo
    const files = [
      { fileName: "lista1.pdf", fileType: "pdf", filePath: "uploads/lista1.pdf", listNumber: 1 },
      { fileName: "lista2.pdf", fileType: "pdf", filePath: "uploads/lista2.pdf", listNumber: 2 },
      { fileName: "lista3.pdf", fileType: "pdf", filePath: "uploads/lista3.pdf", listNumber: 3 },
      { fileName: "catalogo.xlsx", fileType: "excel", filePath: "uploads/catalogo.xlsx", listNumber: 1 },
    ];
    await File.bulkCreate(files);
    console.log("✅ Archivos de ejemplo agregados.");

    console.log("🌱 Base de datos lista para usar.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    process.exit(1);
  }
};

initializeDatabase();
