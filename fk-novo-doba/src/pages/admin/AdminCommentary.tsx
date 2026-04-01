import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  useLiveMatch,
  useCommentary,
  useLineup,
} from "../../hooks/useCommentary";
import { formatCommentary, getEmoji } from "../../utils/commentaryFormatter";
import type { CommentaryEvent } from "../../types";

type EventType = CommentaryEvent["type"];

const eventTypes: { type: EventType; label: string }[] = [
  { type: "goal", label: "⚽ Goal" },
  { type: "yellow_card", label: "🟨 Yellow Card" },
  { type: "red_card", label: "🟥 Red Card" },
  { type: "substitution", label: "🔄 Substitution" },
  { type: "halftime", label: "🔔 Half Time" },
  { type: "fulltime", label: "🏁 Full Time" },
  { type: "comment", label: "💬 Comment" },
];

const AdminCommentary = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { match } = useLiveMatch(matchId ?? "");
  const { events } = useCommentary(matchId ?? "");
  const { lineup } = useLineup(matchId ?? "");

  const [eventType, setEventType] = useState<EventType>("comment");
  const [minute, setMinute] = useState("");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [scoreHome, setScoreHome] = useState(match?.scoreHome ?? 0);
  const [scoreAway, setScoreAway] = useState(match?.scoreAway ?? 0);

  const handlePreview = () => {
    const formatted = formatCommentary(eventType, parseInt(minute) || 0, text);
    setPreview(formatted);
  };

  const handlePublish = async () => {
    if (!matchId || !text.trim()) return;
    setSaving(true);
    try {
      const formatted = formatCommentary(
        eventType,
        parseInt(minute) || 0,
        text,
      );
      await addDoc(collection(db, "matches", matchId, "commentary"), {
        minute: parseInt(minute) || 0,
        type: eventType,
        text: formatted,
        createdAt: Date.now(),
      });

      // If fulltime, end the match
      if (eventType === "fulltime") {
        await updateDoc(doc(db, "matches", matchId), {
          status: "played",
          goalsFor: scoreHome,
          goalsAgainst: scoreAway,
          scoreHome,
          scoreAway,
        });
      }

      setText("");
      setPreview("");
      if (eventType !== "halftime" && eventType !== "fulltime") {
        setMinute((prev) => String(parseInt(prev || "0") + 1));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateScore = async () => {
    if (!matchId) return;
    await updateDoc(doc(db, "matches", matchId), { scoreHome, scoreAway });
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!matchId || !confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "matches", matchId, "commentary", eventId));
  };

  const inputClass =
    "bg-[#0d1017] border border-white/10 rounded-lg px-4 py-3 text-[14px] text-[#f0ead8] outline-none focus:border-[#c49b32]/50 transition-colors duration-200 w-full";

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      {/* Header */}
      <div className="bg-[#0d1017] border-b border-white/05 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/live"
            className="text-[#56544e] hover:text-[#c49b32] transition-colors no-underline text-[13px]"
          >
            ← Live
          </Link>
          <span className="text-[#3a3830]">/</span>
          <h1 className="text-[16px] font-black text-[#f5f0e8]">Commentary</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black tracking-widest uppercase bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
            LIVE
          </span>
          <span className="text-[13px] font-bold text-[#f0ead8]">
            vs {match?.opponent}
          </span>
        </div>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto">
        {/* Score updater */}
        <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 mb-6">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
            Score
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 text-center">
              <p className="text-[12px] text-[#56544e] mb-2">FK Novo Doba</p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setScoreHome(Math.max(0, scoreHome - 1))}
                  className="w-8 h-8 rounded-lg bg-[#0d1017] border border-white/10 text-[#f0ead8] text-lg cursor-pointer hover:border-[#c49b32]/40 transition-colors"
                >
                  -
                </button>
                <span className="text-[36px] font-black text-[#f5f0e8] w-12 text-center">
                  {scoreHome}
                </span>
                <button
                  onClick={() => setScoreHome(scoreHome + 1)}
                  className="w-8 h-8 rounded-lg bg-[#0d1017] border border-white/10 text-[#f0ead8] text-lg cursor-pointer hover:border-[#c49b32]/40 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <span className="text-[24px] font-black text-[#3a3830]">:</span>
            <div className="flex-1 text-center">
              <p className="text-[12px] text-[#56544e] mb-2">
                {match?.opponent}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setScoreAway(Math.max(0, scoreAway - 1))}
                  className="w-8 h-8 rounded-lg bg-[#0d1017] border border-white/10 text-[#f0ead8] text-lg cursor-pointer hover:border-[#c49b32]/40 transition-colors"
                >
                  -
                </button>
                <span className="text-[36px] font-black text-[#f5f0e8] w-12 text-center">
                  {scoreAway}
                </span>
                <button
                  onClick={() => setScoreAway(scoreAway + 1)}
                  className="w-8 h-8 rounded-lg bg-[#0d1017] border border-white/10 text-[#f0ead8] text-lg cursor-pointer hover:border-[#c49b32]/40 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleUpdateScore}
            className="mt-4 w-full py-2 rounded-lg border border-[#c49b32]/30 text-[#c49b32] text-[12px] font-semibold tracking-widest uppercase hover:bg-[#c49b32]/10 transition-colors cursor-pointer bg-transparent"
          >
            Update Score
          </button>
        </div>

        {/* Add event form */}
        <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 mb-6">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
            Add Event
          </p>

          {/* Event type */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {eventTypes.map((et) => (
              <button
                key={et.type}
                onClick={() => setEventType(et.type)}
                className={`py-2 px-3 rounded-lg text-[12px] font-semibold border transition-colors cursor-pointer text-left ${
                  eventType === et.type
                    ? "bg-[#c49b32]/15 border-[#c49b32]/50 text-[#c49b32]"
                    : "bg-transparent border-white/10 text-[#8a8880] hover:border-[#c49b32]/30"
                }`}
              >
                {et.label}
              </button>
            ))}
          </div>

          {/* Minute + text */}
          <div className="flex gap-3 mb-3">
            <div className="w-20 shrink-0">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-[#56544e] mb-1 block">
                Min
              </label>
              <input
                type="number"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                placeholder="45"
                min="1"
                max="120"
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-semibold tracking-widests uppercase text-[#56544e] mb-1 block">
                Description
              </label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Marko Nikolić scores from close range!"
                className={inputClass}
              />
            </div>
          </div>

          {/* Quick player buttons */}
          {lineup && lineup.starting.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] text-[#3a3830] uppercase tracking-widest mb-2">
                Quick insert player
              </p>
              <div className="flex flex-wrap gap-1.5">
                {lineup.starting.map((p) => (
                  <button
                    key={p.playerId}
                    onClick={() =>
                      setText((prev) => prev + (prev ? " " : "") + p.name)
                    }
                    className="text-[10px] font-semibold px-2 py-1 rounded border border-white/10 text-[#8a8880] hover:border-[#c49b32]/40 hover:text-[#c49b32] transition-colors cursor-pointer bg-transparent"
                  >
                    {p.number} {p.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="bg-[#0d1017] border border-[#c49b32]/20 rounded-lg px-4 py-3 mb-3">
              <p className="text-[12px] text-[#56544e] mb-1">Preview:</p>
              <p className="text-[14px] text-[#f0ead8]">{preview}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              className="px-4 py-3 rounded-lg border border-white/10 text-[#8a8880] text-[12px] font-semibold tracking-widests uppercase hover:border-[#c49b32]/40 hover:text-[#f0ead8] transition-colors cursor-pointer bg-transparent"
            >
              Preview
            </button>
            <button
              onClick={handlePublish}
              disabled={saving || !text.trim()}
              className="flex-1 py-3 rounded-lg bg-[#c49b32] text-[#0a0c10] text-[13px] font-black tracking-widests uppercase hover:bg-[#d4aa3f] transition-colors cursor-pointer border-none disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Publish →"}
            </button>
          </div>
        </div>

        {/* Live feed */}
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
          Live Feed ({events.length} events)
        </p>
        <div className="flex flex-col gap-2">
          {events.length === 0 ? (
            <div className="text-[#56544e] text-sm text-center py-8">
              No events yet. Add the first one!
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-[#12161f] border border-white/07 rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <span className="text-[18px] shrink-0">
                  {getEmoji(event.type)}
                </span>
                <p className="flex-1 text-[13px] text-[#f0ead8]">
                  {event.text}
                </p>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-[11px] font-semibold uppercase tracking-widests text-[#56544e] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none shrink-0"
                >
                  Del
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCommentary;
