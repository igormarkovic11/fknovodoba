import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnimatedRoutes from "./AnimatedRoutes";
import AppLoader from "./AppLoader";
import ScrollToTopButton from "./ScrollToTopButton";
import ScrollToTop from "./ScrollToTop";

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Show loader for minimum 1.5s so it doesn't flash
    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return <AppLoader />;

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main>
        <AnimatedRoutes />
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ScrollToTopButton />}
    </>
  );
};

export default AppContent;
