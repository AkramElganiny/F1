import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { describe, expect, test } from "vitest";
import Navbar from "./Navbar";

describe("Navbar", () => {
  test("renders navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Formula One Explorer")).toBeDefined();
    expect(screen.getByTestId("navbar-home-link")).toBeDefined();
    expect(screen.getByTestId("navbar-seasons-link")).toBeDefined();
  });

  test("slides mobile menu up and down when clicking the menu button", async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const menuButton = screen.getByRole("button", { name: /open main menu/i });
    const mobileMenu = screen.getByTestId("mobile-menu");

    expect(mobileMenu.className).toContain("-translate-y-full");

    await userEvent.click(menuButton);
    expect(mobileMenu.className).toContain("translate-y-0");
    expect(mobileMenu.className).not.toContain("-translate-y-full");

    await userEvent.click(menuButton);
    expect(mobileMenu.className).toContain("-translate-y-full");
  });

  test("closes mobile menu when clicking a link", async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    await userEvent.click(
      screen.getByRole("button", { name: /open main menu/i })
    );
    await userEvent.click(screen.getByTestId("navbar-seasons-link-mobile"));

    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu.className).toContain("-translate-y-full");
  });
});
