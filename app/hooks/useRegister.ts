"use client";

import { useMutation } from "@tanstack/react-query";

interface RegisterInput {
  firstName: string;
  lastName: string;
  phone: string;
  secondphone:string; 
  password: string;
}

interface RegisterResponse {
  success?: boolean;
  userId?: string;
  error?: string;
}

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterInput>({
    mutationFn: async (data: RegisterInput) => {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur d'inscription");
      }

      return res.json();
    },
  });
}
