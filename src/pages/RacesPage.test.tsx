import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { describe, expect, test, vi, beforeEach } from "vitest";
import RacesPage from "./RacesPage";
import { getRaces } from "../service/ergast-api";
import type { Race } from "../types/types";

// Mock the API service
vi.mock("../service/ergast-api", () => ({
  getRaces: vi.fn(),
}));

// Mock localStorage utilities
vi.mock("../utils/localStorage", () => ({
  getPinnedRaces: vi.fn(() => []),
  toggleRacePin: vi.fn((raceId: string) => [raceId]),
}));

// Mock useParams
const mockUseParams = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => mockUseParams(),
  };
});

const mockGetRaces = vi.mocked(getRaces);

const mockRacesData: Race[] = [
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
];

const renderRacesPage = () => {
  return render(
    <BrowserRouter>
      <RacesPage />
    </BrowserRouter>
  );
};

describe("RacesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset useParams mock to return default year
    mockUseParams.mockReturnValue({ year: "2024" });
    // Mock window.scrollTo
    Object.defineProperty(window, "scrollTo", {
      value: vi.fn(),
      writable: true,
    });
  });

  test("renders page header with correct year and breadcrumb", async () => {
    mockGetRaces.mockResolvedValue({
      races: mockRacesData,
      total: 2,
    });

    renderRacesPage();

    expect(screen.getByText("2024 Formula One Races")).toBeDefined();
    expect(screen.getByText("Seasons")).toBeDefined();
    expect(screen.getByText("2024")).toBeDefined();
  });

  test("fetches and displays races on mount", async () => {
    mockGetRaces.mockResolvedValue({
      races: mockRacesData,
      total: 2,
    });

    renderRacesPage();

    await waitFor(() => {
      expect(screen.getByTestId("races-listing-container")).toBeDefined();
    });

    expect(mockGetRaces).toHaveBeenCalledWith("2024", 0, 1000); // All races
    expect(mockGetRaces).toHaveBeenCalledWith("2024", 0, 8); // Paginated races
  });

  test("displays loading state initially", () => {
    mockGetRaces.mockImplementation(() => new Promise(() => {}));

    renderRacesPage();

    expect(screen.getByTestId("loading-skeleton")).toBeDefined();
    expect(screen.queryByTestId("races-listing-container")).toBeNull();
  });

  test("displays error state when API fails", async () => {
    const errorMessage = "Failed to fetch races";
    mockGetRaces.mockRejectedValue(new Error(errorMessage));

    renderRacesPage();

    await waitFor(() => {
      expect(screen.getByTestId("races-listing-error")).toBeDefined();
    });

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeDefined();
  });

  test("handles pagination navigation with correct API calls", async () => {
    const page1Data = [mockRacesData[0]];
    const page2Data = [mockRacesData[1]];

    // First call for all races
    mockGetRaces.mockResolvedValueOnce({
      races: mockRacesData,
      total: 20,
    });

    // Second call for page 1
    mockGetRaces.mockResolvedValueOnce({
      races: page1Data,
      total: 20,
    });

    renderRacesPage();

    await waitFor(() => {
      expect(screen.getByTestId("races-listing-container")).toBeDefined();
    });

    // Mock next page call
    mockGetRaces.mockResolvedValueOnce({
      races: page2Data,
      total: 20,
    });

    const nextButton = screen.getByLabelText("Go to next page");
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(mockGetRaces).toHaveBeenCalledWith("2024", 8, 8);
    });
  });

  test("scrolls to top when changing pages", async () => {
    mockGetRaces.mockResolvedValue({
      races: mockRacesData,
      total: 20,
    });

    const scrollToSpy = vi.spyOn(window, "scrollTo");

    renderRacesPage();

    await waitFor(() => {
      expect(screen.getByTestId("races-listing-container")).toBeDefined();
    });

    const nextButton = screen.getByLabelText("Go to next page");
    await userEvent.click(nextButton);

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  test("updates view mode when toggle is clicked", async () => {
    mockGetRaces.mockResolvedValue({
      races: mockRacesData,
      total: 2,
    });

    renderRacesPage();

    await waitFor(() => {
      expect(screen.getByTestId("races-listing-container")).toBeDefined();
    });

    const listViewButton = screen.getByTestId("view-mode-list-button");
    await userEvent.click(listViewButton);

    expect(listViewButton.getAttribute("aria-pressed")).toBe("true");
  });

  test("displays total races count in description", async () => {
    mockGetRaces.mockResolvedValue({
      races: mockRacesData,
      total: 23,
    });

    renderRacesPage();

    await waitFor(() => {
      expect(
        screen.getByText("Explore 23 races from the 2024 Formula One season")
      ).toBeDefined();
    });
  });

  test("hides pagination when total races is less than items per page", async () => {
    mockGetRaces.mockResolvedValue({
      races: mockRacesData,
      total: 5,
    });

    renderRacesPage();

    await waitFor(() => {
      expect(screen.queryByTestId("pagination-container")).toBeNull();
    });
  });

  test("shows pagination when total races exceeds items per page", async () => {
    mockGetRaces.mockResolvedValue({
      races: mockRacesData,
      total: 20,
    });

    renderRacesPage();

    await waitFor(() => {
      expect(screen.getByTestId("pagination-container")).toBeDefined();
    });
  });

  test("resets to loading state when changing pages", async () => {
    mockGetRaces.mockResolvedValue({
      races: mockRacesData,
      total: 20,
    });

    renderRacesPage();

    await waitFor(() => {
      expect(screen.getByTestId("races-listing-container")).toBeDefined();
    });

    mockGetRaces.mockImplementationOnce(() => new Promise(() => {}));

    const nextButton = screen.getByLabelText("Go to next page");
    await userEvent.click(nextButton);

    expect(screen.getByTestId("loading-skeleton")).toBeDefined();
    expect(screen.queryByTestId("races-listing-container")).toBeNull();
  });

  test("displays invalid season message when year param is missing", () => {
    // Mock useParams to return undefined year
    mockUseParams.mockReturnValue({
      year: undefined,
    });

    renderRacesPage();

    expect(screen.getByText("Invalid Season")).toBeDefined();
    expect(
      screen.getByText("Please select a valid season to view races.")
    ).toBeDefined();
    expect(screen.getByText("Back to Seasons")).toBeDefined();
  });
});
