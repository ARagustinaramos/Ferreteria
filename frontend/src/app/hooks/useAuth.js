"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    } catch (e) {
      console.error("Error parsing user from storage");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  return { user, loading, logout };
}
