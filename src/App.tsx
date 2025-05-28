import { BrowserRouter, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import { ROUTES } from "./utils/routes";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path={ROUTES.HOME} element={<div>Home Page</div>} />
            <Route
              path={ROUTES.SEASONS.LIST}
              element={<div>Seasons Listing</div>}
            />
            <Route
              path={ROUTES.SEASONS.DETAIL()}
              element={<div>Season Page</div>}
            />
            <Route path={ROUTES.DRIVERS} element={<div>Driver Page</div>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
