import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import RacesListing from "../components/RacesListing/RacesListing";
import { View, type Race } from "../types/types";
import { getRaces } from "../service/ergast-api";
import ViewMode from "../components/SeasonsListing/ViewMode/ViewMode";
import Pagination from "../components/Pagination/Pagination";
import { getPinnedRaces, toggleRacePin } from "../utils/localStorage";
import { ROUTES } from "../utils/routes";

const ITEMS_PER_PAGE = 8;

export default function RacesPage() {
  const { year } = useParams<{ year: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<View>(View.CARD);
  const [races, setRaces] = useState<Race[]>([]);
  const [allRaces, setAllRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRaces, setTotalRaces] = useState(0);
  const [pinnedRaces, setPinnedRaces] = useState<string[]>([]);

  useEffect(() => {
    setPinnedRaces(getPinnedRaces());
  }, []);

  // Fetch all races for the season (for pinned races section)
  useEffect(() => {
    if (!year) return;

    getRaces(year, 0, 1000) // Fetch all races (F1 seasons typically have max ~25 races)
      .then(({ races }) => {
        setAllRaces(races);
      })
      .catch((error) => {
        console.error("Error fetching all races:", error);
      });
  }, [year]);

  // Fetch paginated races
  useEffect(() => {
    if (!year) return;

    setLoading(true);
    setError(null);

    getRaces(year, (currentPage - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE)
      .then(({ races, total }) => {
        setRaces(races);
        setTotalRaces(total);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [year, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleTogglePin = (raceId: string) => {
    const updatedPinnedRaces = toggleRacePin(raceId);
    setPinnedRaces(updatedPinnedRaces);
  };

  if (!year) {
    return (
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Season
            </h1>
            <p className="text-gray-600 mb-6">
              Please select a valid season to view races.
            </p>
            <Link
              to={ROUTES.SEASONS.LIST}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Seasons
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Link
                  to={ROUTES.SEASONS.LIST}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  Seasons
                </Link>
                <svg
                  className="w-4 h-4 text-gray-400"
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
                <span className="text-gray-500">{year}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {year} Formula One Races
              </h1>
              <p className="text-gray-600 mt-1">
                {loading ? (
                  "Loading races..."
                ) : (
                  <>
                    Explore {totalRaces} races from the {year} Formula One
                    season
                    {pinnedRaces.length > 0 && (
                      <span className="ml-2 text-orange-600">
                        • {pinnedRaces.length} pinned
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <ViewMode view={view} onViewChange={handleViewChange} />
            </div>
          </div>

          <RacesListing
            races={races}
            allRaces={allRaces}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            view={view}
            loading={loading}
            error={error}
            pinnedRaces={pinnedRaces}
            onTogglePin={handleTogglePin}
          />

          {totalRaces > ITEMS_PER_PAGE && (
            <div className="mt-8" data-testid="pagination-container">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalRaces / ITEMS_PER_PAGE)}
                onPageChange={handlePageChange}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={totalRaces}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
