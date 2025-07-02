/** @type {import('next').NextConfig} */

// Verifica se está rodando no Mac
const isMac = process.platform === "darwin";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    // Desativa o LightningCSS só no Mac
    optimizeCss: !isMac,
  },
};

export default nextConfig;
