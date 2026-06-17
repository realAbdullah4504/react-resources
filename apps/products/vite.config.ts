import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "products",
      filename: "remoteEntry.js",
      exposes: {
        "./Products": "./src/Products.tsx",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.0.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
      },
    }),
    react(),
  ],
  server: {
    port: 3001,
    strictPort: true,
    // Required — tells the dev server what URL it's served from
    // so the remote entry is reachable from the host
    origin: "http://localhost:3001",
  },
  build: {
    target: "esnext",
  },
});