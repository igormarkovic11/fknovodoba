import { useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useMatches } from "../../hooks/useMatches";
import type { Match } from "../../types";

type MatchForm = {
  opponent: string;
  competition: string;
  date: string;
  homeAway: "home" | "away";
  venue: string;
  status: "upcoming" | "played" | "live";
  goalsFor: string;
  goalsAgainst: string;
};

const emptyForm: MatchForm = {
  opponent: "",
  competition: "Prva Opštinska Liga",
  date: "",
  homeAway: "home",
  venue: "Stadion Kojčinovac",
  status: "upcoming",
  goalsFor: "",
  goalsAgainst: "",
};

const AdminMatches = () => {
  const { data: matches, isLoading, refetch } = useMatches();
  const [form, setForm] = useState<MatchForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "played">("upcoming");

  const upcoming = [
    ...(matches?.filter((m) => m.status === "upcoming") ?? []),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const played = matches?.filter((m) => m.status === "played") ?? [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data: Partial<Match> = {
        opponent: form.opponent,
        competition: form.competition,
        date: form.date,
        homeAway: form.homeAway,
        venue: form.venue,
        status: form.status,
      };
      if (form.status === "played") {
        data.goalsFor = parseInt(form.goalsFor);
        data.goalsAgainst = parseInt(form.goalsAgainst);
      }
      if (editingId) {
        await updateDoc(doc(db, "matches", editingId), data);
      } else {
        await addDoc(collection(db, "matches"), data);
      }
      setForm(emptyForm);
      setEditingId(null);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (match: Match) => {
    setForm({
      opponent: match.opponent,
      competition: match.competition,
      date: match.date,
      homeAway: match.homeAway,
      venue: match.venue,
      status: match.status,
      goalsFor: match.goalsFor?.toString() ?? "",
      goalsAgainst: match.goalsAgainst?.toString() ?? "",
    });
    setEditingId(match.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this match?")) return;
    await deleteDoc(doc(db, "matches", id));
    refetch();
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Europe/Sarajevo",
    });

  const inputClass =
    "bg-[#0d1017] border border-white/10 rounded-lg px-4 py-3 text-[14px] text-[#f0ead8] outline-none focus:border-[#c49b32]/50 transition-colors duration-200 w-full";
  const labelClass =
    "text-[11px] font-semibold tracking-widest uppercase text-[#56544e] mb-1 block";

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      {/* Header */}
      <div className="bg-[#0d1017] border-b border-white/05 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="text-[#56544e] hover:text-[#c49b32] transition-colors no-underline text-[13px]"
          >
            ← Dashboard
          </Link>
          <span className="text-[#3a3830]">/</span>
          <h1 className="text-[16px] font-black text-[#f5f0e8]">Matches</h1>
        </div>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto">
        {/* Form */}
        <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 mb-8">
          <h2 className="text-[14px] font-black text-[#f0ead8] mb-5">
            {editingId ? "Edit Match" : "Add Match"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Opponent</label>
                <input
                  name="opponent"
                  value={form.opponent}
                  onChange={handleChange}
                  placeholder="FK Mladost"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Competition</label>
                <input
                  name="competition"
                  value={form.competition}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date & Time</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Venue</label>
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Home / Away</label>
                <select
                  name="homeAway"
                  value={form.homeAway}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="home">Home</option>
                  <option value="away">Away</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="played">Played</option>
                </select>
              </div>
            </div>

            {/* Score — only show if played */}
            {form.status === "played" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Goals For</label>
                  <input
                    type="number"
                    name="goalsFor"
                    value={form.goalsFor}
                    onChange={handleChange}
                    min="0"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Goals Against</label>
                  <input
                    type="number"
                    name="goalsAgainst"
                    value={form.goalsAgainst}
                    onChange={handleChange}
                    min="0"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-lg bg-[#c49b32] text-[#0a0c10] text-[13px] font-black tracking-widest uppercase hover:bg-[#d4aa3f] transition-colors cursor-pointer border-none disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Match"
                    : "Add Match"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-lg border border-white/10 text-[#8a8880] text-[13px] font-semibold hover:border-white/20 hover:text-[#f0ead8] transition-colors cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["upcoming", "played"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase border transition-colors cursor-pointer ${
                activeTab === tab
                  ? "bg-[#c49b32] text-[#0a0c10] border-[#c49b32]"
                  : "bg-transparent text-[#8a8880] border-white/10 hover:border-[#c49b32]/40"
              }`}
            >
              {tab} ({tab === "upcoming" ? upcoming.length : played.length})
            </button>
          ))}
        </div>

        {/* Match list */}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="text-[#56544e] text-sm text-center py-8">
              Loading...
            </div>
          ) : (activeTab === "upcoming" ? upcoming : played).length === 0 ? (
            <div className="text-[#56544e] text-sm text-center py-8">
              No matches yet.
            </div>
          ) : (
            (activeTab === "upcoming" ? upcoming : played).map((match) => (
              <div
                key={match.id}
                className="bg-[#12161f] border border-white/07 rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-bold text-[#f0ead8]">
                      {match.homeAway === "home" ? "vs" : "@"} {match.opponent}
                    </span>
                    {match.status === "played" && (
                      <span className="text-[12px] font-black text-[#c49b32]">
                        {match.goalsFor}:{match.goalsAgainst}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#56544e]">
                    {formatDate(match.date)}
                  </span>
                </div>
                <button
                  onClick={() => handleEdit(match)}
                  className="text-[11px] font-semibold uppercase tracking-widest text-[#8a8880] hover:text-[#c49b32] transition-colors cursor-pointer bg-transparent border-none"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(match.id)}
                  className="text-[11px] font-semibold uppercase tracking-widest text-[#56544e] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMatches;
