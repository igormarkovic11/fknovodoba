import { useVoting } from "../hooks/useVoting";
import { useLineup } from "../hooks/useCommentary";
import { useTranslation } from "react-i18next";

const PlayerOfTheMatch = ({ matchId }: { matchId: string }) => {
  const { t } = useTranslation();
  const { lineup } = useLineup(matchId);
  const { results, hasVoted, loading, saving, vote } = useVoting(matchId);

  if (!lineup) return null;

  const allPlayers = [...(lineup.starting ?? []), ...(lineup.reserves ?? [])];
  if (allPlayers.length === 0) return null;

  const winner = results[0];

  return (
    <div className="px-5 py-6 border-t border-white/05">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[24px]">🏆</span>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32]">
            {t("vote.title")}
          </p>
          <p className="text-[12px] text-[#56544e]">
            {hasVoted ? t("vote.thankYou") : t("vote.instructions")}
          </p>
        </div>
      </div>

      {/* Winner banner — shown after voting */}
      {hasVoted && winner && (
        <div className="bg-[#c49b32]/10 border border-[#c49b32]/30 rounded-xl p-4 flex items-center gap-3 mb-5">
          <span className="text-[28px]">⭐</span>
          <div>
            <p className="text-[11px] text-[#c49b32] font-semibold tracking-widest uppercase mb-0.5">
              {t("vote.leading")}
            </p>
            <p className="text-[16px] font-black text-[#f0ead8]">
              {winner.playerName}
            </p>
            <p className="text-[12px] text-[#56544e]">
              {winner.percentage}% {t("vote.ofVotes")}
            </p>
          </div>
        </div>
      )}

      {/* Voting — before voted */}
      {!hasVoted && !loading && (
        <div className="flex flex-col gap-2 mb-4">
          {/* Starting XI */}
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#56544e] mb-1">
            {t("live.startingXI")}
          </p>
          {lineup.starting.map((player) => (
            <button
              key={player.playerId}
              onClick={() => vote(player.playerId, player.name)}
              disabled={saving}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/07 hover:border-[#c49b32]/40 hover:bg-[#c49b32]/05 transition-colors duration-200 cursor-pointer bg-transparent text-left w-full disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-[#c49b32] flex items-center justify-center shrink-0">
                <span className="text-[11px] font-black text-[#0a0c10]">
                  {player.number}
                </span>
              </div>
              <span className="text-[14px] font-semibold text-[#f0ead8]">
                {player.name}
              </span>
              <span className="text-[11px] text-[#56544e] ml-auto">
                {player.position}
              </span>
            </button>
          ))}

          {/* Reserves */}
          {lineup.reserves.length > 0 && (
            <>
              <p className="text-[10px] font-semibold tracking-widests uppercase text-[#56544e] mt-3 mb-1">
                {t("live.reserves")}
              </p>
              {lineup.reserves.map((player) => (
                <button
                  key={player.playerId}
                  onClick={() => vote(player.playerId, player.name)}
                  disabled={saving}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/07 hover:border-[#c49b32]/40 hover:bg-[#c49b32]/05 transition-colors duration-200 cursor-pointer bg-transparent text-left w-full disabled:opacity-50"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1a1f2e] border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-black text-[#56544e]">
                      {player.number}
                    </span>
                  </div>
                  <span className="text-[14px] font-semibold text-[#f0ead8]">
                    {player.name}
                  </span>
                  <span className="text-[11px] text-[#56544e] ml-auto">
                    {player.position}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Results — shown after voting */}
      {hasVoted && !loading && results.length > 0 && (
        <div className="flex flex-col gap-3">
          {results.map((result, index) => (
            <div key={result.playerId} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {index === 0 && <span className="text-[14px]">⭐</span>}
                  <span
                    className={`text-[13px] font-semibold ${index === 0 ? "text-[#f0ead8]" : "text-[#8a8880]"}`}
                  >
                    {result.playerName}
                  </span>
                </div>
                <span className="text-[12px] font-bold text-[#c49b32]">
                  {result.percentage}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-[#0d1017] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${index === 0 ? "bg-[#c49b32]" : "bg-[#3a3830]"}`}
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
              <span className="text-[10px] text-[#3a3830]">
                {result.count}{" "}
                {result.count === 1 ? t("vote.vote") : t("vote.votes")}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#12161f] animate-pulse rounded-xl h-14"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerOfTheMatch;
