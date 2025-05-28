import { describe, expect, test, beforeEach, vi } from "vitest";
import { getPinnedRaces, setPinnedRaces, toggleRacePin } from "./localStorage";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("localStorage utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPinnedRaces", () => {
    test("returns empty array when no pinned races exist", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getPinnedRaces();

      expect(result).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("pinnedRaces");
    });

    test("returns parsed array when pinned races exist", () => {
      const mockPinnedRaces = ["2024-1", "2024-3", "2023-5"];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPinnedRaces));

      const result = getPinnedRaces();

      expect(result).toEqual(mockPinnedRaces);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("pinnedRaces");
    });

    test("returns empty array when localStorage contains invalid JSON", () => {
      localStorageMock.getItem.mockReturnValue("invalid-json");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = getPinnedRaces();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error reading pinned races from localStorage:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    test("handles localStorage errors gracefully", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = getPinnedRaces();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error reading pinned races from localStorage:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("setPinnedRaces", () => {
    test("saves pinned races to localStorage", () => {
      const pinnedRaces = ["2024-1", "2024-3"];

      setPinnedRaces(pinnedRaces);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "pinnedRaces",
        JSON.stringify(pinnedRaces)
      );
    });

    test("saves empty array to localStorage", () => {
      const pinnedRaces: string[] = [];

      setPinnedRaces(pinnedRaces);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "pinnedRaces",
        JSON.stringify(pinnedRaces)
      );
    });

    test("handles localStorage errors gracefully", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      setPinnedRaces(["2024-1"]);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving pinned races to localStorage:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("toggleRacePin", () => {
    test("adds race to pinned list when not already pinned", () => {
      const existingPinned = ["2024-1", "2024-3"];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingPinned));

      const result = toggleRacePin("2024-5");

      const expectedPinned = ["2024-1", "2024-3", "2024-5"];
      expect(result).toEqual(expectedPinned);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "pinnedRaces",
        JSON.stringify(expectedPinned)
      );
    });

    test("removes race from pinned list when already pinned", () => {
      const existingPinned = ["2024-1", "2024-3", "2024-5"];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingPinned));

      const result = toggleRacePin("2024-3");

      const expectedPinned = ["2024-1", "2024-5"];
      expect(result).toEqual(expectedPinned);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "pinnedRaces",
        JSON.stringify(expectedPinned)
      );
    });

    test("adds race to empty pinned list", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = toggleRacePin("2024-1");

      const expectedPinned = ["2024-1"];
      expect(result).toEqual(expectedPinned);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "pinnedRaces",
        JSON.stringify(expectedPinned)
      );
    });

    test("removes last race from pinned list", () => {
      const existingPinned = ["2024-1"];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingPinned));

      const result = toggleRacePin("2024-1");

      const expectedPinned: string[] = [];
      expect(result).toEqual(expectedPinned);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "pinnedRaces",
        JSON.stringify(expectedPinned)
      );
    });

    test("handles duplicate race IDs correctly", () => {
      const existingPinned = ["2024-1", "2024-3"];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingPinned));

      // Try to remove an existing race
      const result1 = toggleRacePin("2024-1"); // Should remove
      expect(result1).toEqual(["2024-3"]);

      // Mock the updated state for second call
      localStorageMock.getItem.mockReturnValue(JSON.stringify(["2024-3"]));
      const finalResult = toggleRacePin("2024-1"); // Should add back
      expect(finalResult).toEqual(["2024-3", "2024-1"]);
    });

    test("maintains order when adding new races", () => {
      const existingPinned = ["2024-1", "2024-3"];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingPinned));

      const result = toggleRacePin("2024-2");

      expect(result).toEqual(["2024-1", "2024-3", "2024-2"]);
    });

    test("handles localStorage errors during toggle", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = toggleRacePin("2024-1");

      // Should still return the new array even if localStorage fails
      expect(result).toEqual(["2024-1"]);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
