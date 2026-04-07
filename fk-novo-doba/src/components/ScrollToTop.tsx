import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Čekamo da se završi exit animacija stare stranice (npr. 400ms)
    // Podesi vreme (400) da se poklapa sa trajanjem tvoje PageTransition animacije
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
    }, 250);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
