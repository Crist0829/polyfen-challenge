import { defineConfig } from "vite";
import path from 'path'
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server : {
    host : '0.0.0.0',
    watch: {
      usePolling: true
  }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
