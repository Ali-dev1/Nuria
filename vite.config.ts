import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core", "react-is", "scheduler"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@radix-ui')) return 'ui-radix';
          if (id.includes('node_modules/lucide-react')) return 'ui-icons';
          if (id.includes('node_modules/@supabase')) return 'data-supabase';
          if (id.includes('node_modules/@tanstack')) return 'data-query';
          if (id.includes('node_modules/recharts')) return 'ui-charts';
        },
      },
    },
  },
}));
