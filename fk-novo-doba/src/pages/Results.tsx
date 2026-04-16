import { useState } from "react";
import { useMatches } from "../hooks/useMatches";
import { useTranslation } from "react-i18next";
import type { Match } from "../types";
import PageMeta from "../components/PageMeta";

type Filter = "All" | "Win" | "Draw" | "Loss";

const getResult = (match: Match): "Win" | "Draw" | "Loss" => {
  const gf = match.goalsFor ?? 0;
  const ga = match.goalsAgainst ?? 0;
  if (gf > ga) return "Win";
  if (gf === ga) return "Draw";
  return "Loss";
};

const resultStyles: Record<string, string> = {
  Win: "bg-green-900/30 text-green-400 border-green-400/30",
  Draw: "bg-blue-900/30 text-blue-400 border-blue-400/30",
  Loss: "bg-red-900/30 text-red-400 border-red-400/30",
};

const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-[#12161f] animate-pulse rounded-xl ${className}`} />
);

const ResultRow = ({ match }: { match: Match }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "sr" ? "sr-Latn-RS" : "en-GB";
  const result = getResult(match);
  const gf = match.goalsFor ?? 0;
  const ga = match.goalsAgainst ?? 0;
  const date = new Date(match.date).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Sarajevo",
  });

  return (
    <div className="bg-[#12161f] border border-white/07 rounded-xl px-4 py-4 flex items-center gap-3 hover:border-[#c49b32]/30 transition-colors duration-200">
      <div
        className={`shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center text-[11px] font-black tracking-wider ${resultStyles[result]}`}
      >
        {result[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[15px] font-bold text-[#f0ead8] truncate">
            {match.homeAway === "home" ? "vs" : "@"} {match.opponent}
          </span>
          <span
            className={`shrink-0 text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded border ${
              match.homeAway === "home"
                ? "text-[#c49b32] border-[#c49b32]/30 bg-[#c49b32]/10"
                : "text-[#8a8880] border-white/10 bg-white/05"
            }`}
          >
            {match.homeAway === "home"
              ? t("fixtures.home")
              : t("fixtures.away")}
          </span>
        </div>
        <span className="text-[11px] text-[#56544e]">{date}</span>
      </div>
      <div className="shrink-0 text-right">
        <span className="text-[22px] font-black text-[#f5f0e8] tracking-wider leading-none">
          {gf}
          <span className="text-[#3a3830] mx-0.5">:</span>
          {ga}
        </span>
      </div>
    </div>
  );
};

const Results = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const { data: matches, isLoading } = useMatches();

  const played = matches?.filter((m) => m.status === "played") ?? [];
  const filtered = played.filter((m) =>
    activeFilter === "All" ? true : getResult(m) === activeFilter,
  );
  const wins = played.filter((m) => getResult(m) === "Win").length;
  const draws = played.filter((m) => getResult(m) === "Draw").length;
  const losses = played.filter((m) => getResult(m) === "Loss").length;

  const filters = [
    { key: "All" as Filter, label: t("results.all") },
    { key: "Win" as Filter, label: t("results.win") },
    { key: "Draw" as Filter, label: t("results.draw") },
    { key: "Loss" as Filter, label: t("results.loss") },
  ];

  const filterActiveStyles: Record<Filter, string> = {
    All: "bg-[#c49b32] text-[#0a0c10] border-[#c49b32]",
    Win: "bg-green-900/60 text-green-400 border-green-400/60",
    Draw: "bg-blue-900/60 text-blue-400 border-blue-400/60",
    Loss: "bg-red-900/60 text-red-400 border-red-400/60",
  };

  return (
    <>
      <PageMeta
        title="Rezultati"
        description="Svi rezultati FK Novo Doba Kojčinovac u sezoni 2025/26."
      />
      <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
        <div className="bg-[#0d1017] border-b border-white/05 px-5 pt-8 pb-6">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-1">
            {t("results.season")}
          </p>
          <h1 className="text-[36px] font-black text-[#f5f0e8] tracking-wide leading-none mb-5">
            {t("results.title")}
          </h1>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-900/20 border border-green-400/20 rounded-xl p-3 text-center">
              <span className="text-[26px] font-black text-green-400 leading-none block">
                {wins}
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-green-400/60">
                {t("results.win")}
              </span>
            </div>
            <div className="bg-blue-900/20 border border-blue-400/20 rounded-xl p-3 text-center">
              <span className="text-[26px] font-black text-blue-400 leading-none block">
                {draws}
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-blue-400/60">
                {t("results.draw")}
              </span>
            </div>
            <div className="bg-red-900/20 border border-red-400/20 rounded-xl p-3 text-center">
              <span className="text-[26px] font-black text-red-400 leading-none block">
                {losses}
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-red-400/60">
                {t("results.loss")}
              </span>
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-b border-white/05 flex gap-2 overflow-x-auto scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase border transition-colors duration-200 cursor-pointer ${
                activeFilter === f.key
                  ? filterActiveStyles[f.key]
                  : "bg-transparent text-[#8a8880] border-white/10 hover:border-[#c49b32]/40 hover:text-[#f0ead8]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="px-5 py-6 flex flex-col gap-3">
          {isLoading ? (
            [...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)
          ) : filtered.length > 0 ? (
            filtered.map((match) => <ResultRow key={match.id} match={match} />)
          ) : (
            <div className="text-[#56544e] text-sm py-12 text-center">
              {t("results.noResults")}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Results;
