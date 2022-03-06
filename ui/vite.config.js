import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { removeHistoryFallback } from "./plugins/remove-history-fallback.js";

export default defineConfig({
  plugins: [
    createVuePlugin(),
    removeHistoryFallback(),
  ],
});
