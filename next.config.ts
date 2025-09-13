  import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // autorise toutes les images de Cloudinary
      },
    ],
  },

  turbopack: {
    // 🚩 on force la racine sur ton projet "belinkama"
    root: __dirname,
  },
};

export default nextConfig;
