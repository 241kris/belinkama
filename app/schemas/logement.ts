 // app/schemas/logement.ts
import { z } from "zod";

export const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const logementSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  type: z.string().min(2, "Le type est obligatoire"),
  prix: z.number().int().positive("Le prix doit être un entier positif"),
  charge: z.boolean(),
  lieu: z.string().min(2, "Le lieu est obligatoire"),

  // ❌ Supprime ou rends optionnel si tu stockes les images en table séparée
  image: z.array(z.string().url()).max(6, "Maximum 6 images autorisées").optional(),

  douche: z.number().nullable().optional(),    
  cuisine: z.number().nullable().optional(),  
  chambre: z.number().nullable().optional(),
  toilette: z.boolean().optional(),
  description: z.string(),
  particularité: z.any(),

  visible: z.boolean().default(true),
});
