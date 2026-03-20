import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Player from "./pages/Player";
import Results from "./pages/Results";
import Fixtures from "./pages/Fixtures";
import League from "./pages/League";
import News from "./pages/News";
import Roster from "./pages/Roster";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/roster/:id" element={<Player />} />
          <Route path="/results" element={<Results />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/league" element={<League />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
