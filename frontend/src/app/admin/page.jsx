"use client";

import { useAuth } from "../context/AuthContext";
import UserTable from "./components/UserTable";
import PriceListsPanel from "./components/PriceListsPanel";
import withAuth from "@/utils/withAuth";

function UsersPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="mt-20 inline-flex items-center gap-2 text-3xl font-bold text-emerald-800 tracking-tight">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A2.992 2.992 0 017 17h10c.795 0 1.558.31 2.121.868M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
  Gestión de Usuarios
</h1>
      <UserTable />
      <PriceListsPanel />
    </div>
  );
}

export default withAuth(UsersPage, ["admin"]);
