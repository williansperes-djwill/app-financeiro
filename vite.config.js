import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173
  },

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: true
      },

      manifest: {
        name: "Controle Financeiro JMC",
        short_name: "Financeiro",

        description: "Aplicativo de controle financeiro pessoal",

        start_url: "/",
        scope: "/",

        display: "standalone",
        orientation: "portrait",

        background_color: "#0f0f10",
        theme_color: "#0f0f10",

        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});