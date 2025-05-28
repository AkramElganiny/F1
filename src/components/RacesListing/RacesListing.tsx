import type { Race } from "../../types/types";
import { View } from "../../types/types";
import RaceCard from "./RaceCard/RaceCard";
import RaceListItem from "./RaceListItem/RaceListItem";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";

interface RacesListingProps {
  races: Race[];
  allRaces: Race[]; // All races for the season to find pinned ones
  itemsPerPage: number;
  currentPage: number;
  loading: boolean;
  view: View;
  error: string | null;
  pinnedRaces: string[];
  onTogglePin: (raceId: string) => void;
}

export default function RacesListing({
  races,
  allRaces,
  itemsPerPage,
  loading,
  view,
  error,
  pinnedRaces,
  onTogglePin,
}: RacesListingProps) {
  if (loading) {
    return <LoadingSkeleton variant={view} count={itemsPerPage} />;
  }

  if (error) {
    return <div data-testid="races-listing-error">Error: {error}</div>;
  }

  if (races.length === 0 && allRaces.length === 0) {
    return (
      <div className="text-center py-12" data-testid="races-listing-empty">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No races found
        </h3>
        <p className="text-gray-500">
          There are no races to display for this season.
        </p>
      </div>
    );
  }

  // Get pinned races from all races (not just current page)
  const pinnedRaceItems = allRaces
    .filter((race) => {
      const raceId = `${race.season}-${race.round}`;
      return pinnedRaces.includes(raceId);
    })
    .sort((a, b) => parseInt(a.round) - parseInt(b.round));

  // Filter out pinned races from current page races to avoid duplicates
  const unpinnedRaces = races.sort(
    (a, b) => parseInt(a.round) - parseInt(b.round)
  );

  const renderRaceComponent = (race: Race, isPinned: boolean) => {
    const raceId = `${race.season}-${race.round}`;

    if (view === View.CARD) {
      return (
        <RaceCard
          key={raceId}
          race={race}
          isPinned={isPinned}
          onTogglePin={onTogglePin}
        />
      );
    } else {
      return (
        <RaceListItem
          key={raceId}
          race={race}
          isPinned={isPinned}
          onTogglePin={onTogglePin}
        />
      );
    }
  };

  return (
    <div className="space-y-8" data-testid="races-listing-container">
      {/* Pinned Races Section */}
      {pinnedRaceItems.length > 0 && (
        <div data-testid="pinned-races-section">
          <div className="flex items-center space-x-2 mb-4">
            <svg
              className="w-5 h-5 text-orange-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">
              Pinned Races ({pinnedRaceItems.length})
            </h2>
          </div>

          {view === View.CARD ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-testid="pinned-races-card-grid"
            >
              {pinnedRaceItems.map((race) =>
                renderRaceComponent(
                  race,
                  pinnedRaces.includes(`${race.season}-${race.round}`)
                )
              )}
            </div>
          ) : (
            <div
              className="space-y-3"
              data-testid="pinned-races-list-container"
            >
              {pinnedRaceItems.map((race) =>
                renderRaceComponent(
                  race,
                  pinnedRaces.includes(`${race.season}-${race.round}`)
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* Regular Races Section */}
      {unpinnedRaces.length > 0 && (
        <div data-testid="regular-races-section">
          {pinnedRaceItems.length > 0 && (
            <div className="flex items-center space-x-2 mb-4">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">All Races</h2>
            </div>
          )}

          {view === View.CARD ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-testid="races-card-grid"
            >
              {unpinnedRaces.map((race) =>
                renderRaceComponent(
                  race,
                  pinnedRaces.includes(`${race.season}-${race.round}`)
                )
              )}
            </div>
          ) : (
            <div className="space-y-3" data-testid="races-list-container">
              {unpinnedRaces.map((race) =>
                renderRaceComponent(
                  race,
                  pinnedRaces.includes(`${race.season}-${race.round}`)
                )
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty state for current page when all races are pinned */}
      {unpinnedRaces.length === 0 &&
        races.length === 0 &&
        pinnedRaceItems.length > 0 && (
          <div className="text-center py-8" data-testid="page-empty-state">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              No more races on this page. All races from this page are pinned
              above.
            </p>
          </div>
        )}
    </div>
  );
}
