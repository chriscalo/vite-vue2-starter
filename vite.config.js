import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { disableHistoryFallback } from "./plugins/disable-history-fallback.js";

export default defineConfig({
  plugins: [
    createVuePlugin(),
    disableHistoryFallback(),
  ],
});
