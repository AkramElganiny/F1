import type { Season } from "../../types/types";
import { pageViewMode, type PageViewMode } from "../../types/types";
import SeasonCard from "./SeasonCard/SeasonCard";
import SeasonListItem from "./SeasonListItem/SeasonListItem";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";

interface SeasonsListingProps {
  seasons: Season[];
  itemsPerPage: number;
  currentPage: number;
  loading: boolean;
  view: PageViewMode;
  error: string | null;
}

export default function SeasonsListing({
  seasons,
  itemsPerPage,
  loading,
  view,
  error,
}: SeasonsListingProps) {
  if (loading) {
    return <LoadingSkeleton variant={view} count={itemsPerPage} />;
  }

  if (error) {
    return <div data-testid="seasons-listing-error">Error: {error}</div>;
  }

  if (seasons.length === 0) {
    return (
      <div className="text-center py-12" data-testid="seasons-listing-empty">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No seasons found
        </h3>
        <p className="text-gray-500">
          There are no Formula One seasons to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[400px]" data-testid="seasons-listing-container">
      {view === pageViewMode.CARD ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          data-testid="seasons-card-grid"
        >
          {seasons.map((season) => (
            <SeasonCard key={season.season} season={season} />
          ))}
        </div>
      ) : (
        <div className="space-y-3" data-testid="seasons-list-container">
          {seasons.map((season) => (
            <SeasonListItem key={season.season} season={season} />
          ))}
        </div>
      )}
    </div>
  );
}
