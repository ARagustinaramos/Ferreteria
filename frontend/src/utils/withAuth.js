"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component, allowedRoles = []) {
  return function ProtectedPage(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) return router.replace("/");
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          return router.replace("/home");
        }
      }
    }, [user, loading]);

    if (loading || !user) return <p className="text-center mt-8">Cargando...</p>;

    return <Component {...props} />;
  };
}
