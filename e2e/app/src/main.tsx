// react-mui-dockpanel - React MUI edge stacking layout component
// Copyright (c) Kouji Matsui (@kekyo@mi.kekyo.net)
// Under MIT.
// https://github.com/kekyo/react-mui-dockpanel/

import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { Dock, DockPanel } from "../../../src/index.js";
import "./style.css";

const panelSx = {
  backgroundColor: "#f8fafc",
  height: "100%",
  outline: "2px solid #111827",
  width: "100%",
};

const paneSx = (backgroundColor: string): SxProps<Theme> => ({
  alignItems: "center",
  backgroundColor,
  boxSizing: "border-box",
  color: "#111827",
  display: "flex",
  fontFamily: "Arial, sans-serif",
  fontSize: 21,
  fontWeight: 700,
  justifyContent: "center",
  minHeight: 0,
  minWidth: 0,
  outline: "2px solid rgba(17, 24, 39, 0.55)",
  outlineOffset: -2,
  overflow: "hidden",
});

const contentSx: SxProps<Theme> = {
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
};

const TopFillCase = () => (
  <DockPanel sx={panelSx}>
    <Dock data-testid="top" dock="top" size={100} sx={paneSx("#bfdbfe")}>
      top[0]
    </Dock>
    <Dock data-testid="fill" sx={paneSx("#bbf7d0")}>
      fill
    </Dock>
  </DockPanel>
);

const LeftFillCase = () => (
  <DockPanel sx={panelSx}>
    <Dock data-testid="left" dock="left" size={200} sx={paneSx("#fecaca")}>
      left[0]
    </Dock>
    <Dock data-testid="fill" sx={paneSx("#bbf7d0")}>
      fill
    </Dock>
  </DockPanel>
);

const TopLeftFillCase = () => (
  <DockPanel sx={panelSx}>
    <Dock data-testid="top" dock="top" size={100} sx={paneSx("#bfdbfe")}>
      top[0]
    </Dock>
    <Dock data-testid="left" dock="left" size={200} sx={paneSx("#fecaca")}>
      left[1]
    </Dock>
    <Dock data-testid="fill" sx={paneSx("#bbf7d0")}>
      fill
    </Dock>
  </DockPanel>
);

const TopLeftTopFillCase = () => (
  <DockPanel sx={panelSx}>
    <Dock data-testid="outer-top" dock="top" size={100} sx={paneSx("#bfdbfe")}>
      top[0]
    </Dock>
    <Dock data-testid="left" dock="left" size={200} sx={paneSx("#fecaca")}>
      left[1]
    </Dock>
    <Dock data-testid="inner-top" dock="top" size={50} sx={paneSx("#fde68a")}>
      top[2]
    </Dock>
    <Dock data-testid="fill" sx={paneSx("#bbf7d0")}>
      fill
    </Dock>
  </DockPanel>
);

const AllEdgesCase = () => (
  <DockPanel sx={panelSx}>
    <Dock data-testid="top" dock="top" size={100} sx={paneSx("#bfdbfe")}>
      top[0]
    </Dock>
    <Dock data-testid="right" dock="right" size={120} sx={paneSx("#ddd6fe")}>
      right[1]
    </Dock>
    <Dock data-testid="bottom" dock="bottom" size={80} sx={paneSx("#fed7aa")}>
      bottom[2]
    </Dock>
    <Dock data-testid="left" dock="left" size={200} sx={paneSx("#fecaca")}>
      left[3]
    </Dock>
    <Dock data-testid="fill" sx={paneSx("#bbf7d0")}>
      fill
    </Dock>
  </DockPanel>
);

const AllEdgesCase2 = () => (
  <DockPanel sx={panelSx}>
    <Dock data-testid="top" dock="top" sx={paneSx("#bfdbfe")}>
      <Box sx={{ ...contentSx, height: 100, width: "100%" }}>top[0]</Box>
    </Dock>
    <Dock data-testid="right" dock="right" sx={paneSx("#ddd6fe")}>
      <Box sx={{ ...contentSx, height: "100%", width: 120 }}>right[1]</Box>
    </Dock>
    <Dock data-testid="bottom" dock="bottom" sx={paneSx("#fed7aa")}>
      <Box sx={{ ...contentSx, height: 80, width: "100%" }}>bottom[2]</Box>
    </Dock>
    <Dock data-testid="left" dock="left" sx={paneSx("#fecaca")}>
      <Box sx={{ ...contentSx, height: "100%", width: 200 }}>left[3]</Box>
    </Dock>
    <Dock data-testid="fill" sx={paneSx("#bbf7d0")}>
      fill
    </Dock>
  </DockPanel>
);

const RepeatedTopCase = () => (
  <DockPanel sx={panelSx}>
    <Dock data-testid="top-1" dock="top" size={100} sx={paneSx("#bfdbfe")}>
      top[0]
    </Dock>
    <Dock data-testid="top-2" dock="top" size={50} sx={paneSx("#fde68a")}>
      top[1]
    </Dock>
    <Dock data-testid="fill" sx={paneSx("#bbf7d0")}>
      fill
    </Dock>
  </DockPanel>
);

const AutoSizeCase = () => (
  <DockPanel sx={panelSx}>
    <Dock data-testid="auto-top" dock="top" size="auto" sx={paneSx("#bfdbfe")}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          height: 70,
          justifyContent: "center",
        }}
      >
        top[0]
      </Box>
    </Dock>
    <Dock data-testid="auto-left" dock="left" size="auto" sx={paneSx("#fecaca")}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: 90,
        }}
      >
        left[1]
      </Box>
    </Dock>
    <Dock data-testid="auto-fill" sx={paneSx("#bbf7d0")}>
      fill
    </Dock>
  </DockPanel>
);

const cases = new Map<string, ReactElement>([
  ["/top-fill", <TopFillCase />],
  ["/left-fill", <LeftFillCase />],
  ["/top-left-fill", <TopLeftFillCase />],
  ["/top-left-top-fill", <TopLeftTopFillCase />],
  ["/all-edges", <AllEdgesCase />],
  ["/all-edges2", <AllEdgesCase2 />],
  ["/repeated-top", <RepeatedTopCase />],
  ["/auto-size", <AutoSizeCase />],
]);

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error("Root element was not found.");
}

createRoot(rootElement).render(cases.get(window.location.pathname) ?? <TopLeftTopFillCase />);
