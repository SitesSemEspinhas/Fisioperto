/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Avatares gerados para os perfis de demonstração
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
      // Fotos carregadas para o Supabase Storage (bucket público "avatars")
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
