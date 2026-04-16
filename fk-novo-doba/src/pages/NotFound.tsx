import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageMeta from "../components/PageMeta";
import logo from "../assets/logos/fk-novo-doba.webp";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <PageMeta title={t("errors.notFoundTitle")} />
      <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center px-5 text-center">
        {/* Logo */}
        <img
          src={logo}
          alt="FK Novo Doba"
          className="w-20 h-20 object-contain mb-8 opacity-30"
          style={{ mixBlendMode: "lighten" }}
        />

        {/* 404 */}
        <h1 className="text-[80px] md:text-[120px] font-black text-[#c49b32] leading-none mb-2">
          404
        </h1>
        <p className="text-[18px] font-bold text-[#f0ead8] mb-2">
          {t("errors.notFoundSubtitle")}
        </p>
        <p className="text-[14px] text-[#56544e] mb-8 max-w-sm">
          {t("errors.notFoundDescription")}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-[#c49b32] text-[#0a0c10] text-[13px] font-black tracking-widest uppercase hover:bg-[#d4aa3f] transition-colors cursor-pointer border-none"
          >
            {t("errors.backHome")}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border border-white/10 text-[#8a8880] text-[13px] font-semibold tracking-widest uppercase hover:border-[#c49b32]/40 hover:text-[#f0ead8] transition-colors cursor-pointer bg-transparent"
          >
            {t("errors.goBack")}
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
