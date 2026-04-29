import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const COOKIE_KEY = "fk_novo_doba_cookies_accepted";

const CookieBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) {
      // Small delay so it doesn't flash on first render
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "true");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:px-6 md:pb-6">
      <div className="bg-[#12161f] border border-white/10 rounded-2xl p-4 md:p-5 shadow-2xl max-w-2xl mx-auto">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-[20px] shrink-0">🍪</span>
          <div>
            <p className="text-[14px] font-bold text-[#f0ead8] mb-1">
              {t("cookies.title")}
            </p>
            <p className="text-[12px] text-[#56544e] leading-relaxed">
              {t("cookies.description")}
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-lg border border-white/10 text-[#8a8880] text-[12px] font-semibold tracking-widests uppercase hover:border-white/20 hover:text-[#f0ead8] transition-colors cursor-pointer bg-transparent"
          >
            {t("cookies.decline")}
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-lg bg-[#c49b32] text-[#0a0c10] text-[12px] font-black tracking-widests uppercase hover:bg-[#d4aa3f] transition-colors cursor-pointer border-none"
          >
            {t("cookies.accept")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
