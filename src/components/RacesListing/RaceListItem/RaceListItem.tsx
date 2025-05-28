import type { Race } from "../../../types/types";
import { format } from "date-fns";

interface RaceListItemProps {
  race: Race;
  isPinned: boolean;
  onTogglePin: (raceId: string) => void;
}

export default function RaceListItem({
  race,
  isPinned,
  onTogglePin,
}: RaceListItemProps) {
  const handlePinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTogglePin(`${race.season}-${race.round}`);
  };

  const formatRaceDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div
      className={`group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 ${
        isPinned ? "ring-2 ring-orange-500" : ""
      }`}
      data-testid={`race-${race.season}-${race.round}-list-item`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white font-bold text-xs">R{race.round}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200 truncate">
                {race.raceName}
              </h3>
              {isPinned && (
                <svg
                  className="w-4 h-4 text-orange-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0 text-sm text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate">{race.Circuit.circuitName}</span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate">
                  {race.Circuit.Location.locality},{" "}
                  {race.Circuit.Location.country}
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{formatRaceDate(race.date)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(race.url, "_blank", "noopener,noreferrer");
            }}
            className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            aria-label={`Open external link for ${race.raceName}`}
            data-testid={`race-${race.season}-${race.round}-wikipedia-button`}
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

          <button
            onClick={handlePinClick}
            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
              isPinned
                ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-orange-500"
            }`}
            aria-label={isPinned ? "Unpin race" : "Pin race"}
            data-testid={`race-${race.season}-${race.round}-pin-button`}
          >
            <svg
              className="w-5 h-5"
              fill={isPinned ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
