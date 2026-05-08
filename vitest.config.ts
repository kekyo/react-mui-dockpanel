// react-mui-dockpanel - React MUI edge stacking layout component
// Copyright (c) Kouji Matsui (@kekyo@mi.kekyo.net)
// Under MIT.
// https://github.com/kekyo/react-mui-dockpanel/

import react from "@vitejs/plugin-react";
import prettierMax from "prettier-max";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    prettierMax({
      typescript: "tsconfig.build.json",
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"],
  },
});
