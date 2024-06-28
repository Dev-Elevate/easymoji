import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false, // So that popup and content build files don't get deleted
    target: "node16",
    rollupOptions: {
      input: {
        background: "./background/background.ts", // Entry Point
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
