"use client";

import { useQuery } from "@tanstack/react-query";



export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("Impossible de récupérer l'utilisateur");
      const data = await res.json();
      return data.user || null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
