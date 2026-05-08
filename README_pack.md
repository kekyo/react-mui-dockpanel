# react-mui-dockpanel

A DockPanel component library for React MUI that provides perimeter stacking.

![react-mui-dockpanel](./images/react-mui-dockpanel-120.png)

[![Project Status: Active - The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What is this?

`DockPanel` consumes perimeter panes according to the order of JSX. Each `Dock` takes an area from the rectangle that remains at that point, and the final `fill` receives the leftover area.

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

React and React MUI must also be available. They are listed as `peerDependencies`, so install those packages manually in your application.

---

## Documentation

More information, [see the repository documentation](https://github.com/kekyo/react-mui-dockpanel).

## License

Under MIT.
