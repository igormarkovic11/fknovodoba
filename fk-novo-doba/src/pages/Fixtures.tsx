import { useMatches } from "../hooks/useMatches";
import type { Match } from "../types";

// ── Skeleton ──────────────────────────────────────────────────────────
const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-[#12161f] animate-pulse rounded-xl ${className}`} />
);

// ── Fixture row ───────────────────────────────────────────────────────
const FixtureRow = ({ match }: { match: Match }) => {
  const matchDate = new Date(match.date);

  const day = matchDate.toLocaleDateString("en-GB", {
    weekday: "short",
    timeZone: "Europe/Sarajevo",
  });
  const time = matchDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Sarajevo",
  });

  const isNext = match.id === match.id; // we'll highlight the first one

  return (
    <div
      className={`bg-[#12161f] border rounded-xl px-4 py-4 flex items-center gap-4 transition-colors duration-200 ${
        isNext
          ? "border-[#c49b32]/40 hover:border-[#c49b32]/70"
          : "border-white/07 hover:border-[#c49b32]/30"
      }`}
    >
      {/* Date block */}
      <div className="flex-shrink-0 w-14 h-14 bg-[#0d1017] rounded-lg flex flex-col items-center justify-center border border-white/05">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#56544e]">
          {day}
        </span>
        <span className="text-[18px] font-black text-[#f5f0e8] leading-none">
          {matchDate.getDate()}
        </span>
        <span className="text-[10px] font-semibold text-[#56544e]">
          {matchDate.toLocaleDateString("en-GB", { month: "short" })}
        </span>
      </div>

      {/* Match info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[15px] font-bold text-[#f0ead8] truncate">
            {match.homeAway === "home" ? "vs" : "@"} {match.opponent}
          </span>
          <span
            className={`flex-shrink-0 text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded border ${
              match.homeAway === "home"
                ? "text-[#c49b32] border-[#c49b32]/30 bg-[#c49b32]/10"
                : "text-[#8a8880] border-white/10 bg-white/05"
            }`}
          >
            {match.homeAway === "home" ? "Home" : "Away"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#56544e]">{time}</span>
          <span className="text-[#3a3830]">·</span>
          <span className="text-[11px] text-[#56544e] truncate">
            {match.venue}
          </span>
        </div>
      </div>

      {/* Competition */}
      <div className="flex-shrink-0 text-right">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#56544e]">
          {match.competition}
        </span>
      </div>
    </div>
  );
};

// ── Fixtures page ─────────────────────────────────────────────────────
const Fixtures = () => {
  const { data: matches, isLoading } = useMatches();

  const upcoming = matches?.filter((m) => m.status === "upcoming") ?? [];

  // Group by month
  const grouped = upcoming.reduce<Record<string, Match[]>>((acc, match) => {
    const month = new Date(match.date).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(match);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      {/* Header */}
      <div className="bg-[#0d1017] border-b border-white/05 px-5 pt-8 pb-6">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-1">
          Season 2025/26
        </p>
        <h1 className="text-[36px] font-black text-[#f5f0e8] tracking-wide leading-none">
          FIXTURES
        </h1>
      </div>

      {/* Fixtures list grouped by month */}
      <div className="px-5 py-6 flex flex-col gap-8">
        {isLoading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)
        ) : Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([month, monthMatches]) => (
            <div key={month}>
              {/* Month label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#c49b32]">
                  {month}
                </span>
                <div className="flex-1 h-px bg-white/05" />
                <span className="text-[11px] text-[#3a3830]">
                  {monthMatches.length}{" "}
                  {monthMatches.length === 1 ? "match" : "matches"}
                </span>
              </div>

              {/* Matches */}
              <div className="flex flex-col gap-3">
                {monthMatches.map((match, index) => (
                  <div key={match.id} className="relative">
                    {/* Next match indicator */}
                    {index === 0 && Object.keys(grouped)[0] === month && (
                      <div className="absolute -top-2 left-4 z-10">
                        <span className="text-[9px] font-black tracking-widest uppercase bg-[#c49b32] text-[#0a0c10] px-2 py-0.5 rounded-full">
                          Next Match
                        </span>
                      </div>
                    )}
                    <FixtureRow match={match} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-[#56544e] text-sm py-12 text-center">
            No fixtures scheduled yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Fixtures;
