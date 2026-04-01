import { Link } from "react-router-dom";
import { useLastResult, useNextMatch } from "../hooks/useMatches";
import { useNews } from "../hooks/useNews";
import fkNovoDoba from "../assets/logos/fk-novo-doba.webp";
import { getTeamLogo } from "../utils/teamLogos";
import type { Match, NewsPost } from "../types";
import { useTranslation } from "react-i18next";
import LiveBadge from "../components/LiveBadge";

const NextMatchCard = ({ match }: { match: Match }) => {
  const { t, i18n } = useTranslation();
  // Force Serbian Latin locale
  const locale = i18n.language === "sr" ? "sr-Latn-RS" : "en-GB";

  const date = new Date(match.date);
  const formatted = date.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Sarajevo",
  });
  const time = date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Sarajevo",
  });
  const opponentLogo = getTeamLogo(match.opponent);

  return (
    <div className="bg-white/05 backdrop-blur-sm border border-[#c49b32]/30 rounded-xl p-4">
      <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
        {t("home.nextMatch")} · {match.competition}
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 flex items-center gap-2">
          <img
            src={fkNovoDoba}
            alt="FK Novo Doba"
            className="w-8 h-8 object-contain"
            style={{ mixBlendMode: "lighten" }}
          />
          <span className="text-[14px] font-black text-[#f0ead8] tracking-wide">
            FK Novo Doba
          </span>
        </div>
        <div className="text-[16px] font-black text-[#3a3830] tracking-widest px-2">
          VS
        </div>
        <div className="flex-1 flex items-center justify-end gap-2">
          <span className="text-[14px] font-black text-[#f0ead8] tracking-wide text-right">
            {match.opponent}
          </span>
          {opponentLogo ? (
            <img
              src={opponentLogo}
              alt={match.opponent}
              className="w-8 h-8 object-contain"
              style={{ mixBlendMode: "lighten" }}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1a1f2e] border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-[8px] font-black text-[#56544e]">
                {match.opponent
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] text-[#56544e] border-t border-white/05 pt-3 mt-1">
        <span className="capitalize">{formatted}</span>
        <span className="text-[#8a8880]">{time}</span>
        <span className="text-[#8a8880]">{match.venue}</span>
      </div>
    </div>
  );
};
const ResultCard = ({ match }: { match: Match }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "sr" ? "sr-Latn-RS" : "en-GB";

  const gf = match.goalsFor ?? 0;
  const ga = match.goalsAgainst ?? 0;
  const isWin = gf > ga;
  const isDraw = gf === ga;

  // Translate Result Label (WIN/DRAW/LOSS)
  const resultLabel = isWin
    ? t("results.win")
    : isDraw
      ? t("results.draw")
      : t("results.loss");

  const resultColor = isWin
    ? "bg-green-900/30 text-green-400"
    : isDraw
      ? "bg-blue-900/30 text-blue-400"
      : "bg-red-900/30 text-red-400";

  const date = new Date(match.date).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Sarajevo",
  });
  const opponentLogo = getTeamLogo(match.opponent);

  return (
    <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 flex flex-col items-center text-center">
      <span
        className={`text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded mb-4 ${resultColor}`}
      >
        {resultLabel} · {match.competition}
      </span>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex flex-col items-center gap-2 w-24">
          <img
            src={fkNovoDoba}
            alt="FK Novo Doba"
            className="w-10 h-10 object-contain"
            style={{ mixBlendMode: "lighten" }}
          />
          <span className="text-[11px] font-bold text-[#8a8880]">
            FK Novo Doba
          </span>
        </div>
        <div className="text-[44px] font-black text-[#f5f0e8] leading-none tracking-wider">
          {gf}
          <span className="text-[#3a3830] text-[30px] mx-1">:</span>
          {ga}
        </div>
        <div className="flex flex-col items-center gap-2 w-24">
          {opponentLogo ? (
            <img
              src={opponentLogo}
              alt={match.opponent}
              className="w-10 h-10 object-contain"
              style={{ mixBlendMode: "lighten" }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1a1f2e] border border-white/10 flex items-center justify-center">
              <span className="text-[9px] font-black text-[#56544e]">
                {match.opponent
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-[11px] font-bold text-[#8a8880]">
            {match.opponent}
          </span>
        </div>
      </div>
      <div className="text-[11px] text-[#56544e] capitalize">
        {date} · {match.venue}
      </div>
    </div>
  );
};
const NewsCard = ({ post }: { post: NewsPost }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "sr" ? "sr-Latn-RS" : "en-GB";

  const date = new Date(post.date).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Sarajevo",
  });

  return (
    <Link to={`/news/${post.id}`} className="no-underline">
      <div className="bg-[#12161f] border border-white/07 rounded-xl p-4 cursor-pointer hover:border-[#c49b32]/35 transition-colors duration-200 h-full">
        <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[#cc2222] mb-2">
          {/* Translate Tag */}
          {t(`news.tags.${post.tag}`)}
        </div>
        <div className="text-[14px] font-semibold text-[#d8d4c8] leading-snug mb-3">
          {post.title}
        </div>
        {post.excerpt && (
          <p className="text-[12px] text-[#56544e] leading-relaxed line-clamp-2 mb-3">
            {post.excerpt}
          </p>
        )}
        <div className="text-[10px] text-[#3a3830] capitalize">{date}</div>
      </div>
    </Link>
  );
};

const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-[#12161f] animate-pulse rounded-xl ${className}`} />
);

const Home = () => {
  const { t } = useTranslation();
  const { data: nextMatch, isLoading: loadingNext } = useNextMatch();
  const { data: lastResult, isLoading: loadingResult } = useLastResult();
  const { data: news, isLoading: loadingNews } = useNews(4);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      {/* ── HERO ── */}
      <div className="relative bg-[#0d1017] border-b border-white/05 overflow-hidden">
        <div className="relative pt-10 pb-8 md:min-h-[320px]">
          {/* Top row — text + divider + logo */}
          <div className="md:flex md:items-start md:gap-0 mb-6 px-5">
            <div className="flex-1">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#c49b32] mb-3">
                {t("home.official")}
              </p>
              <h1 className="font-black text-[#f5f0e8] leading-none tracking-wide mb-2">
                <span className="block text-[58px] md:text-[72px]">
                  FK NOVO
                </span>
                <span className="block text-[58px] md:text-[72px] text-[#c49b32]">
                  DOBA
                </span>
              </h1>
              <p className="text-[12px] text-[#3a3830] tracking-widest">
                {t("home.founded")}
              </p>
            </div>
            <div
              className="hidden md:block w-px bg-white/05 mx-8"
              style={{ alignSelf: "stretch" }}
            />
            {/* Right — logo */}
            <div className="hidden md:flex shrink-0 items-center justify-center w-56">
              <img
                src={fkNovoDoba}
                alt="FK Novo Doba"
                className="w-48 h-48 object-contain"
                style={{ mixBlendMode: "lighten" }}
                fetchPriority="high"
                loading="eager"
              />
            </div>
          </div>

          {/* Next match */}
          <LiveBadge />
          <div className="border-t border-white/05 pt-6 mt-6 px-5">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-[13px] font-black tracking-[0.12em] uppercase text-[#f0ead8]">
                {t("home.nextMatch")}
              </h2>
              <Link
                to="/fixtures"
                className="text-[11px] tracking-widest uppercase text-[#c49b32] opacity-70 hover:opacity-100 no-underline transition-opacity"
              >
                {t("home.allFixtures")}
              </Link>
            </div>
            {loadingNext ? (
              <Skeleton className="h-28 w-full" />
            ) : nextMatch ? (
              <NextMatchCard match={nextMatch} />
            ) : (
              <div className="bg-white/03 border border-dashed border-white/10 rounded-xl p-4 text-[#3a3830] text-[13px] text-center">
                {t("home.noFixtures")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── LAST RESULT ── */}
      <div className="px-5 py-6 border-b border-white/05">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[13px] font-black tracking-[0.12em] uppercase text-[#f0ead8]">
            {t("home.lastResult")}
          </h2>
          <Link
            to="/results"
            className="text-[11px] tracking-widest uppercase text-[#c49b32] opacity-70 hover:opacity-100 no-underline transition-opacity"
          >
            {t("home.allResults")}
          </Link>
        </div>
        {loadingResult ? (
          <Skeleton className="h-36 w-full" />
        ) : lastResult ? (
          <ResultCard match={lastResult} />
        ) : (
          <div className="bg-white/03 border border-dashed border-white/10 rounded-xl p-6 text-[#3a3830] text-[13px] text-center">
            {t("home.noResults")}
          </div>
        )}
      </div>

      {/* ── LATEST NEWS ── */}
      <div className="px-5 py-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[13px] font-black tracking-[0.12em] uppercase text-[#f0ead8]">
            {t("home.latestNews")}
          </h2>
          <Link
            to="/news"
            className="text-[11px] tracking-widest uppercase text-[#c49b32] opacity-70 hover:opacity-100 no-underline transition-opacity"
          >
            {t("home.allNews")}
          </Link>
        </div>
        {loadingNews ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : news && news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {news.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white/03 border border-dashed border-white/10 rounded-xl p-6 text-[#3a3830] text-[13px] text-center">
            {t("home.noNews")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
