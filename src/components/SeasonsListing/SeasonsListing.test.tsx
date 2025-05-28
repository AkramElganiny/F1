import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { describe, expect, test } from "vitest";
import SeasonsListing from "./SeasonsListing";
import { pageViewMode, type Season } from "../../types/types";

const mockSeasons: Season[] = [
  {
    season: 2024,
    url: "example.com",
  },
  {
    season: 2023,
    url: "example.com",
  },
  {
    season: 2022,
    url: "example.com",
  },
];

const defaultProps = {
  seasons: mockSeasons,
  itemsPerPage: 8,
  currentPage: 1,
  loading: false,
  view: pageViewMode.CARD,
  error: null,
};

const renderSeasonsListing = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(
    <BrowserRouter>
      <SeasonsListing {...mergedProps} />
    </BrowserRouter>
  );
};

describe("SeasonsListing", () => {
  test("renders seasons in card view by default", () => {
    renderSeasonsListing();

    expect(screen.getByTestId("seasons-listing-container")).toBeDefined();
    expect(screen.getByTestId("seasons-card-grid")).toBeDefined();
    expect(screen.queryByTestId("seasons-list-container")).toBeNull();

    // Check that season cards are rendered
    expect(screen.getByTestId("season-2024-card")).toBeDefined();
    expect(screen.getByTestId("season-2023-card")).toBeDefined();
    expect(screen.getByTestId("season-2022-card")).toBeDefined();
  });

  test("renders seasons in list view when view prop is LIST", () => {
    renderSeasonsListing({ view: pageViewMode.LIST });

    expect(screen.getByTestId("seasons-listing-container")).toBeDefined();
    expect(screen.getByTestId("seasons-list-container")).toBeDefined();
    expect(screen.queryByTestId("seasons-card-grid")).toBeNull();

    // Check that season list items are rendered
    expect(screen.getByTestId("season-2024-list-item")).toBeDefined();
    expect(screen.getByTestId("season-2023-list-item")).toBeDefined();
    expect(screen.getByTestId("season-2022-list-item")).toBeDefined();
  });

  test("displays loading skeleton when loading is true", () => {
    renderSeasonsListing({ loading: true });

    expect(screen.getByTestId("loading-skeleton")).toBeDefined();
    expect(screen.queryByTestId("seasons-listing-container")).toBeNull();
  });

  test("displays error message when error prop is provided", () => {
    const errorMessage = "Failed to fetch seasons";
    renderSeasonsListing({ error: errorMessage });

    expect(screen.getByTestId("seasons-listing-error")).toBeDefined();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeDefined();
    expect(screen.queryByTestId("seasons-listing-container")).toBeNull();
  });

  test("displays empty state when no seasons are provided", () => {
    renderSeasonsListing({ seasons: [] });

    expect(screen.getByTestId("seasons-listing-empty")).toBeDefined();
    expect(screen.getByText("No seasons found")).toBeDefined();
    expect(
      screen.getByText(
        "There are no Formula One seasons to display at the moment."
      )
    ).toBeDefined();
    expect(screen.queryByTestId("seasons-listing-container")).toBeNull();
  });

  test("renders correct number of seasons", () => {
    renderSeasonsListing();

    const seasonCards = screen.getAllByText("Formula One Season");
    expect(seasonCards).toHaveLength(3);
  });
});
