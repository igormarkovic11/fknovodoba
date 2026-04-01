import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useMatches } from "../../hooks/useMatches";
import { usePlayers } from "../../hooks/usePlayers";
import type { LineupPlayer } from "../../types";

const AdminLive = () => {
  const navigate = useNavigate();
  const { data: matches, refetch } = useMatches();
  const { data: players } = usePlayers();

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [starting, setStarting] = useState<LineupPlayer[]>([]);
  const [reserves, setReserves] = useState<LineupPlayer[]>([]);
  const [saving, setSaving] = useState(false);

  const upcomingAndLive =
    matches
      ?.filter((m) => m.status === "upcoming" || m.status === "live")
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ) ?? [];

  const selectedMatch = matches?.find((m) => m.id === selectedMatchId);

  const toggleStarting = (player: LineupPlayer) => {
    const exists = starting.find((p) => p.playerId === player.playerId);
    if (exists) {
      setStarting((prev) => prev.filter((p) => p.playerId !== player.playerId));
    } else if (starting.length < 11) {
      setStarting((prev) => [...prev, player]);
      setReserves((prev) => prev.filter((p) => p.playerId !== player.playerId));
    }
  };

  const toggleReserve = (player: LineupPlayer) => {
    const exists = reserves.find((p) => p.playerId === player.playerId);
    if (exists) {
      setReserves((prev) => prev.filter((p) => p.playerId !== player.playerId));
    } else {
      setReserves((prev) => [...prev, player]);
      setStarting((prev) => prev.filter((p) => p.playerId !== player.playerId));
    }
  };

  const handleStartMatch = async () => {
    if (!selectedMatchId) return;
    setSaving(true);
    try {
      // Save lineup
      await setDoc(doc(db, "matches", selectedMatchId, "lineup", "data"), {
        starting,
        reserves,
      });
      // Set match to live
      await updateDoc(doc(db, "matches", selectedMatchId), {
        status: "live",
        scoreHome: 0,
        scoreAway: 0,
      });
      refetch();
      navigate(`/admin/commentary/${selectedMatchId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Europe/Sarajevo",
    });

  //const inputClass =
  //"bg-[#0d1017] border border-white/10 rounded-lg px-4 py-3 text-[14px] text-[#f0ead8] outline-none focus:border-[#c49b32]/50 transition-colors duration-200 w-full";

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      {/* Header */}
      <div className="bg-[#0d1017] border-b border-white/05 px-5 py-4 flex items-center gap-3">
        <Link
          to="/admin/dashboard"
          className="text-[#56544e] hover:text-[#c49b32] transition-colors no-underline text-[13px]"
        >
          ← Dashboard
        </Link>
        <span className="text-[#3a3830]">/</span>
        <h1 className="text-[16px] font-black text-[#f5f0e8]">Live Match</h1>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto">
        {/* Select match */}
        <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 mb-6">
          <h2 className="text-[14px] font-black text-[#f0ead8] mb-4">
            Select Match
          </h2>
          <div className="flex flex-col gap-3">
            {upcomingAndLive.length === 0 ? (
              <p className="text-[#56544e] text-sm">
                No upcoming matches. Add one first.
              </p>
            ) : (
              upcomingAndLive.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatchId(match.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors duration-200 ${
                    selectedMatchId === match.id
                      ? "border-[#c49b32] bg-[#c49b32]/05"
                      : "border-white/07 hover:border-[#c49b32]/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#f0ead8]">
                      vs {match.opponent}
                    </span>
                    {match.status === "live" && (
                      <span className="text-[9px] font-black tracking-widest uppercase bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#56544e]">
                    {formatDate(match.date)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lineup selector */}
        {selectedMatchId && players && (
          <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 mb-6">
            <h2 className="text-[14px] font-black text-[#f0ead8] mb-1">
              Set Lineup
            </h2>
            <p className="text-[11px] text-[#56544e] mb-4">
              Starting: {starting.length}/11 · Reserves: {reserves.length}
            </p>

            <div className="flex flex-col gap-2">
              {players.map((player) => {
                const lp: LineupPlayer = {
                  playerId: player.id,
                  name: player.name,
                  number: player.number,
                  position: player.position,
                };
                const isStarting = starting.find(
                  (p) => p.playerId === player.id,
                );
                const isReserve = reserves.find(
                  (p) => p.playerId === player.id,
                );

                return (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#0d1017] border border-white/05"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#c49b32] flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-black text-[#0a0c10]">
                        {player.number}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#f0ead8]">
                        {player.name}
                      </p>
                      <p className="text-[11px] text-[#56544e]">
                        {player.position}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStarting(lp)}
                        className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isStarting
                            ? "bg-[#c49b32] text-[#0a0c10] border-[#c49b32]"
                            : "bg-transparent text-[#8a8880] border-white/10 hover:border-[#c49b32]/40"
                        }`}
                      >
                        Start
                      </button>
                      <button
                        onClick={() => toggleReserve(lp)}
                        className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isReserve
                            ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                            : "bg-transparent text-[#8a8880] border-white/10 hover:border-[#3b82f6]/40"
                        }`}
                      >
                        Sub
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Start match button */}
        {selectedMatchId && (
          <button
            onClick={handleStartMatch}
            disabled={saving || starting.length === 0}
            className="w-full py-4 rounded-xl bg-red-500 text-white text-[14px] font-black tracking-widest uppercase hover:bg-red-600 transition-colors cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? "Starting..."
              : selectedMatch?.status === "live"
                ? "Continue Commentary →"
                : "🔴 Start Live Match"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLive;
