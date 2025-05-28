import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import RaceCard from "./RaceCard";
import type { Race } from "../../../types/types";

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

const renderRaceCard = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(<RaceCard {...mergedProps} />);
};

// Mock window.open
Object.defineProperty(window, "open", {
  value: vi.fn(),
  writable: true,
});

describe("RaceCard", () => {
  test("renders race information correctly", () => {
    renderRaceCard();

    expect(screen.getByText("Bahrain Grand Prix")).toBeDefined();
    expect(screen.getByText("Bahrain International Circuit")).toBeDefined();
    expect(screen.getByText("Sakhir, Bahrain")).toBeDefined();
    expect(screen.getByText("March 2, 2024")).toBeDefined();
    expect(screen.getByText("R1")).toBeDefined();
  });

  test("displays correct test id", () => {
    renderRaceCard();

    expect(screen.getByTestId("race-2024-1-card")).toBeDefined();
  });

  test("shows unpinned state by default", () => {
    renderRaceCard();

    const pinButton = screen.getByTestId("race-2024-1-pin-button");
    expect(pinButton).toBeDefined();
    expect(pinButton.getAttribute("aria-label")).toBe("Pin race");
  });

  test("shows pinned state when isPinned is true", () => {
    renderRaceCard({ isPinned: true });

    const pinButton = screen.getByTestId("race-2024-1-pin-button");
    expect(pinButton.getAttribute("aria-label")).toBe("Unpin race");

    // Check for orange ring styling
    const card = screen.getByTestId("race-2024-1-card");
    expect(card.className).toContain("ring-2 ring-orange-500");
  });

  test("calls onTogglePin when pin button is clicked", async () => {
    const mockOnTogglePin = vi.fn();
    renderRaceCard({ onTogglePin: mockOnTogglePin });

    const pinButton = screen.getByTestId("race-2024-1-pin-button");
    await userEvent.click(pinButton);

    expect(mockOnTogglePin).toHaveBeenCalledWith("2024-1");
  });

  test("opens Wikipedia link when Wikipedia button is clicked", async () => {
    const mockWindowOpen = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);
    renderRaceCard();

    const wikipediaButton = screen.getByTestId("race-2024-1-wikipedia-button");
    await userEvent.click(wikipediaButton);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      "https://example.com/race1",
      "_blank",
      "noopener,noreferrer"
    );
  });

  test("displays location and date icons", () => {
    renderRaceCard();

    // Check for SVG elements by their paths
    const locationIcon = screen
      .getByTestId("race-2024-1-card")
      .querySelector('svg path[d*="M17.657"]');
    const dateIcon = screen
      .getByTestId("race-2024-1-card")
      .querySelector('svg path[d*="M8 7V3"]');

    expect(locationIcon).toBeDefined();
    expect(dateIcon).toBeDefined();
  });

  test("handles long race names with truncation", () => {
    const longNameRace = {
      ...mockRace,
      raceName:
        "Very Long Race Name That Should Be Truncated Because It Is Too Long",
    };

    renderRaceCard({ race: longNameRace });

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

    renderRaceCard({ race: longCircuitRace });

    const circuitName = screen.getByText(longCircuitRace.Circuit.circuitName);
    expect(circuitName.className).toContain("truncate");
  });

  test("formats date correctly using date-fns", () => {
    const raceWithDifferentDate = {
      ...mockRace,
      date: "2024-12-25",
    };

    renderRaceCard({ race: raceWithDifferentDate });

    expect(screen.getByText("December 25, 2024")).toBeDefined();
  });

  test("handles invalid date gracefully", () => {
    const raceWithInvalidDate = {
      ...mockRace,
      date: "invalid-date",
    };

    renderRaceCard({ race: raceWithInvalidDate });

    // Should fall back to original string
    expect(screen.getByText("invalid-date")).toBeDefined();
  });
});
