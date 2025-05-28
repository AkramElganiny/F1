import type { RaceResult } from "../../../types/types";

interface ParticipatingDriversProps {
  results: RaceResult[];
  searchDriverInput: string;
  onDriverClick: (driverId: string) => void;
}

export default function ParticipatingDrivers({
  results,
  searchDriverInput,
  onDriverClick,
}: ParticipatingDriversProps) {
  const getPositionColor = (position: string) => {
    const pos = parseInt(position);
    if (pos === 1) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (pos === 2) return "bg-gray-100 text-gray-800 border-gray-200";
    if (pos === 3) return "bg-orange-100 text-orange-800 border-orange-200";
    if (pos <= 10) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-50 text-gray-600 border-gray-200";
  };

  const getStatusColor = (status: string) => {
    if (status === "Finished" || status.includes("Lap")) {
      return "text-green-600";
    }
    return "text-red-600";
  };

  const isDriverHighlighted = (driver: RaceResult) => {
    if (!searchDriverInput) return false;
    const fullName =
      `${driver.Driver.givenName} ${driver.Driver.familyName}`.toLowerCase();
    const searchTerm = searchDriverInput.toLowerCase();
    return (
      fullName.includes(searchTerm) ||
      driver.Driver.driverId.toLowerCase().includes(searchTerm)
    );
  };

  const handleDriverClick = (driver: RaceResult) => {
    const fullName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
    onDriverClick(fullName);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Participating Drivers
        </h2>
        <p className="text-gray-600">
          {results.length} drivers participated in this race
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-3 max-h-full overflow-y-auto">
          {results
            .sort((a, b) => parseInt(a.position) - parseInt(b.position))
            .map((result) => {
              const isHighlighted = isDriverHighlighted(result);

              return (
                <div
                  key={result.Driver.driverId}
                  onClick={() => handleDriverClick(result)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    isHighlighted
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${getPositionColor(
                          result.position
                        )}`}
                      >
                        {result.position}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {result.Driver.givenName} {result.Driver.familyName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result.Driver.nationality} •{" "}
                          {result.Constructor.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {result.points} pts
                      </div>
                      <div
                        className={`text-xs ${getStatusColor(result.status)}`}
                      >
                        {result.status}
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Grid:</span>
                        <span className="ml-1 font-medium">{result.grid}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Laps:</span>
                        <span className="ml-1 font-medium">{result.laps}</span>
                      </div>
                      {result.Time && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Time:</span>
                          <span className="ml-1 font-medium">
                            {result.Time.time}
                          </span>
                        </div>
                      )}
                      {result.FastestLap && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Fastest Lap:</span>
                          <span className="ml-1 font-medium">
                            {result.FastestLap.Time.time} (Lap{" "}
                            {result.FastestLap.lap})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
