import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import AnimatedRoutes from "./AnimatedRoutes";
import ScrollToTopButton from "./ScrollToTop";

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

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
