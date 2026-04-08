import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePlayer } from "../hooks/usePlayers";
import { useState } from "react";

const positionColor: Record<string, string> = {
  Goalkeeper: "text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/10",
  Defender: "text-[#3b82f6] border-[#3b82f6]/40 bg-[#3b82f6]/10",
  Midfielder: "text-[#10b981] border-[#10b981]/40 bg-[#10b981]/10",
  Forward: "text-[#ef4444] border-[#ef4444]/40 bg-[#ef4444]/10",
};

const statStyles = {
  appearances: "bg-[#c49b32]/10 text-[#c49b32] border-[#c49b32]/30",
  goals: "bg-green-900/20 text-green-400 border-green-400/20",
  assists: "bg-blue-900/20 text-blue-400 border-blue-400/20",
  jersey: "bg-white/05 text-[#f5f0e8] border-white/10",
};

const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-[#12161f] animate-pulse rounded-xl ${className}`} />
);

const Player = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: player, isLoading } = usePlayer(id ?? "");
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] px-5 pt-6">
        <Skeleton className="h-8 w-24 mb-6" />
        <Skeleton className="h-72 w-full mb-6" />
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center text-[#56544e]">
        <p className="text-[18px] font-bold mb-4">{t("player.notFound")}</p>
        <button
          onClick={() => navigate("/roster")}
          className="text-[#c49b32] text-sm uppercase tracking-widest border border-[#c49b32]/30 px-4 py-2 rounded-lg hover:bg-[#c49b32]/10 transition-colors cursor-pointer bg-transparent"
        >
          {t("player.backToRoster")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      <div className="px-5 pt-5">
        <button
          onClick={() => navigate("/roster")}
          className="text-[11px] font-semibold tracking-widest uppercase text-[#8a8880] hover:text-[#c49b32] transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
        >
          {t("player.backToRoster")}
        </button>
      </div>

      <div className="bg-[#0d1017] border-b border-white/05 mt-4 mx-5 rounded-xl overflow-hidden">
        <div className="relative bg-[#0a0c10] w-full h-64 flex items-center justify-center overflow-hidden">
          {player.photoUrl ? (
            <img
              src={player.photoUrl}
              alt={player.name}
              loading="lazy"
              onLoad={() => setIsLoaded(true)} // Okidač za sklanjanje skeletona
              className={`h-full w-auto object-contain transition-opacity duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-24 h-24 rounded-full bg-[#1a1f2e] border-2 border-white/10 flex items-center justify-center mb-3">
                <span className="text-[40px] font-black text-[#2a2f3e]">
                  {player.number}
                </span>
              </div>
              <div className="w-36 h-28 rounded-t-full bg-[#1a1f2e] border-2 border-b-0 border-white/10" />
            </div>
          )}
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#c49b32] flex items-center justify-center">
            <span className="text-[16px] font-black text-[#0a0c10]">
              {player.number}
            </span>
          </div>
        </div>
        <div className="px-5 py-5">
          <h1 className="text-[32px] font-black text-[#f5f0e8] leading-tight tracking-wide mb-3">
            {player.name}
          </h1>
          <span
            className={`text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded border ${positionColor[player.position]}`}
          >
            {/* Translate Position */}
            {t(`player.positions.${player.position}`)}
          </span>
        </div>
      </div>

      <div className="px-5 mt-5">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-3">
          {t("player.seasonStats")}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {/* APPEARANCES - Club Gold */}
          <div
            className={`rounded-xl p-4 border flex flex-col items-center text-center transition-all ${statStyles.appearances}`}
          >
            <span className="text-[28px] font-black leading-none mb-1">
              {player.appearances || 0}
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">
              {t("player.appearances")}
            </span>
          </div>

          {/* GOALS - Success Green */}
          <div
            className={`rounded-xl p-4 border flex flex-col items-center text-center transition-all ${statStyles.goals}`}
          >
            <span className="text-[28px] font-black leading-none mb-1">
              {player.goals}
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">
              {t("player.goals")}
            </span>
          </div>

          {/* ASSISTS - Playmaker Blue */}
          <div
            className={`rounded-xl p-4 border flex flex-col items-center text-center transition-all ${statStyles.assists}`}
          >
            <span className="text-[28px] font-black leading-none mb-1">
              {player.assists}
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">
              {t("player.assists")}
            </span>
          </div>

          {/* JERSEY - Neutral Silver */}
          <div
            className={`rounded-xl p-4 border flex flex-col items-center text-center transition-all ${statStyles.jersey}`}
          >
            <span className="text-[28px] font-black leading-none mb-1">
              #{player.number}
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">
              {t("player.jersey")}
            </span>
          </div>
        </div>
      </div>

      {player.age && (
        <div className="px-5 mt-4">
          <div className="bg-[#12161f] border border-white/07 rounded-xl p-4 flex items-center justify-between">
            <span className="text-[12px] font-semibold tracking-widest uppercase text-[#56544e]">
              {t("player.age")}
            </span>
            <span className="text-[18px] font-black text-[#f5f0e8]">
              {player.age}
            </span>
          </div>
        </div>
      )}

      {player.bio && (
        <div className="px-5 mt-4 pb-10">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-3">
            {t("player.about")}
          </p>
          <div className="bg-[#12161f] border border-white/07 rounded-xl p-5">
            <p className="text-[14px] text-[#8a8880] leading-relaxed whitespace-pre-line">
              {player.bio}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
