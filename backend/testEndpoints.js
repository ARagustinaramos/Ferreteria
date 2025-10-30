import fetch from "node-fetch";

const BASE_URL = "http://localhost:3001";

// 🔹 Test ruta raíz
const testRoot = async () => {
  try {
    const res = await fetch(`${BASE_URL}/`);
    const text = await res.text();
    console.log("Ruta / :", text);
  } catch (err) {
    console.error("Error en / :", err.message);
  }
};

// 🔹 Test login de usuario
const testLogin = async () => {
  try {
    const res = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "Fulanito", password: "1234" }),
    });

    if (!res.ok) {
      console.error("Login falló con status:", res.status);
      const text = await res.text();
      console.error(text);
      return;
    }

    const data = await res.json();
    console.log("Login response:", data);
  } catch (err) {
    console.error("Error en login:", err.message);
  }
};

// 🔹 Test creación de usuario (admin)
const testCreateUser = async () => {
  try {
    const res = await fetch(`${BASE_URL}/admin/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "TestUser",
        email: "testuser@mail.com",
        password: "abcd1234",
        listNumber: 1,
      }),
    });

    if (!res.ok) {
      console.error("Creación de usuario falló con status:", res.status);
      const text = await res.text();
      console.error(text);
      return;
    }

    const data = await res.json();
    console.log("Crear usuario response:", data);
  } catch (err) {
    console.error("Error creando usuario:", err.message);
  }
};

// 🔹 Ejecutar todos los tests
const runTests = async () => {
  await testRoot();
  await testLogin();
  await testCreateUser();
};

runTests();
