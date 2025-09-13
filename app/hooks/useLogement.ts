"use client";

import { useMutation } from "@tanstack/react-query";
 


export function useCreateLogement(token: string) {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/logement", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw err;
      }

      return res.json();
    },
  });
}
 
 