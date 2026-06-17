import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "host",
      exposes: {
        "./auth": "./src/auth.ts",
      },
      remotes: {
        products: {
          type: "module",
          name: "products",
          entry: "http://localhost:3001/remoteEntry.js",
          entryGlobalName: "products",
          shareScope: "default",
        },
        cart: {
          type: "module",
          name: "cart",
          entry: "http://localhost:3002/remoteEntry.js",
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