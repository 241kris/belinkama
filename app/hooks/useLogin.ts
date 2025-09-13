 "use client";

import { useMutation } from "@tanstack/react-query";

interface LoginInput {
  phone: string;
  password: string;
}

interface LoginResponse {
  success?: boolean;
  userId?: string;
  error?: string;
}

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (data: LoginInput) => {
      // Toujours préfixer le numéro par +241
      const payload = {
        phone: data.phone.startsWith("+241") ? data.phone : `+241${data.phone}`,
        password: data.password,
      };

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur de connexion");
      }

      return res.json();
    },
  });
}
