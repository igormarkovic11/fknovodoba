import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePlayers, useStaff } from "../hooks/usePlayers";
import type { Player, Staff } from "../types";
import PageMeta from "../components/PageMeta";

const positionColor: Record<string, string> = {
  Goalkeeper: "text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/10",
  Defender: "text-[#3b82f6] border-[#3b82f6]/40 bg-[#3b82f6]/10",
  Midfielder: "text-[#10b981] border-[#10b981]/40 bg-[#10b981]/10",
  Forward: "text-[#ef4444] border-[#ef4444]/40 bg-[#ef4444]/10",
};

const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-[#12161f] animate-pulse rounded-xl ${className}`} />
);

const PlayerCard = ({ player }: { player: Player }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-[#12161f] border border-white/07 rounded-xl overflow-hidden flex flex-col hover:border-[#c49b32]/40 transition-colors duration-200">
      <div className="relative bg-[#0d1017] aspect-square flex items-center justify-center overflow-hidden">
        {player.photoUrl ? (
          <img
            src={player.photoUrl}
            alt={player.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-16 h-16 rounded-full bg-[#1a1f2e] border-2 border-white/10 flex items-center justify-center mb-2">
              <span className="text-[28px] font-black text-[#2a2f3e]">
                {player.number}
              </span>
            </div>
            <div className="w-24 h-20 rounded-t-full bg-[#1a1f2e] border-2 border-b-0 border-white/10" />
          </div>
        )}
        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#c49b32] flex items-center justify-center">
          <span className="text-[12px] font-black text-[#0a0c10]">
            {player.number}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-[15px] font-bold text-[#f0ead8] leading-tight">
          {player.name}
        </p>
        <span
          className={`self-start text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded border ${positionColor[player.position]}`}
        >
          {/* FIXED: Localized position */}
          {t(`player.positions.${player.position}`)}
        </span>
        <button
          onClick={() => navigate(`/roster/${player.id}`)}
          className="mt-auto w-full py-2 rounded-lg border border-[#c49b32]/30 text-[#c49b32] text-[12px] font-semibold tracking-widest uppercase hover:bg-[#c49b32]/10 transition-colors duration-200 cursor-pointer bg-transparent"
        >
          {t("roster.moreInfo")}
        </button>
      </div>
    </div>
  );
};

const StaffCard = ({ member }: { member: Staff }) => {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <div className="bg-[#12161f] border border-white/07 rounded-xl overflow-hidden flex flex-col hover:border-[#c49b32]/40 transition-colors duration-200">
      <div className="relative bg-[#0d1017] aspect-square flex items-center justify-center overflow-hidden">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            loading="lazy"
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-16 h-16 rounded-full bg-[#1a1f2e] border-2 border-white/10 flex items-center justify-center mb-2">
              <span className="text-[22px] font-black text-[#2a2f3e]">
                {member.name.charAt(0)}
              </span>
            </div>
            <div className="w-24 h-20 rounded-t-full bg-[#1a1f2e] border-2 border-b-0 border-white/10" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-[15px] font-bold text-[#f0ead8] leading-tight">
          {member.name}
        </p>
        <span className="self-start text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded border text-[#c49b32] border-[#c49b32]/40 bg-[#c49b32]/10">
          {/* This looks for 'roster.roles.Head Coach'. 
              The second argument is the fallback (the raw string) 
          */}
          {t(`roster.roles.${member.role}`, member.role)}
        </span>
      </div>
    </div>
  );
};

const Roster = () => {
  const { t } = useTranslation();
  // FIXED: Store the ID/Key of the position, not the translated label
  const [activePosition, setActivePosition] = useState("All");
  const { data: players, isLoading: loadingPlayers } = usePlayers();
  const { data: staff, isLoading: loadingStaff } = useStaff();

  const filterOptions = [
    { id: "All", label: t("roster.all") },
    { id: "Goalkeeper", label: t("player.positions.Goalkeeper") },
    { id: "Defender", label: t("player.positions.Defender") },
    { id: "Midfielder", label: t("player.positions.Midfielder") },
    { id: "Forward", label: t("player.positions.Forward") },
  ];

  const filtered = players?.filter((p) =>
    activePosition === "All" ? true : p.position === activePosition,
  );

  return (
    <>
      <PageMeta
        title="Tim"
        description="Upoznajte igrače i stručni štab FK Novo Doba Kojčinovac."
      />
      <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
        <div className="bg-[#0d1017] border-b border-white/05 px-5 pt-8 pb-6">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-1">
            {t("roster.season")}
          </p>
          <h1 className="text-[36px] font-black text-[#f5f0e8] tracking-wide leading-none">
            {t("roster.title")}
          </h1>
        </div>

        <div className="px-5 py-4 border-b border-white/05 flex gap-2 overflow-x-auto scrollbar-none">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActivePosition(opt.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase border transition-colors duration-200 cursor-pointer ${
                activePosition === opt.id
                  ? "bg-[#c49b32] text-[#0a0c10] border-[#c49b32]"
                  : "bg-transparent text-[#8a8880] border-white/10 hover:border-[#c49b32]/40 hover:text-[#f0ead8]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="px-5 py-6">
          {loadingPlayers ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : filtered && filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          ) : (
            <div className="text-[#56544e] text-sm py-12 text-center">
              {t("roster.noPlayers")}
            </div>
          )}
        </div>

        <div className="px-5 pb-10">
          <div className="border-t border-white/05 pt-6 mb-5">
            <h2 className="text-[28px] font-black text-[#f5f0e8] tracking-wide leading-none">
              {t("roster.staff")}
            </h2>
          </div>
          {loadingStaff ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : staff && staff.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {staff.map((member) => (
                <StaffCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-[#56544e] text-sm py-8 text-center">
              {t("roster.noStaff")}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Roster;
