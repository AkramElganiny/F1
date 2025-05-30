import { Link } from "react-router";
import { useState } from "react";
import { ROUTES } from "../../utils/routes";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className="bg-slate-900 border-b border-blue-500 sticky top-0 z-50"
      role="navigation"
    >
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-between items-center h-16 w-full max-w-7xl z-60 bg-slate-900 w-full px-4 sm:px-6 lg:px-8">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors duration-200"
            aria-label="Formula One Explorer Home"
            data-testid="navbar-logo-home-link"
          >
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">F1</span>
            </div>
            <span className="font-bold text-xl">Formula One Explorer</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to={ROUTES.HOME}
              className="text-gray-300 hover:text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              data-testid="navbar-home-link"
            >
              Home
            </Link>
            <Link
              to={ROUTES.SEASONS.LIST}
              className="text-gray-300 hover:text-white hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
              data-testid="navbar-seasons-link"
            >
              Seasons
            </Link>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-white hover:bg-blue-600 p-2 rounded-md transition-all duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          } fixed top-16 left-0 right-0 bg-slate-900 transform transition-transform transition-height duration-300 ease-in-out z-50 md:hidden border-b border-blue-500`}
          id="mobile-menu"
          data-testid="mobile-menu"
        >
          <div className="px-4 py-4 space-y-2 max-w-7xl mx-auto">
            <Link
              to={ROUTES.HOME}
              className="text-gray-300 hover:text-white hover:bg-blue-600 block px-4 py-3 rounded-md text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
              data-testid="navbar-home-link-mobile"
            >
              Home
            </Link>
            <Link
              to={ROUTES.SEASONS.LIST}
              className="text-gray-300 hover:text-white hover:bg-blue-600 block px-4 py-3 rounded-md text-base font-medium transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
              data-testid="navbar-seasons-link-mobile"
            >
              Seasons
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
