import { Link } from "react-router-dom";
import { useLiveMatches } from "../hooks/useCommentary";
import fkNovoDoba from "../assets/logos/fk-novo-doba.png";
import { getTeamLogo } from "../utils/teamLogos";
import { useTranslation } from "react-i18next";

const LiveBadge = () => {
  const { t } = useTranslation();
  const liveMatches = useLiveMatches();

  if (liveMatches.length === 0) return null;

  const match = liveMatches[0];
  const opponentLogo = getTeamLogo(match.opponent);

  return (
    <Link to={`/match/${match.id}`} className="no-underline block">
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-red-500/60 transition-colors duration-200">
        <span className="text-[9px] font-black tracking-widest uppercase bg-red-500 text-white px-2 py-1 rounded-full animate-pulse shrink-0">
          🔴 {t("live.live")}
        </span>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <img
            src={fkNovoDoba}
            alt="FK Novo Doba"
            className="w-6 h-6 object-contain shrink-0"
            style={{ mixBlendMode: "lighten" }}
          />
          <span className="text-[13px] font-bold text-[#f0ead8]">
            {match.scoreHome ?? 0} : {match.scoreAway ?? 0}
          </span>
          {opponentLogo ? (
            <img
              src={opponentLogo}
              alt={match.opponent}
              className="w-6 h-6 object-contain shrink-0"
              style={{ mixBlendMode: "lighten" }}
            />
          ) : null}
          <span className="text-[13px] text-[#8a8880] truncate">
            {match.opponent}
          </span>
        </div>
        <span className="text-[11px] text-red-400 shrink-0">
          {t("live.watch")} →
        </span>
      </div>
    </Link>
  );
};

export default LiveBadge;
