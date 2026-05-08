# react-mui-dockpanel

A DockPanel component library for React MUI that provides perimeter stacking.

![react-mui-dockpanel](./images/react-mui-dockpanel-120.png)

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/react-mui-dockpanel.svg)](https://www.npmjs.com/package/react-mui-dockpanel)

---

[(For Japanese language/日本語はこちら)](./README_ja.md)

> Please note that this English version of the document was machine-translated and then partially edited, so it may contain inaccuracies.
> We welcome pull requests to correct any errors in the text.

## What is this?

Have you ever wanted to design a website where the layout scales roughly in proportion to the page size while maintaining the logical arrangement of each component?
While this layout can be achieved using CSS Flexbox, managing and positioning components can often become cumbersome.
This is particularly common in administrative page layouts and is often used when implementing a so-called "Explorer-style" pane layout.

`DockPanel` is a layout component in React MUI that makes it easy to implement this type of page layout.

Child components are placed in the outer `Dock` panels according to the order in the JSX.
Each `Dock` takes up space from the remaining rectangle at that point, and the final `fill` takes the remaining space.

With TypeScript JSX like this (style declarations omitted):

```tsx
import { Dock, DockPanel } from "react-mui-dockpanel";

export const Workspace = () => (
  <DockPanel>
    <Dock dock="top">top[0]</Dock>
    <Dock dock="right">right[1]</Dock>
    <Dock dock="bottom">bottom[2]</Dock>
    <Dock dock="left">left[3]</Dock>
    <Dock>fill</Dock>
  </DockPanel>
);
```

The components inside each `Dock` are laid out like this:

![Stacking sequence](images/stacking_seq.png)

Each component consumes an edge in order, starting from the outermost perimeter and moving toward the center. The remaining area is occupied by the `fill` pane.
Each `Dock` area naturally follows changes to the outer bounds, so you only need to decide roughly which edge should contain each component to build responsive layouts.
This is especially useful for admin-style page designs.

> If you know layout rules such as "Windows Forms docking," this should feel familiar.

### Features

- Works as a lightweight layout component for React MUI
- Provides logical component layout without complex CSS flex declarations

---

## Installation

```bash
npm install react-mui-dockpanel
```

React and React MUI must also be available.
They are listed as `peerDependencies`, so install those packages manually in your application.

## Basic usage

```tsx
import { Box } from "@mui/material";
import { Dock, DockPanel } from "react-mui-dockpanel";

export const Workspace = () => (
  <DockPanel sx={{ width: 800, height: 600 }}>
    <Dock dock="top" size={48}>
      <Box sx={{ height: "100%" }}>Toolbar</Box>
    </Dock>
    <Dock dock="left" size={240}>
      <Box sx={{ height: "100%" }}>Navigation</Box>
    </Dock>
    <Dock dock="top" size="auto">
      <Box sx={{ height: 32 }}>Document tabs</Box>
    </Dock>
    <Dock>
      <Box sx={{ height: "100%" }}>Content</Box>
    </Dock>
  </DockPanel>
);
```

The default value of `dock` is `"fill"`, so the final `Dock` above is equivalent to `<Dock dock="fill">`.

## Stacking order

Dock placement depends on order. In this example:

```tsx
<DockPanel sx={{ width: 800, height: 600 }}>
  <Dock dock="top" size={100} />
  <Dock dock="left" size={200} />
  <Dock dock="top" size={50} />
  <Dock />
</DockPanel>
```

The following rectangles are produced:

| Pane      | Rectangle                             |
| --------- | ------------------------------------- |
| outer top | `x=0, y=0, width=800, height=100`     |
| left      | `x=0, y=100, width=200, height=500`   |
| inner top | `x=200, y=100, width=600, height=50`  |
| fill      | `x=200, y=150, width=600, height=450` |

The same direction can be specified multiple times. Each item consumes the rectangle that remains at that point.

## Size

`size` accepts numbers and CSS strings.

```tsx
<Dock dock="left" size={240} />
<Dock dock="right" size="25%" />
<Dock dock="top" size="auto" />
```

Numbers are treated as pixels. `"auto"` is the default and uses the natural size of the pane content.
When using natural size with `left` or `right`, the child component must provide a stable width.

`size` is ignored for `dock="fill"`.

## Fill rules

`DockPanel` supports zero or one fill pane.

```tsx
<DockPanel>
  <Dock dock="top" size={48} />
  <Dock />
</DockPanel>
```

Perimeter panes must be placed before the fill pane. If no fill pane is specified, the remaining rectangle is left empty.

---

## Limitations

For special components that make up page-level layouts, such as the MUI `AppBar` or `Drawer`, place them outside the `DockPanel`.

```tsx
import { AppBar, Box, Toolbar } from "@mui/material";
import { Dock, DockPanel } from "react-mui-dockpanel";

export const Shell = () => (
  <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
    <AppBar position="static">
      <Toolbar />
    </AppBar>
    <DockPanel sx={{ flex: "1 1 auto", minHeight: 0 }}>
      <Dock dock="left" size={240} />
      <Dock />
    </DockPanel>
  </Box>
);
```

If you place an `AppBar` inside a docked top pane, `position="static"` is recommended so it can participate in flex layout.
MUI `Drawer` can also be placed inside a pane, but the application must choose a variant and sizing that fit inside the `DockPanel` area.

---

## Development

```bash
npm install
npm run build
npm test
```

- `npm test` runs both Vitest unit tests and Playwright browser layout tests.
- Playwright screenshots are saved to `test-results/YYYYMMDD_HHmmss_fff/{test-name}/screenshot.png`.
- Playwright's internal `outputDir` is `.playwright-output`, so screenshots already saved under `test-results` are not removed during e2e runs.
- The e2e app does not assign concrete pixel sizes to `DockPanel`. It fills the full page, and the viewport configured by Playwright determines the measured layout and screenshot size.

## License

Under MIT.
