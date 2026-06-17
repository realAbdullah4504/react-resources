import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "host",
      remotes: {
        products: {
          type: "module",
          name: "products",
          entry: "https://products-azure-five.vercel.app/remoteEntry.js",
          entryGlobalName: "products",
          shareScope: "default",
        },
        cart: {
          type: "module",
          name: "cart",
          entry: "https://cart-beryl-two.vercel.app/remoteEntry.js",
          entryGlobalName: "cart",
          shareScope: "default",
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
      },
    }),
    react(),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    target: "esnext",
  },
});