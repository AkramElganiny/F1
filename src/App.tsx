import { BrowserRouter, Route, Routes } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import { ROUTES } from "./utils/routes";
import Home from "./pages/Home";
import SeasonsPage from "./pages/SeasonsPage";

import RacesPage from "./pages/RacesPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.SEASONS.LIST} element={<SeasonsPage />} />
          <Route path={ROUTES.SEASONS.RACES()} element={<RacesPage />} />
          <Route path={ROUTES.DRIVERS} element={<div>Driver Page</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
