import { sequelize } from "./config/db.js";
import { User } from "./models/User.js";
import { PriceList } from "./models/PriceList.js";
import { File } from "./models/File.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";


const initializeDatabase = async () => {
  try {
    console.log("🌱 Inicializando base de datos...");

    await sequelize.authenticate();
    console.log("✅ Conexión establecida correctamente.");

    console.log("🔄 Sincronizando base de datos...");
    await sequelize.sync({ force: true }); // ⚠️ borra y recrea tablas
    console.log("✅ Tablas creadas correctamente.");

    // Crear listas de precios por defecto
    const lists = await Promise.all([
      PriceList.create({ listNumber: 1, name: "Lista de Precios 1", description: "Clientes con pago contado" }),
      PriceList.create({ listNumber: 2, name: "Lista de Precios 2", description: "Clientes con pago semanal" }),
      PriceList.create({ listNumber: 3, name: "Lista de Precios 3", description: "Clientes con pago mensual" }),
      PriceList.create({ listNumber: 4, name: "Lista de Precios 4", description: "Clientes con pago especial" }),
      PriceList.create({ listNumber: 5, name: "Lista de Precios 5", description: "Mayoristas o cuentas especiales" }),
    ]);
    console.log("✅ Listas de precios iniciales creadas.");

    // Crear usuarios de ejemplo
    const users = [
      { name: "Fulanito", email: "fulanito@mail.com", password: "1234", listNumber: 1 },
      { name: "Pedrito", email: "pedrito@mail.com", password: "2345", listNumber: 2 },
      { name: "JuanCito", email: "juan@mail.com", password: "3456", listNumber: 3 },
    ];

    for (const u of users) {
      const hash = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hash });
    }
    console.log("✅ Usuarios de ejemplo creados.");

    // Archivos de ejemplo
    await File.bulkCreate([
      { fileName: "lista1.pdf", fileType: "pdf", filePath: "uploads/lista1.pdf", listNumber: 1 },
      { fileName: "lista2.pdf", fileType: "pdf", filePath: "uploads/lista2.pdf", listNumber: 2 },
      { fileName: "lista3.pdf", fileType: "pdf", filePath: "uploads/lista3.pdf", listNumber: 3 },
      { fileName: "catalogo.xlsx", fileType: "excel", filePath: "uploads/catalogo.xlsx", listNumber: 1 },
    ]);
    console.log("✅ Archivos de ejemplo agregados.");

    console.log("🌱 Base de datos lista para usar.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    process.exit(1);
  }
};

initializeDatabase();
