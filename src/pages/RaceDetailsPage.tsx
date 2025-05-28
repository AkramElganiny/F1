import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getRaceResults } from "../service/ergast-api";
import type { RaceResultsResponse } from "../types/types";
import { ROUTES } from "../utils/routes";
import ParticipatingDrivers from "../components/RaceDetails/ParticipatingDrivers/ParticipatingDrivers";

export default function RaceDetailsPage() {
  const { year, round } = useParams<{ year: string; round: string }>();
  const [raceData, setRaceData] = useState<RaceResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchDriverInput, setSearchDriverInput] = useState<string>("");

  useEffect(() => {
    if (!year || !round) return;

    setLoading(true);
    setError(null);

    getRaceResults(year, round)
      .then((data) => {
        setRaceData(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [year, round]);

  const handleDriverHighlight = (driverId: string) => {
    setSearchDriverInput(driverId === searchDriverInput ? "" : driverId);
  };

  if (!year || !round) {
    return (
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Race
            </h1>
            <p className="text-gray-600 mb-6">
              Please select a valid race to view details.
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

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Race Details
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to={ROUTES.SEASONS.RACES(year)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Races
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!raceData) {
    return null;
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
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
              <Link
                to={ROUTES.SEASONS.RACES(year)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                {year}
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
              <span className="text-gray-500">Round {round}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {raceData.raceName}
            </h1>
            <p className="text-gray-600">
              {raceData.Circuit.circuitName} •{" "}
              {raceData.Circuit.Location.locality},{" "}
              {raceData.Circuit.Location.country}
            </p>
          </div>

          {/* Driver Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Highlight Driver
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search driver by name..."
                  value={searchDriverInput}
                  onChange={(e) => setSearchDriverInput(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchDriverInput && (
                  <button
                    onClick={() => setSearchDriverInput("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <ParticipatingDrivers
            results={raceData.Results}
            searchDriverInput={searchDriverInput}
            onDriverClick={handleDriverHighlight}
          />
        </div>
      </div>
    </div>
  );
}
