/// <reference types="vitest" />
import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin(), visualizer()],
  resolve: {
    alias: {
      src: resolve(__dirname, "./src"),
    },
  },
});
