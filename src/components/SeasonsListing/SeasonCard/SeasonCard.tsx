import { Link } from "react-router";
import type { Season } from "../../../types/types";
import { ROUTES } from "../../../utils/routes";

export default function SeasonCard({ season }: { season: Season }) {
  return (
    <Link
      to={ROUTES.SEASONS.RACES(season.season.toString())}
      className="group block transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl"
      aria-label={`View races for ${season.season} season`}
      data-testid={`season-${season.season}-card`}
    >
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">F1</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                {season.season}
              </h2>
              <p className="text-sm text-gray-500">Formula One Season</p>
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-orange-500 transition-colors duration-200">
            <svg
              className="w-6 h-6"
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
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <svg
              className="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="truncate">Official F1 Data</span>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(season.url, "_blank", "noopener,noreferrer");
              }}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label={`Open external link for ${season.season} season`}
              data-testid={`season-${season.season}-wikipedia-button`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Wikipedia
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
