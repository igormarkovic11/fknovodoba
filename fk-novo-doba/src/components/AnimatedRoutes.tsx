import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import Roster from "../pages/Roster";
import Player from "../pages/Player";
import Results from "../pages/Results";
import Fixtures from "../pages/Fixtures";
import League from "../pages/League";
import News from "../pages/News";
import NewsArticle from "../pages/NewsArticle";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminPlayers from "../pages/admin/AdminPlayers";
import AdminMatches from "../pages/admin/AdminMatches";
import AdminNews from "../pages/admin/AdminNews";
import AdminStandings from "../pages/admin/AdminStandings";

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
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/players"
          element={
            <ProtectedRoute>
              <AdminPlayers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/matches"
          element={
            <ProtectedRoute>
              <AdminMatches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <AdminNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/standings"
          element={
            <ProtectedRoute>
              <AdminStandings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
