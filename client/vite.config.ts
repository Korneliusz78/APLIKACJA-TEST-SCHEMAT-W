import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "assets/sunset.svg", "icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "Test Schematów",
        short_name: "Test Schematów",
        description: "Telefonowa aplikacja PWA: test + wyniki + AI + apteczka ćwiczeń.",
        theme_color: "#0B3D2E",
        background_color: "#0B3D2E",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8787"
    }
  }
});
