import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Roster", path: "/roster" },
  { label: "Results", path: "/results" },
  { label: "Fixtures", path: "/fixtures" },
  { label: "League", path: "/league" },
  { label: "News", path: "/news" },
];

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="bg-[#0d1017] border-b border-[#c49b32]/25 px-5 h-14 flex items-center justify-between sticky top-0 z-50">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 no-underline"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="FK Novo Doba"
            className="h-10 w-10 object-contain"
            style={{ mixBlendMode: "lighten" }}
          />
          <div>
            <div className="font-bold text-[15px] text-[#f0ead8] leading-tight tracking-wide">
              FK Novo Doba
            </div>
            <div className="text-[10px] text-[#c49b32] tracking-widest uppercase">
              Kojčinovac · est. 1947
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-6 list-none">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`text-[13px] font-semibold tracking-widest uppercase no-underline pb-1 border-b-2 transition-colors duration-200 ${
                    isActive
                      ? "text-[#c49b32] border-[#c49b32]"
                      : "text-[#8a8880] border-transparent hover:text-[#e8e4d9]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Hamburger button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] cursor-pointer bg-transparent border-none p-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-[2px] bg-[#e8e4d9] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
          />
          <span
            className={`block w-6 h-[2px] bg-[#e8e4d9] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-[2px] bg-[#e8e4d9] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-[#0a0c10]/95 backdrop-blur-sm transition-all duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: "56px" }}
      >
        <ul className="flex flex-col list-none px-6 pt-8 gap-2">
          {navLinks.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <li
                key={link.path}
                className="transition-all duration-300"
                style={{
                  transitionDelay: menuOpen ? `${i * 50}ms` : "0ms",
                  transform: menuOpen ? "translateX(0)" : "translateX(-20px)",
                  opacity: menuOpen ? 1 : 0,
                }}
              >
                <Link
                  to={link.path}
                  onClick={closeMenu}
                  className={`flex items-center justify-between py-4 border-b border-white/05 no-underline group ${
                    isActive ? "text-[#c49b32]" : "text-[#8a8880]"
                  }`}
                >
                  <span className="text-[22px] font-black tracking-widest uppercase group-hover:text-[#f0ead8] transition-colors duration-200">
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="text-[#c49b32] text-lg">→</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom club info */}
        <div className="absolute bottom-10 left-6 right-6">
          <div className="text-[11px] text-[#3a3830] tracking-widest uppercase">
            FK Novo Doba Kojčinovac
          </div>
          <div className="text-[10px] text-[#c49b32]/50 tracking-widest mt-1">
            Est. 1947
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
