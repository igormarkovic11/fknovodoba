import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import Roster from "./pages/Roster";
import Player from "./pages/Player";
import Results from "./pages/Results";
import Fixtures from "./pages/Fixtures";
import League from "./pages/League";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/roster"
          element={
            <PageTransition>
              <Roster />
            </PageTransition>
          }
        />
        <Route
          path="/roster/:id"
          element={
            <PageTransition>
              <Player />
            </PageTransition>
          }
        />
        <Route
          path="/results"
          element={
            <PageTransition>
              <Results />
            </PageTransition>
          }
        />
        <Route
          path="/fixtures"
          element={
            <PageTransition>
              <Fixtures />
            </PageTransition>
          }
        />
        <Route
          path="/league"
          element={
            <PageTransition>
              <League />
            </PageTransition>
          }
        />
        <Route
          path="/news"
          element={
            <PageTransition>
              <News />
            </PageTransition>
          }
        />
        <Route
          path="/news/:id"
          element={
            <PageTransition>
              <NewsArticle />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
