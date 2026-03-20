import { Link } from "react-router-dom";
import { useLastResult, useNextMatch } from "../hooks/useMatches";
import { useNews } from "../hooks/useNews";
import type { Match, NewsPost } from "../types";

// ── Countdown to next match ──────────────────────────────────────────
const NextMatchCard = ({ match }: { match: Match }) => {
  const date = new Date(match.date);
  const formatted = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Sarajevo",
  });
  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Sarajevo",
  });

  return (
    <div className="bg-[#12161f] border-l-4 border-[#c49b32] border border-[#c49b32]/20 rounded-lg p-4 mb-6">
      <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#c49b32] mb-3">
        Next Match · {match.competition}
      </div>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1 text-[18px] font-bold text-[#f0ead8] tracking-wide">
          FK Novo Doba
        </div>
        <div className="text-[20px] font-black text-[#3a3830] tracking-widest">
          VS
        </div>
        <div className="flex-1 text-[18px] font-bold text-[#f0ead8] tracking-wide text-right">
          {match.opponent}
        </div>
      </div>
      <div className="flex gap-4 text-[11px] text-[#56544e]">
        <span>{formatted}</span>
        <span className="text-[#8a8880]">{time}</span>
        <span className="text-[#8a8880]">{match.venue}</span>
      </div>
    </div>
  );
};

// ── Last result ──────────────────────────────────────────────────────
const ResultCard = ({ match }: { match: Match }) => {
  const goalsFor = match.goalsFor ?? 0;
  const goalsAgainst = match.goalsAgainst ?? 0;
  const isWin = goalsFor > goalsAgainst;
  const isDraw = goalsFor === goalsAgainst;

  const resultLabel = isWin ? "WIN" : isDraw ? "DRAW" : "LOSS";
  const resultColor = isWin
    ? "bg-green-900/30 text-green-400"
    : isDraw
      ? "bg-blue-900/30 text-blue-400"
      : "bg-red-900/30 text-red-400";

  const date = new Date(match.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-[#12161f] border border-[#ffffff]/07 rounded-xl p-5 flex flex-col items-center text-center mb-6">
      <span
        className={`text-[10px] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded mb-3 ${resultColor}`}
      >
        {resultLabel} · {match.competition}
      </span>
      <div className="flex items-center gap-4 mb-2">
        <div className="text-[15px] font-bold text-[#c8c4b8] w-24 text-right">
          FK Novo Doba
        </div>
        <div className="text-[42px] font-black text-[#f5f0e8] leading-none tracking-wider">
          {goalsFor}
          <span className="text-[#3a3830] text-[30px] mx-1">:</span>
          {goalsAgainst}
        </div>
        <div className="text-[15px] font-bold text-[#c8c4b8] w-24 text-left">
          {match.opponent}
        </div>
      </div>
      <div className="text-[11px] text-[#56544e]">
        {date} · {match.venue}
      </div>
    </div>
  );
};

// ── News card ────────────────────────────────────────────────────────
const NewsCard = ({ post }: { post: NewsPost }) => {
  const date = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-[#12161f] border border-[#ffffff]/07 rounded-lg p-4 cursor-pointer hover:border-[#c49b32]/35 transition-colors duration-200">
      <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#cc2222] mb-2">
        {post.tag}
      </div>
      <div className="text-[13px] font-semibold text-[#d8d4c8] leading-snug mb-3">
        {post.title}
      </div>
      <div className="text-[10px] text-[#56544e]">{date}</div>
    </div>
  );
};

// ── Skeleton loader ──────────────────────────────────────────────────
const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-[#12161f] animate-pulse rounded ${className}`} />
);

// ── Home page ────────────────────────────────────────────────────────
const Home = () => {
  const { data: nextMatch, isLoading: loadingNext } = useNextMatch();
  const { data: lastResult, isLoading: loadingResult } = useLastResult();
  const { data: news, isLoading: loadingNews } = useNews(4);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      {/* Hero */}
      <div className="relative bg-[#0d1017] border-b border-white/5 px-7 pt-10 pb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#1a2e8a]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#cc2222]/08 blur-3xl pointer-events-none" />

        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-2">
          Official Club Website
        </p>
        <h1 className="text-[56px] leading-none font-black text-[#f5f0e8] tracking-wide mb-1">
          FK NOVO
          <br />
          <span className="text-[#c49b32]">DOBA</span>
        </h1>
        <p className="text-[12px] text-[#56544e] tracking-widest mb-8">
          Founded 1947 · Čardačine · Kojčinovac
        </p>

        {/* Next match */}
        {loadingNext ? (
          <Skeleton className="h-28 w-full" />
        ) : nextMatch ? (
          <NextMatchCard match={nextMatch} />
        ) : (
          <div className="bg-[#12161f] border border-white/07 rounded-lg p-4 mb-6 text-[#56544e] text-sm">
            No upcoming matches scheduled.
          </div>
        )}
      </div>

      {/* Last result */}
      <div className="px-7 py-6 border-b border-white/05">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[14px] font-bold tracking-[0.1em] uppercase text-[#f0ead8]">
            Last Result
          </h2>
          <Link
            to="/results"
            className="text-[11px] tracking-widest uppercase text-[#c49b32] opacity-70 hover:opacity-100 no-underline transition-opacity"
          >
            All Results →
          </Link>
        </div>
        {loadingResult ? (
          <Skeleton className="h-36 w-full" />
        ) : lastResult ? (
          <ResultCard match={lastResult} />
        ) : (
          <div className="bg-[#12161f] border border-white/07 rounded-lg p-4 text-[#56544e] text-sm">
            No results yet.
          </div>
        )}
      </div>

      {/* News */}
      <div className="px-7 py-6 border-b border-white/05">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[14px] font-bold tracking-[0.1em] uppercase text-[#f0ead8]">
            Latest News
          </h2>
          <Link
            to="/news"
            className="text-[11px] tracking-widest uppercase text-[#c49b32] opacity-70 hover:opacity-100 no-underline transition-opacity"
          >
            All News →
          </Link>
        </div>
        {loadingNews ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : news && news.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {news.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-[#12161f] border border-white/07 rounded-lg p-4 text-[#56544e] text-sm">
            No news yet.
          </div>
        )}
      </div>

      {/* Footer strip */}
      <div className="px-7 py-4 bg-[#0d1017] flex items-center justify-between">
        <span className="text-[11px] text-[#3a3830]">
          © 2026{" "}
          <strong className="text-[#56544e]">FK Novo Doba Kojčinovac</strong>
        </span>
        <span className="text-[10px] text-[#c49b32] tracking-widest">
          EST. 1947
        </span>
      </div>
    </div>
  );
};

export default Home;
