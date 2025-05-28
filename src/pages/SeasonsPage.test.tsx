import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { describe, expect, test, vi, beforeEach } from "vitest";
import SeasonsPage from "./SeasonsPage";
import { getSeasons } from "../service/ergast-api";
import type { Season } from "../types/types";

// Mock the API service
vi.mock("../service/ergast-api", () => ({
  getSeasons: vi.fn(),
}));

const mockGetSeasons = vi.mocked(getSeasons);

const mockSeasonsData: Season[] = [
  { season: 2024, url: "example.com" },
  { season: 2023, url: "example.com" },
  { season: 2022, url: "example.com" },
  { season: 2021, url: "example.com" },
];

const renderSeasonsPage = () => {
  return render(
    <BrowserRouter>
      <SeasonsPage />
    </BrowserRouter>
  );
};

describe("SeasonsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.scrollTo
    Object.defineProperty(window, "scrollTo", {
      value: vi.fn(),
      writable: true,
    });
  });

  test("handles pagination navigation with correct API calls", async () => {
    const page1Data = [
      { season: 2024, url: "example.com" },
      { season: 2023, url: "example.com" },
    ];

    mockGetSeasons.mockResolvedValueOnce({
      seasons: page1Data,
      total: 20,
    });

    renderSeasonsPage();

    await waitFor(() => {
      expect(screen.getByTestId("season-2024-card")).toBeDefined();
    });

    mockGetSeasons.mockResolvedValueOnce({
      seasons: [],
      total: 20,
    });

    const nextButton = screen.getByLabelText("Go to next page");
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(mockGetSeasons).toHaveBeenCalledWith(8, 8);
    });
  });

  test("scrolls to top when changing pages", async () => {
    mockGetSeasons.mockResolvedValue({
      seasons: mockSeasonsData,
      total: 20,
    });

    const scrollToSpy = vi.spyOn(window, "scrollTo");

    renderSeasonsPage();

    await waitFor(() => {
      expect(screen.getByTestId("seasons-listing-container")).toBeDefined();
    });

    // Click next page
    const nextButton = screen.getByLabelText("Go to next page");
    await userEvent.click(nextButton);

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  test("updates total seasons count in description", async () => {
    mockGetSeasons.mockResolvedValue({
      seasons: mockSeasonsData,
      total: 80,
    });

    renderSeasonsPage();

    await waitFor(() => {
      expect(
        screen.getByText("Explore 80 Formula One seasons and their races")
      ).toBeDefined();
    });
  });

  test("hides pagination when total seasons is less than items per page(8)", async () => {
    mockGetSeasons.mockResolvedValueOnce({
      seasons: mockSeasonsData,
      total: 5,
    });

    renderSeasonsPage();

    await waitFor(() => {
      expect(screen.queryByTestId("pagination-container")).toBeNull();
    });
  });

  test("resets to loading state when changing pages", async () => {
    mockGetSeasons.mockResolvedValue({
      seasons: mockSeasonsData,
      total: 20,
    });

    renderSeasonsPage();

    await waitFor(() => {
      expect(screen.getByTestId("seasons-listing-container")).toBeDefined();
    });

    mockGetSeasons.mockImplementationOnce(() => new Promise(() => {}));

    const nextButton = screen.getByLabelText("Go to next page");
    await userEvent.click(nextButton);

    expect(screen.getByTestId("loading-skeleton")).toBeDefined();
    expect(screen.queryByTestId("seasons-listing-container")).toBeNull();
  });
});
