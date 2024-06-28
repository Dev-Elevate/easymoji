import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false, // So that popup build files don't get deleted
    rollupOptions: {
      input: {
        content: "./content_script/content-script.ts", // Entry Point
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
