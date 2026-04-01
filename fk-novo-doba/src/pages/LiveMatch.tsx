import { useParams, useNavigate } from "react-router-dom";
import { useLiveMatch, useCommentary, useLineup } from "../hooks/useCommentary";
import { getEmoji } from "../utils/commentaryFormatter";
import fkNovoDoba from "../assets/logos/fk-novo-doba.png";
import { getTeamLogo } from "../utils/teamLogos";

const LiveMatch = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { match, loading: loadingMatch } = useLiveMatch(matchId ?? "");
  const { events, loading: loadingEvents } = useCommentary(matchId ?? "");
  const { lineup } = useLineup(matchId ?? "");

  if (loadingMatch) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#c49b32] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center text-[#56544e]">
        <p className="text-[18px] font-bold mb-4">Match not found.</p>
        <button
          onClick={() => navigate("/")}
          className="text-[#c49b32] text-sm uppercase tracking-widest border border-[#c49b32]/30 px-4 py-2 rounded-lg hover:bg-[#c49b32]/10 transition-colors cursor-pointer bg-transparent"
        >
          ← Home
        </button>
      </div>
    );
  }

  const opponentLogo = getTeamLogo(match.opponent);
  const isLive = match.status === "live";

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      {/* Match header */}
      <div className="bg-[#0d1017] border-b border-white/05 px-5 pt-8 pb-6">
        {/* Live badge */}
        {isLive && (
          <div className="flex justify-center mb-4">
            <span className="text-[11px] font-black tracking-widests uppercase bg-red-500 text-white px-4 py-1.5 rounded-full animate-pulse">
              🔴 LIVE
            </span>
          </div>
        )}

        {/* Teams + score */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 flex flex-col items-center gap-2">
            <img
              src={fkNovoDoba}
              alt="FK Novo Doba"
              className="w-16 h-16 object-contain"
              style={{ mixBlendMode: "lighten" }}
            />
            <span className="text-[13px] font-bold text-[#f0ead8] text-center">
              FK Novo Doba
            </span>
          </div>
          <div className="text-center">
            <div className="text-[48px] font-black text-[#f5f0e8] leading-none tracking-wider">
              {match.scoreHome ?? 0}
              <span className="text-[#3a3830] text-[36px] mx-2">:</span>
              {match.scoreAway ?? 0}
            </div>
            <p className="text-[11px] text-[#56544e] mt-1">
              {match.competition}
            </p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            {opponentLogo ? (
              <img
                src={opponentLogo}
                alt={match.opponent}
                className="w-16 h-16 object-contain"
                style={{ mixBlendMode: "lighten" }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#1a1f2e] border border-white/10 flex items-center justify-center">
                <span className="text-[11px] font-black text-[#56544e]">
                  {match.opponent
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-[13px] font-bold text-[#f0ead8] text-center">
              {match.opponent}
            </span>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#56544e]">{match.venue}</p>
      </div>

      {/* Lineup */}
      {lineup && (
        <div className="px-5 py-6 border-b border-white/05">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
            Starting XI
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {lineup.starting.map((player) => (
              <div
                key={player.playerId}
                className="flex items-center gap-2 bg-[#12161f] border border-white/07 rounded-lg px-3 py-2"
              >
                <div className="w-6 h-6 rounded-full bg-[#c49b32] flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-black text-[#0a0c10]">
                    {player.number}
                  </span>
                </div>
                <span className="text-[12px] font-semibold text-[#f0ead8] truncate">
                  {player.name}
                </span>
              </div>
            ))}
          </div>
          {lineup.reserves.length > 0 && (
            <>
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#56544e] mb-3">
                Reserves
              </p>
              <div className="grid grid-cols-2 gap-2">
                {lineup.reserves.map((player) => (
                  <div
                    key={player.playerId}
                    className="flex items-center gap-2 bg-[#12161f] border border-white/05 rounded-lg px-3 py-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#1a1f2e] border border-white/10 flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-black text-[#56544e]">
                        {player.number}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#8a8880] truncate">
                      {player.name}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Commentary feed */}
      <div className="px-5 py-6">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
          {isLive ? "Live Commentary" : "Match Report"}
        </p>
        {loadingEvents ? (
          <div className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-[#12161f] animate-pulse rounded-xl h-14"
              />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="flex flex-col gap-2">
            {events.map((event) => (
              <div
                key={event.id}
                className={`bg-[#12161f] border rounded-xl px-4 py-3 flex items-center gap-3 ${
                  event.type === "goal"
                    ? "border-[#c49b32]/30"
                    : event.type === "halftime" || event.type === "fulltime"
                      ? "border-white/20"
                      : "border-white/07"
                }`}
              >
                <span className="text-[20px] shrink-0">
                  {getEmoji(event.type)}
                </span>
                <p className="text-[14px] text-[#f0ead8] leading-snug">
                  {event.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[#56544e] text-sm text-center py-12">
            {isLive
              ? "Waiting for match events..."
              : "No commentary available."}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatch;
