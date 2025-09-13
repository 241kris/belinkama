"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) throw new Error("Erreur lors de la déconnexion");
      return res.json();
    },
    onSuccess: () => {
      router.push("/login");
    },
  });
}
