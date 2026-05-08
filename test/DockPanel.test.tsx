// react-mui-dockpanel - React MUI edge stacking layout component
// Copyright (c) Kouji Matsui (@kekyo@mi.kekyo.net)
// Under MIT.
// https://github.com/kekyo/react-mui-dockpanel/

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Dock, DockPanel } from "../src/index.js";

afterEach(() => {
  cleanup();
});

describe("DockPanel", () => {
  it("uses fill when dock is omitted", () => {
    render(
      <DockPanel data-testid="panel">
        <Dock data-testid="fill">Fill</Dock>
      </DockPanel>,
    );

    const fill = screen.getByTestId("fill");

    expect(fill.textContent).toBe("Fill");
    expect(getComputedStyle(fill).flexGrow).toBe("1");
  });

  it("converts numeric sizes to pixel flex basis values", () => {
    render(
      <DockPanel>
        <Dock data-testid="left" dock="left" size={240}>
          Left
        </Dock>
        <Dock data-testid="fill">Fill</Dock>
      </DockPanel>,
    );

    expect(getComputedStyle(screen.getByTestId("left")).flexBasis).toBe("240px");
  });

  it("keeps auto sizes as natural flex basis values", () => {
    render(
      <DockPanel>
        <Dock data-testid="top" dock="top" size="auto">
          Top
        </Dock>
        <Dock data-testid="fill">Fill</Dock>
      </DockPanel>,
    );

    expect(getComputedStyle(screen.getByTestId("top")).flexBasis).toBe("auto");
  });

  it("flattens fragments before validating Dock children", () => {
    render(
      <DockPanel>
        <>
          <Dock data-testid="top" dock="top" size={10}>
            Top
          </Dock>
        </>
        <Dock data-testid="fill">Fill</Dock>
      </DockPanel>,
    );

    expect(screen.getByTestId("top").textContent).toBe("Top");
    expect(screen.getByTestId("fill").textContent).toBe("Fill");
  });

  it("rejects direct non-Dock children", () => {
    expect(() =>
      render(
        <DockPanel>
          <div>Invalid</div>
        </DockPanel>,
      ),
    ).toThrow("DockPanel direct children must be Dock components.");
  });

  it("rejects multiple fill items", () => {
    expect(() =>
      render(
        <DockPanel>
          <Dock>Fill 1</Dock>
          <Dock>Fill 2</Dock>
        </DockPanel>,
      ),
    ).toThrow("DockPanel can contain only one fill Dock.");
  });

  it("rejects edge items after fill", () => {
    expect(() =>
      render(
        <DockPanel>
          <Dock>Fill</Dock>
          <Dock dock="bottom">Bottom</Dock>
        </DockPanel>,
      ),
    ).toThrow("DockPanel edge Dock items must appear before the fill Dock.");
  });
});
