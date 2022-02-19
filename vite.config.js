import { defineConfig } from "vite";
import mix from "vite-plugin-mix";
import { createVuePlugin } from "vite-plugin-vue2";

export default defineConfig({
  plugins: [
    mix({
      handler: "./api/index.js",
    }),
    createVuePlugin(),
  ],
});
