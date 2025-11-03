"use client";
import UserTable from "../components/UserTable";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Gestión de Usuarios
      </h1>
      <UserTable />
    </div>
  );
}
