const PINNED_RACES_KEY = "pinnedRaces";

export const getPinnedRaces = (): string[] => {
  try {
    const pinned = localStorage.getItem(PINNED_RACES_KEY);
    return pinned ? JSON.parse(pinned) : [];
  } catch (error) {
    console.error("Error reading pinned races from localStorage:", error);
    return [];
  }
};

export const setPinnedRaces = (pinnedRaces: string[]): void => {
  try {
    localStorage.setItem(PINNED_RACES_KEY, JSON.stringify(pinnedRaces));
  } catch (error) {
    console.error("Error saving pinned races to localStorage:", error);
  }
};

export const toggleRacePin = (raceId: string): string[] => {
  const pinnedRaces = getPinnedRaces();
  const isCurrentlyPinned = pinnedRaces.includes(raceId);

  let updatedPinnedRaces: string[];
  if (isCurrentlyPinned) {
    updatedPinnedRaces = pinnedRaces.filter((id) => id !== raceId);
  } else {
    updatedPinnedRaces = [...pinnedRaces, raceId];
  }

  setPinnedRaces(updatedPinnedRaces);
  return updatedPinnedRaces;
};
