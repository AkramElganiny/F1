import { useEffect, useState } from "react";
import SeasonsListing from "../components/SeasonsListing/SeasonsListing";
import { View, type Season } from "../types/types";
import { getSeasons } from "../service/ergast-api";
import ViewMode from "../components/SeasonsListing/ViewMode/ViewMode";
import Pagination from "../components/Pagination/Pagination";

const ITEMS_PER_PAGE = 8;

export default function SeasonsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<View>(View.CARD);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSeasons, setTotalSeasons] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getSeasons((currentPage - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE)
      .then(({ seasons, total }) => {
        setSeasons(seasons);
        setTotalSeasons(total);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Formula One Seasons
              </h1>
              <p className="text-gray-600 mt-1">
                Explore {totalSeasons} Formula One seasons and their races
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <ViewMode view={view} onViewChange={handleViewChange} />
            </div>
          </div>
          <SeasonsListing
            seasons={seasons}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            view={view}
            loading={loading}
            error={error}
          />
          {totalSeasons > ITEMS_PER_PAGE && (
            <div className="mt-8" data-testid="pagination-container">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalSeasons / ITEMS_PER_PAGE)}
                onPageChange={handlePageChange}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={totalSeasons}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
