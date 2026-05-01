import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

/**
 * Custom Vite plugin: converts the render-blocking <link rel="stylesheet">
 * into a non-render-blocking async load pattern. This lets the browser paint
 * our static HTML hero (in index.html) immediately without waiting for CSS.
 *
 * Technique: media="print" with onload swap to "all"
 * Fallback: <noscript> with blocking stylesheet for non-JS environments
 */
function asyncCssPlugin(): Plugin {
  return {
    name: "async-css",
    enforce: "post",
    transformIndexHtml(html) {
      // Only apply in production build
      return html.replaceAll(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        `<link rel="stylesheet" href="$1" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="$1" /></noscript>`
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  test: {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/tests/**",
      "**/*.spec.ts",
      "**/*.e2e.ts",
    ],
  },
  plugins: [react(), asyncCssPlugin()].filter(Boolean),
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
