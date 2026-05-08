// react-mui-dockpanel - React MUI edge stacking layout component
// Copyright (c) Kouji Matsui (@kekyo@mi.kekyo.net)
// Under MIT.
// https://github.com/kekyo/react-mui-dockpanel/

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import prettierMax from "prettier-max";

export default defineConfig({
  root: "e2e/app",
  plugins: [react()],
  server: {
    fs: {
      allow: ["../.."],
    },
  },
});
