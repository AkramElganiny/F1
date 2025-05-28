import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/seasons" element={<div>Seasons Listing</div>} />
        <Route path="/seasons/:year" element={<div>Season Page</div>} />
        <Route path="/driver" element={<div>Driver Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
