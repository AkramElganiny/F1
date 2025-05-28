import type { Race } from "../../../types/types";
import { format } from "date-fns";

interface RaceCardProps {
  race: Race;
  isPinned: boolean;
  onTogglePin: (raceId: string) => void;
}

export default function RaceCard({
  race,
  isPinned,
  onTogglePin,
}: RaceCardProps) {
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
      className={`group block transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl ${
        isPinned ? "ring-2 ring-orange-500" : ""
      }`}
      aria-label={`Race details for ${race.raceName}`}
      data-testid={`race-${race.season}-${race.round}-card`}
    >
      <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full relative">
        <button
          onClick={handlePinClick}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
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

        <div className="flex items-center space-x-3 mb-4 pr-12">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">R{race.round}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200 truncate">
              {race.raceName}
            </h2>
            <p className="text-sm text-gray-500 truncate">
              {race.Circuit.circuitName}
            </p>
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
              {race.Circuit.Location.locality}, {race.Circuit.Location.country}
            </span>
          </div>

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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatRaceDate(race.date)}</span>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(race.url, "_blank", "noopener,noreferrer");
              }}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
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
          </div>
        </div>
      </div>
    </div>
  );
}
