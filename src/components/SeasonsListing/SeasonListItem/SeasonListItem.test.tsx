import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";
import SeasonListItem from "./SeasonListItem";
import type { Season } from "../../../types/types";

const mockSeason: Season = {
  season: 2024,
  url: "example.com",
};

const renderSeasonCard = (season: Season = mockSeason) => {
  return render(
    <BrowserRouter>
      <SeasonListItem season={season} />
    </BrowserRouter>
  );
};

describe("SeasonCard", () => {
  test("renders the season year and title", () => {
    renderSeasonCard();

    expect(screen.getByText("2024")).toBeDefined();
    expect(screen.getByText("Formula One Season")).toBeDefined();
    expect(screen.getByText("F1")).toBeDefined();
  });

  test("opens the season page when clicking the main navigation link", () => {
    renderSeasonCard();

    const mainLink = screen.getByTestId("season-2024-list-item");
    expect(mainLink).toBeDefined();
    expect(mainLink.getAttribute("href")).toBe("/seasons/2024");
  });

  test("opens Wikipedia link in new tab when clicking the Wikipedia button", async () => {
    const windowOpenSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);

    renderSeasonCard();

    const wikipediaButton = screen.getByTestId("season-2024-wikipedia-button");

    await userEvent.click(wikipediaButton);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      "example.com",
      "_blank",
      "noopener,noreferrer"
    );

    windowOpenSpy.mockRestore();
  });
});
