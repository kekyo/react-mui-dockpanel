// react-mui-dockpanel - React MUI edge stacking layout component
// Copyright (c) Kouji Matsui (@kekyo@mi.kekyo.net)
// Under MIT.
// https://github.com/kekyo/react-mui-dockpanel/

import { resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import prettierMax from "prettier-max";
import screwUp from "screw-up";
import dts from "unplugin-dts/vite";

export default defineConfig({
  plugins: [
    prettierMax(),
    screwUp(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: resolve(fileURLToPath(new URL(".", import.meta.url)), "tsconfig.build.json"),
    }),
    react(),
  ],
  build: {
    emptyOutDir: true,
    lib: {
      name: "react-mui-dockpanel",
      entry: "src/index.ts",
      fileName: (format, entryName) => `${entryName}.${format === "es" ? "mjs" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    rolldownOptions: {
      external: ["@mui/material", "react", "react-dom"],
    },
    sourcemap: true,
    minify: false,
  },
});
