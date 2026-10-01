import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";
import eslint from "vite-plugin-eslint";
import path from "node:path";

export default defineConfig({
  vite: {
    plugins: [tailwindcss(), /*eslint(), checker({ typescript: true })*/],
    // @kobalte/core/rating-group is not released yet, so our custom
    // rating-group primitives import from @kobalte/core/src/... internals.
    // This alias maps those deep imports to the source files shipped in the
    // kobalte package, which Vite transpiles at runtime.
    resolve: {
      alias: {
        "@kobalte/core/src": path.resolve("node_modules/@kobalte/core/src"),
      },
    },
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },
});
