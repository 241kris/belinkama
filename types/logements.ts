// types/logement.ts
export type ImageType = {
  id: string;
  secureUrl: string;
  logementId: string;
};

export type Logement = {
  slug: string; // ✅ obligatoire
  id: string;
  titre: string;
  type: string;
  prix: number;
  charge: boolean;
  visible: boolean;
  lieu: string;
  status: string;
  images: ImageType[];
  douche?: number | null;
  cuisine?: number | null;
  chambre?: number | null;
  toilette?: boolean | null;
  description: string;
  particularité: string[];
  createdAt: string;
  user: {
    secondphone: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
};
