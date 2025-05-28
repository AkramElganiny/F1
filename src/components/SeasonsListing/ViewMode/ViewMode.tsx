import { View } from "../../../types/types";

interface ViewModeProps {
  view: View;
  onViewChange: (view: View) => void;
}

export default function ViewMode({ view, onViewChange }: ViewModeProps) {
  return (
    <div
      className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1"
      data-testid="view-mode-toggle"
    >
      <button
        onClick={() => onViewChange(View.CARD)}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          view === View.CARD
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:cursor-pointer"
        }`}
        aria-label="Switch to card view"
        aria-pressed={view === View.CARD}
        data-testid="view-mode-card-button"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        Cards
      </button>

      <button
        onClick={() => onViewChange(View.LIST)}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          view === View.LIST
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:cursor-pointer"
        }`}
        aria-label="Switch to list view"
        aria-pressed={view === View.LIST}
        data-testid="view-mode-list-button"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        List
      </button>
    </div>
  );
}
