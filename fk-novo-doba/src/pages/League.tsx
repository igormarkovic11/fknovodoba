import { useState } from "react";
import { useStandings, useSeasons } from "../hooks/useStandings";
import type { Standing } from "../types";
import { getTeamLogo } from "../utils/teamLogos";

const MY_CLUB = "FK Novo Doba";
const CURRENT_SEASON = "2025-26";

const StandingRow = ({
  standing,
  position,
}: {
  standing: Standing;
  position: number;
}) => {
  const isMyClub = standing.team === MY_CLUB;
  const gd = standing.goalsFor - standing.goalsAgainst;
  const logo = getTeamLogo(standing.team);

  return (
    <tr
      className={`border-t transition-colors duration-200 ${
        isMyClub
          ? "border-[#c49b32]/30 bg-[#c49b32]/10"
          : "border-white/04 hover:bg-white/02"
      }`}
    >
      {/* Position */}
      <td className="py-3 pl-4 pr-2">
        <span
          className={`text-[13px] font-black ${
            position <= 3 ? "text-[#c49b32]" : "text-[#3a3830]"
          }`}
        >
          {position}
        </span>
      </td>

      {/* Team */}
      <td className="py-3 px-2">
        <div className="flex items-center gap-2">
          {/* Logo or initials fallback */}
          {logo ? (
            <img
              src={logo}
              alt={standing.team}
              className="w-6 h-6 object-contain flex-shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#1a1f2e] border border-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-black text-[#56544e]">
                {standing.team
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
          )}
          <span
            className={`text-[13px] font-semibold ${
              isMyClub ? "text-[#f0ead8]" : "text-[#8a8880]"
            }`}
          >
            {standing.team}
          </span>
        </div>
      </td>

      {/* Played */}
      <td className="py-3 px-2 text-center">
        <span
          className={`text-[12px] ${isMyClub ? "text-[#f0ead8]" : "text-[#56544e]"}`}
        >
          {standing.played}
        </span>
      </td>

      {/* Won */}
      <td className="py-3 px-2 text-center">
        <span
          className={`text-[12px] ${isMyClub ? "text-[#f0ead8]" : "text-[#56544e]"}`}
        >
          {standing.won}
        </span>
      </td>

      {/* Drawn */}
      <td className="py-3 px-2 text-center">
        <span
          className={`text-[12px] ${isMyClub ? "text-[#f0ead8]" : "text-[#56544e]"}`}
        >
          {standing.drawn}
        </span>
      </td>

      {/* Lost */}
      <td className="py-3 px-2 text-center">
        <span
          className={`text-[12px] ${isMyClub ? "text-[#f0ead8]" : "text-[#56544e]"}`}
        >
          {standing.lost}
        </span>
      </td>

      {/* GD */}
      <td className="py-3 px-2 text-center hidden sm:table-cell">
        <span
          className={`text-[12px] font-semibold ${
            isMyClub
              ? "text-[#f0ead8]"
              : gd > 0
                ? "text-green-400"
                : gd < 0
                  ? "text-red-400"
                  : "text-[#56544e]"
          }`}
        >
          {gd > 0 ? `+${gd}` : gd}
        </span>
      </td>

      {/* Points */}
      <td className="py-3 pr-4 pl-2 text-right">
        <span
          className={`text-[15px] font-black ${
            isMyClub ? "text-[#c49b32]" : "text-[#f0ead8]"
          }`}
        >
          {standing.points}
        </span>
      </td>
    </tr>
  );
};

const League = () => {
  const [activeSeason, setActiveSeason] = useState(CURRENT_SEASON);
  const { data: seasons, isLoading: loadingSeasons } = useSeasons();
  const { data: standings, isLoading: loadingStandings } =
    useStandings(activeSeason);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      {/* Header */}
      <div className="bg-[#0d1017] border-b border-white/05 px-5 pt-8 pb-6">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-1">
          Prva Opštinska Liga Bijeljina Istok
        </p>
        <h1 className="text-[36px] font-black text-[#f5f0e8] tracking-wide leading-none">
          LEAGUE TABLE
        </h1>
      </div>

      {/* Season selector */}
      <div className="px-5 py-4 border-b border-white/05 flex gap-2 overflow-x-auto scrollbar-none">
        {loadingSeasons ? (
          <div className="h-8 w-32 bg-[#12161f] animate-pulse rounded-full" />
        ) : (
          seasons?.map((season) => (
            <button
              key={season}
              onClick={() => setActiveSeason(season)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase border transition-colors duration-200 cursor-pointer ${
                activeSeason === season
                  ? "bg-[#c49b32] text-[#0a0c10] border-[#c49b32]"
                  : "bg-transparent text-[#8a8880] border-white/10 hover:border-[#c49b32]/40 hover:text-[#f0ead8]"
              }`}
            >
              {season}
            </button>
          ))
        )}
      </div>

      {/* Table */}
      <div className="px-5 py-6">
        <div className="bg-[#12161f] border border-white/07 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0d1017]">
                  <th className="py-3 pl-4 pr-2 text-left">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                      #
                    </span>
                  </th>
                  <th className="py-3 px-2 text-left">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                      Club
                    </span>
                  </th>
                  <th className="py-3 px-2 text-center">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                      P
                    </span>
                  </th>
                  <th className="py-3 px-2 text-center">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                      W
                    </span>
                  </th>
                  <th className="py-3 px-2 text-center">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                      D
                    </span>
                  </th>
                  <th className="py-3 px-2 text-center">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                      L
                    </span>
                  </th>
                  <th className="py-3 px-2 text-center hidden sm:table-cell">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                      GD
                    </span>
                  </th>
                  <th className="py-3 pr-4 pl-2 text-right">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                      Pts
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingStandings ? (
                  [...Array(10)].map((_, i) => (
                    <tr key={i} className="border-t border-white/04">
                      <td colSpan={8} className="py-2 px-4">
                        <div className="bg-[#0d1017] animate-pulse rounded h-6 w-full" />
                      </td>
                    </tr>
                  ))
                ) : standings && standings.length > 0 ? (
                  standings.map((standing, index) => (
                    <StandingRow
                      key={standing.id}
                      standing={standing}
                      position={index + 1}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-[#56544e] text-sm"
                    >
                      No standings data yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-white/05 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#c49b32]" />
              <span className="text-[10px] text-[#56544e]">FK Novo Doba</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#c49b32] font-bold">#</span>
              <span className="text-[10px] text-[#56544e]">Top 3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default League;
