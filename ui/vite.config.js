import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { noFallback } from "vite-plugin-no-fallback";

export default defineConfig({
  plugins: [
    createVuePlugin(),
    noFallback(),
  ],
});
