import { AliasOptions, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
const root = path.resolve(__dirname, "src");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": root,
    } as AliasOptions,
  },
  build: {
    chunkSizeWarningLimit: 1000, // Adjust the limit as needed
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"], // Example for splitting out common libraries
        },
      },
    },
  },
});
