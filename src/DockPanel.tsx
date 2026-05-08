// react-mui-dockpanel - React MUI edge stacking layout component
// Copyright (c) Kouji Matsui (@kekyo@mi.kekyo.net)
// Under MIT.
// https://github.com/kekyo/react-mui-dockpanel/

import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { Children, Fragment, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";

const dockComponentMarker = Symbol.for("react-mui-dockpanel.dock");

/**
 * Dock target used by a {@link Dock} item.
 *
 * @remarks
 * Edge targets consume the current remaining rectangle in JSX order. The
 * `fill` target occupies the final remaining rectangle.
 */
export type DockPosition = "top" | "right" | "bottom" | "left" | "fill";

/**
 * Docked pane size.
 *
 * @remarks
 * Numeric values are treated as pixels. String values are passed to CSS as the
 * flex basis, and `"auto"` lets the pane use the natural size of its contents.
 */
export type DockSize = number | string;

/**
 * Props for a docked pane inside {@link DockPanel}.
 *
 * @remarks
 * `Dock` is a metadata component. When it is placed directly under
 * `DockPanel`, its non-docking props are applied to the rendered MUI `Box`
 * pane. When rendered outside `DockPanel`, it only renders its children.
 */
export interface DockProps extends Omit<BoxProps, "children"> {
  /**
   * Target edge for this pane.
   *
   * @defaultValue "fill"
   */
  readonly dock?: DockPosition;

  /**
   * Size consumed by an edge pane.
   *
   * @remarks
   * Ignored when `dock` is `"fill"`. Defaults to `"auto"` for edge panes.
   */
  readonly size?: DockSize;

  /**
   * Pane content.
   */
  readonly children?: ReactNode;
}

/**
 * Props for {@link DockPanel}.
 */
export interface DockPanelProps extends Omit<BoxProps, "children"> {
  /**
   * Direct children must be {@link Dock} items. Fragments and empty values are
   * flattened before validation.
   */
  readonly children?: ReactNode;
}

interface DockComponentMarker {
  readonly [dockComponentMarker]: true;
}

type DockComponent = ((props: DockProps) => ReactElement | null) & DockComponentMarker;

interface DockItem {
  readonly dock: DockPosition;
  readonly element: ReactElement<DockProps>;
  readonly index: number;
  readonly size: DockSize;
}

const basePanelSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  minWidth: 0,
  overflow: "hidden",
};

const remainingSx: SxProps<Theme> = {
  display: "flex",
  flex: "1 1 auto",
  minHeight: 0,
  minWidth: 0,
};

const fillPaneSx: SxProps<Theme> = {
  flex: "1 1 auto",
  minHeight: 0,
  minWidth: 0,
};

const isDockPosition = (value: unknown): value is DockPosition =>
  value === "top" ||
  value === "right" ||
  value === "bottom" ||
  value === "left" ||
  value === "fill";

const isDockComponent = (value: unknown): value is DockComponent =>
  typeof value === "function" &&
  (value as Partial<DockComponentMarker>)[dockComponentMarker] === true;

const isFragmentElement = (
  value: ReactNode,
): value is ReactElement<{ readonly children?: ReactNode }> =>
  isValidElement(value) && value.type === Fragment;

const mergeSx = (base: SxProps<Theme>, override: SxProps<Theme> | undefined): SxProps<Theme> => {
  if (override === undefined) {
    return base;
  }

  return (Array.isArray(override) ? [base, ...override] : [base, override]) as SxProps<Theme>;
};

const flattenChildren = (children: ReactNode): readonly ReactNode[] => {
  const flattened: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (child === null || child === undefined || typeof child === "boolean") {
      return;
    }

    if (isFragmentElement(child)) {
      flattened.push(...flattenChildren(child.props.children));
      return;
    }

    flattened.push(child);
  });

  return flattened;
};

const normalizeSize = (size: DockSize | undefined): DockSize => size ?? "auto";

const toFlexBasis = (size: DockSize): string => (typeof size === "number" ? `${size}px` : size);

const validateSize = (size: unknown, index: number): DockSize => {
  if (typeof size === "number" || typeof size === "string" || size === undefined) {
    return normalizeSize(size);
  }

  throw new Error(`DockPanel child at index ${index} has an invalid size value.`);
};

const toDockItems = (children: ReactNode): readonly DockItem[] => {
  const flattened = flattenChildren(children);
  const items: DockItem[] = [];
  let fillIndex: number | undefined = undefined;

  flattened.forEach((child, index) => {
    if (!isValidElement(child) || !isDockComponent(child.type)) {
      throw new Error("DockPanel direct children must be Dock components.");
    }

    const dockElement = child as ReactElement<DockProps>;
    const dock = dockElement.props.dock ?? "fill";

    if (!isDockPosition(dock)) {
      throw new Error(`DockPanel child at index ${index} has an invalid dock value.`);
    }

    if (dock === "fill") {
      if (fillIndex !== undefined) {
        throw new Error("DockPanel can contain only one fill Dock.");
      }

      fillIndex = index;
    } else if (fillIndex !== undefined) {
      throw new Error("DockPanel edge Dock items must appear before the fill Dock.");
    }

    items.push({
      dock,
      element: dockElement,
      index,
      size: validateSize(dockElement.props.size, index),
    });
  });

  return items;
};

const createPane = (item: DockItem, sx: SxProps<Theme>): ReactElement => {
  const { children, dock: _dock, size: _size, sx: itemSx, ...boxProps } = item.element.props;

  return (
    <Box {...boxProps} key={`dock-panel-pane-${item.index}`} sx={mergeSx(sx, itemSx)}>
      {children}
    </Box>
  );
};

const createEmptyFillPane = (): ReactElement => (
  <Box aria-hidden="true" data-dockpanel-empty-fill="" sx={fillPaneSx} />
);

const createEdgePaneSx = (item: DockItem): SxProps<Theme> => ({
  flex: `0 0 ${toFlexBasis(item.size)}`,
  minHeight: 0,
  minWidth: 0,
});

const wrapDockItem = (item: DockItem, remaining: ReactElement): ReactElement => {
  const isHorizontal = item.dock === "left" || item.dock === "right";
  const wrapperSx = mergeSx(remainingSx, {
    flexDirection: isHorizontal ? "row" : "column",
  });
  const pane = createPane(item, createEdgePaneSx(item));

  if (item.dock === "top" || item.dock === "left") {
    return (
      <Box key={`dock-panel-wrapper-${item.index}`} sx={wrapperSx}>
        {pane}
        {remaining}
      </Box>
    );
  }

  return (
    <Box key={`dock-panel-wrapper-${item.index}`} sx={wrapperSx}>
      {remaining}
      {pane}
    </Box>
  );
};

const createDockContent = (items: readonly DockItem[]): ReactElement => {
  const fillItem = items.find((item) => item.dock === "fill");
  const edgeItems = items.filter((item) => item.dock !== "fill");
  let content = fillItem === undefined ? createEmptyFillPane() : createPane(fillItem, fillPaneSx);

  for (let index = edgeItems.length - 1; index >= 0; index -= 1) {
    const item = edgeItems[index];

    if (item !== undefined) {
      content = wrapDockItem(item, content);
    }
  }

  return content;
};

const DockImplementation = ((props: DockProps): ReactElement => (
  <>{props.children}</>
)) as DockComponent;

Object.defineProperty(DockImplementation, dockComponentMarker, {
  value: true,
});

/**
 * Declares a pane consumed by a parent {@link DockPanel}.
 *
 * @remarks
 * `Dock` defaults to `dock="fill"`. Non-docking props such as `sx`,
 * `className`, and `data-testid` are forwarded to the pane rendered by
 * `DockPanel`.
 */
export const Dock: (props: DockProps) => ReactElement | null = DockImplementation;

/**
 * WinForms-style DockPanel implemented with nested MUI flex boxes.
 *
 * @remarks
 * Children are processed in JSX order. Edge panes consume the current outer
 * edge of the remaining rectangle, and the single fill pane receives the final
 * remaining rectangle.
 */
export const DockPanel = (props: DockPanelProps): ReactElement => {
  const { children, sx, ...boxProps } = props;
  const items = toDockItems(children);

  return (
    <Box {...boxProps} sx={mergeSx(basePanelSx, sx)}>
      {createDockContent(items)}
    </Box>
  );
};
