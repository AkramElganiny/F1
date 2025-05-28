import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";
import RacesListing from "./RacesListing";
import { pageViewMode, type Race } from "../../types/types";

const mockRaces: Race[] = [
  {
    season: "2024",
    round: "1",
    url: "https://example.com/race1",
    raceName: "Bahrain Grand Prix",
    Circuit: {
      circuitId: "bahrain",
      url: "https://example.com/circuit1",
      circuitName: "Bahrain International Circuit",
      Location: {
        lat: "26.0325",
        long: "50.5106",
        locality: "Sakhir",
        country: "Bahrain",
      },
    },
    date: "2024-03-02",
  },
  {
    season: "2024",
    round: "2",
    url: "https://example.com/race2",
    raceName: "Saudi Arabian Grand Prix",
    Circuit: {
      circuitId: "jeddah",
      url: "https://example.com/circuit2",
      circuitName: "Jeddah Corniche Circuit",
      Location: {
        lat: "21.6319",
        long: "39.1044",
        locality: "Jeddah",
        country: "Saudi Arabia",
      },
    },
    date: "2024-03-09",
  },
  {
    season: "2024",
    round: "3",
    url: "https://example.com/race3",
    raceName: "Australian Grand Prix",
    Circuit: {
      circuitId: "albert_park",
      url: "https://example.com/circuit3",
      circuitName: "Albert Park Grand Prix Circuit",
      Location: {
        lat: "-37.8497",
        long: "144.968",
        locality: "Melbourne",
        country: "Australia",
      },
    },
    date: "2024-03-24",
  },
];

const defaultProps = {
  races: mockRaces,
  allRaces: mockRaces,
  itemsPerPage: 8,
  currentPage: 1,
  loading: false,
  view: pageViewMode.CARD,
  error: null,
  pinnedRaces: [],
  onTogglePin: vi.fn(),
};

const renderRacesListing = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(
    <BrowserRouter>
      <RacesListing {...mergedProps} />
    </BrowserRouter>
  );
};

describe("RacesListing", () => {
  test("renders races in card view by default", () => {
    renderRacesListing();

    expect(screen.getByTestId("races-listing-container")).toBeDefined();
    expect(screen.getByTestId("races-card-grid")).toBeDefined();
    expect(screen.queryByTestId("races-list-container")).toBeNull();

    // Check that race cards are rendered
    expect(screen.getByTestId("race-2024-1-card")).toBeDefined();
    expect(screen.getByTestId("race-2024-2-card")).toBeDefined();
    expect(screen.getByTestId("race-2024-3-card")).toBeDefined();
  });

  test("renders races in list view when view prop is LIST", () => {
    renderRacesListing({ view: pageViewMode.LIST });

    expect(screen.getByTestId("races-listing-container")).toBeDefined();
    expect(screen.getByTestId("races-list-container")).toBeDefined();
    expect(screen.queryByTestId("races-card-grid")).toBeNull();

    // Check that race list items are rendered
    expect(screen.getByTestId("race-2024-1-list-item")).toBeDefined();
    expect(screen.getByTestId("race-2024-2-list-item")).toBeDefined();
    expect(screen.getByTestId("race-2024-3-list-item")).toBeDefined();
  });

  test("displays loading skeleton when loading is true", () => {
    renderRacesListing({ loading: true });

    expect(screen.getByTestId("loading-skeleton")).toBeDefined();
    expect(screen.queryByTestId("races-listing-container")).toBeNull();
  });

  test("displays error message when error prop is provided", () => {
    const errorMessage = "Failed to fetch races";
    renderRacesListing({ error: errorMessage });

    expect(screen.getByTestId("races-listing-error")).toBeDefined();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeDefined();
    expect(screen.queryByTestId("races-listing-container")).toBeNull();
  });

  test("displays empty state when no races are provided", () => {
    renderRacesListing({ races: [], allRaces: [] });

    expect(screen.getByTestId("races-listing-empty")).toBeDefined();
    expect(screen.getByText("No races found")).toBeDefined();
    expect(
      screen.getByText("There are no races to display for this season.")
    ).toBeDefined();
    expect(screen.queryByTestId("races-listing-container")).toBeNull();
  });

  test("displays pinned races section when there are pinned races", () => {
    const pinnedRaces = ["2024-1", "2024-3"];
    renderRacesListing({ pinnedRaces });

    expect(screen.getByTestId("pinned-races-section")).toBeDefined();
    expect(screen.getByText("Pinned Races (2)")).toBeDefined();
    expect(screen.getByTestId("pinned-races-card-grid")).toBeDefined();
  });

  test("displays pinned races in list view", () => {
    const pinnedRaces = ["2024-1"];
    renderRacesListing({ pinnedRaces, view: pageViewMode.LIST });

    expect(screen.getByTestId("pinned-races-section")).toBeDefined();
    expect(screen.getByTestId("pinned-races-list-container")).toBeDefined();
  });

  test("shows regular races section with header when there are pinned races", () => {
    const pinnedRaces = ["2024-1"];
    renderRacesListing({ pinnedRaces });

    expect(screen.getByTestId("regular-races-section")).toBeDefined();
    expect(screen.getByText("All Races")).toBeDefined();
  });

  test("does not show regular races section header when no pinned races", () => {
    renderRacesListing();

    expect(screen.getByTestId("regular-races-section")).toBeDefined();
    expect(screen.queryByText("All Races")).toBeNull();
  });

  test("calls onTogglePin when pin button is clicked", async () => {
    const mockOnTogglePin = vi.fn();
    renderRacesListing({ onTogglePin: mockOnTogglePin });

    const pinButton = screen.getByTestId("race-2024-1-pin-button");
    await userEvent.click(pinButton);

    expect(mockOnTogglePin).toHaveBeenCalledWith("2024-1");
  });

  test("displays pinned races from allRaces even if not in current page", () => {
    const currentPageRaces = [mockRaces[0]]; // Only first race
    const allRaces = mockRaces; // All races
    const pinnedRaces = ["2024-3"]; // Third race is pinned but not on current page

    renderRacesListing({
      races: currentPageRaces,
      allRaces,
      pinnedRaces,
    });

    expect(screen.getByTestId("pinned-races-section")).toBeDefined();
    expect(screen.getByText("Australian Grand Prix")).toBeDefined(); // Pinned race from different page
  });

  test("sorts pinned races by round number", () => {
    const pinnedRaces = ["2024-3", "2024-1"]; // Out of order
    renderRacesListing({ pinnedRaces });

    const pinnedSection = screen.getByTestId("pinned-races-section");
    const raceCards = pinnedSection.querySelectorAll('[data-testid$="-card"]');

    // First card should be round 1, second should be round 3
    expect(raceCards[0].getAttribute("data-testid")).toBe("race-2024-1-card");
    expect(raceCards[1].getAttribute("data-testid")).toBe("race-2024-3-card");
  });

  test("sorts regular races by round number", () => {
    const unsortedRaces = [mockRaces[2], mockRaces[0], mockRaces[1]]; // Out of order
    renderRacesListing({ races: unsortedRaces, allRaces: unsortedRaces });

    const regularSection = screen.getByTestId("regular-races-section");
    const raceCards = regularSection.querySelectorAll('[data-testid$="-card"]');

    // Should be sorted by round number
    expect(raceCards[0].getAttribute("data-testid")).toBe("race-2024-1-card");
    expect(raceCards[1].getAttribute("data-testid")).toBe("race-2024-2-card");
    expect(raceCards[2].getAttribute("data-testid")).toBe("race-2024-3-card");
  });

  test("shows page empty state when all current page races are pinned", () => {
    const pinnedRaces = ["2024-1", "2024-2"]; // All races on current page are pinned
    renderRacesListing({
      races: [], // No races on current page
      allRaces: mockRaces.slice(0, 2), // But races exist in allRaces
      pinnedRaces,
    });

    expect(screen.getByTestId("page-empty-state")).toBeDefined();
    expect(
      screen.getByText(
        "No more races on this page. All races from this page are pinned above."
      )
    ).toBeDefined();
  });

  test("renders correct number of races", () => {
    renderRacesListing();

    const raceNames = screen.getAllByText(/Grand Prix/);
    expect(raceNames).toHaveLength(4); // 3 races + 1 section header that contains "Grand Prix"
  });

  test("displays race information correctly", () => {
    renderRacesListing();

    expect(screen.getByText("Bahrain Grand Prix")).toBeDefined();
    expect(screen.getByText("Bahrain International Circuit")).toBeDefined();
    expect(screen.getByText("Sakhir, Bahrain")).toBeDefined();
    expect(screen.getByText("March 2, 2024")).toBeDefined();
  });

  test("shows Wikipedia links for races", () => {
    renderRacesListing();

    const wikipediaButtons = screen.getAllByText("Wikipedia");
    expect(wikipediaButtons).toHaveLength(3);
  });
});
