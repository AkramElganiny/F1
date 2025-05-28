import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import RaceListItem from "./RaceListItem";
import type { Race } from "../../../types/types";
import { BrowserRouter } from "react-router";

const mockRace: Race = {
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
};

const defaultProps = {
  race: mockRace,
  isPinned: false,
  onTogglePin: vi.fn(),
};

const renderRaceListItem = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(
    <BrowserRouter>
      <RaceListItem {...mergedProps} />
    </BrowserRouter>
  );
};

// Mock window.open
Object.defineProperty(window, "open", {
  value: vi.fn(),
  writable: true,
});

describe("RaceListItem", () => {
  test("renders race information correctly", () => {
    renderRaceListItem();

    expect(screen.getByText("Bahrain Grand Prix")).toBeDefined();
    expect(screen.getByText("Bahrain International Circuit")).toBeDefined();
    expect(screen.getByText("Sakhir, Bahrain")).toBeDefined();
    expect(screen.getByText("March 2, 2024")).toBeDefined();
    expect(screen.getByText("R1")).toBeDefined();
  });

  test("displays correct test id", () => {
    renderRaceListItem();

    expect(screen.getByTestId("race-2024-1-list-item")).toBeDefined();
  });

  test("shows unpinned state by default", () => {
    renderRaceListItem();

    const pinButton = screen.getByTestId("race-2024-1-pin-button");
    expect(pinButton).toBeDefined();
    expect(pinButton.getAttribute("aria-label")).toBe("Pin race");

    // Should not show pin icon in title
    const titleArea = screen.getByText("Bahrain Grand Prix").parentElement;
    const pinIcon = titleArea?.querySelector('svg[fill="currentColor"]');
    expect(pinIcon).toBeNull();
  });

  test("shows pinned state when isPinned is true", () => {
    renderRaceListItem({ isPinned: true });

    const pinButton = screen.getByTestId("race-2024-1-pin-button");
    expect(pinButton.getAttribute("aria-label")).toBe("Unpin race");

    // Check for orange ring styling
    const listItem = screen.getByTestId("race-2024-1-list-item");
    expect(listItem.className).toContain("ring-2 ring-orange-500");

    // Should show pin icon in title
    const titleArea = screen.getByText("Bahrain Grand Prix").parentElement;
    const pinIcon = titleArea?.querySelector('svg[fill="currentColor"]');
    expect(pinIcon).toBeDefined();
  });

  test("calls onTogglePin when pin button is clicked", async () => {
    const mockOnTogglePin = vi.fn();
    renderRaceListItem({ onTogglePin: mockOnTogglePin });

    const pinButton = screen.getByTestId("race-2024-1-pin-button");
    await userEvent.click(pinButton);

    expect(mockOnTogglePin).toHaveBeenCalledWith("2024-1");
  });

  test("opens Wikipedia link when Wikipedia button is clicked", async () => {
    const mockWindowOpen = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);
    renderRaceListItem();

    const wikipediaButton = screen.getByTestId("race-2024-1-wikipedia-button");
    await userEvent.click(wikipediaButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      "https://example.com/race1",
      "_blank",
      "noopener,noreferrer"
    );
  });

  test("displays race information in responsive layout", () => {
    renderRaceListItem();

    // Check for responsive classes in the main info container
    const listItem = screen.getByTestId("race-2024-1-list-item");
    const infoContainer = listItem.querySelector(
      ".flex.flex-col.sm\\:flex-row"
    );
    expect(infoContainer?.className).toContain("sm:flex-row");
    expect(infoContainer?.className).toContain("sm:space-x-6");
  });

  test("handles long race names with truncation", () => {
    const longNameRace = {
      ...mockRace,
      raceName:
        "Very Long Race Name That Should Be Truncated Because It Is Too Long",
    };

    renderRaceListItem({ race: longNameRace });

    const raceTitle = screen.getByText(longNameRace.raceName);
    expect(raceTitle.className).toContain("truncate");
  });

  test("handles long circuit names with truncation", () => {
    const longCircuitRace = {
      ...mockRace,
      Circuit: {
        ...mockRace.Circuit,
        circuitName: "Very Long Circuit Name That Should Be Truncated",
      },
    };

    renderRaceListItem({ race: longCircuitRace });

    const circuitName = screen.getByText(longCircuitRace.Circuit.circuitName);
    expect(circuitName.className).toContain("truncate");
  });

  test("handles long location names with truncation", () => {
    const longLocationRace = {
      ...mockRace,
      Circuit: {
        ...mockRace.Circuit,
        Location: {
          ...mockRace.Circuit.Location,
          locality: "Very Long City Name",
          country: "Very Long Country Name",
        },
      },
    };

    renderRaceListItem({ race: longLocationRace });

    const locationText = screen.getByText(
      "Very Long City Name, Very Long Country Name"
    );
    expect(locationText.className).toContain("truncate");
  });

  test("formats date correctly using date-fns", () => {
    const raceWithDifferentDate = {
      ...mockRace,
      date: "2024-12-25",
    };

    renderRaceListItem({ race: raceWithDifferentDate });

    expect(screen.getByText("December 25, 2024")).toBeDefined();
  });

  test("handles invalid date gracefully", () => {
    const raceWithInvalidDate = {
      ...mockRace,
      date: "invalid-date",
    };

    renderRaceListItem({ race: raceWithInvalidDate });

    // Should fall back to original string
    expect(screen.getByText("invalid-date")).toBeDefined();
  });

  test("displays all required icons", () => {
    renderRaceListItem();

    // Check for SVG elements by their paths
    const listItem = screen.getByTestId("race-2024-1-list-item");
    const locationIcons = listItem.querySelectorAll('svg path[d*="M17.657"]');
    const dateIcon = listItem.querySelector('svg path[d*="M8 7V3"]');
    const externalLinkIcon = listItem.querySelector('svg path[d*="M10 6H6"]');

    expect(locationIcons.length).toBeGreaterThan(0);
    expect(dateIcon).toBeDefined();
    expect(externalLinkIcon).toBeDefined();
  });

  test("shows Wikipedia button with correct styling", () => {
    renderRaceListItem();

    const wikipediaButton = screen.getByTestId("race-2024-1-wikipedia-button");
    expect(wikipediaButton.className).toContain("text-blue-600");
    expect(wikipediaButton.className).toContain("hover:text-blue-800");
  });
});
