import { useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useStandings, useSeasons } from "../../hooks/useStandings";
import type { Standing } from "../../types";

type StandingForm = {
  team: string;
  played: string;
  won: string;
  drawn: string;
  lost: string;
  goalsFor: string;
  goalsAgainst: string;
  points: string;
};

const emptyForm: StandingForm = {
  team: "",
  played: "",
  won: "",
  drawn: "",
  lost: "",
  goalsFor: "",
  goalsAgainst: "",
  points: "",
};

const AdminStandings = () => {
  const [activeSeason, setActiveSeason] = useState("2025-26");
  const [newSeason, setNewSeason] = useState("");
  const [form, setForm] = useState<StandingForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: seasons, refetch: refetchSeasons } = useSeasons();
  const { data: standings, isLoading, refetch } = useStandings(activeSeason);

  const inputClass =
    "bg-[#0d1017] border border-white/10 rounded-lg px-4 py-3 text-[14px] text-[#f0ead8] outline-none focus:border-[#c49b32]/50 transition-colors duration-200 w-full";
  const labelClass =
    "text-[11px] font-semibold tracking-widest uppercase text-[#56544e] mb-1 block";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data: Partial<Standing> = {
        team: form.team,
        played: parseInt(form.played),
        won: parseInt(form.won),
        drawn: parseInt(form.drawn),
        lost: parseInt(form.lost),
        goalsFor: parseInt(form.goalsFor),
        goalsAgainst: parseInt(form.goalsAgainst),
        points: parseInt(form.points),
      };
      if (editingId) {
        await updateDoc(
          doc(db, "standings", activeSeason, "teams", editingId),
          data,
        );
      } else {
        await addDoc(collection(db, "standings", activeSeason, "teams"), data);
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

  const handleEdit = (standing: Standing) => {
    setForm({
      team: standing.team,
      played: standing.played.toString(),
      won: standing.won.toString(),
      drawn: standing.drawn.toString(),
      lost: standing.lost.toString(),
      goalsFor: standing.goalsFor.toString(),
      goalsAgainst: standing.goalsAgainst.toString(),
      points: standing.points.toString(),
    });
    setEditingId(standing.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team from standings?")) return;
    await deleteDoc(doc(db, "standings", activeSeason, "teams", id));
    refetch();
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleAddSeason = async () => {
    if (!newSeason.trim()) return;
    try {
      // Create the season document with a dummy field so it exists in Firestore
      await setDoc(doc(db, "standings", newSeason.trim()), { created: true });
      setActiveSeason(newSeason.trim());
      setNewSeason("");
      refetchSeasons();
    } catch (err) {
      console.error(err);
    }
  };

  const gd = (s: Standing) => s.goalsFor - s.goalsAgainst;

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
        <h1 className="text-[16px] font-black text-[#f5f0e8]">Standings</h1>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto">
        {/* Season selector + add new season */}
        <div className="mb-6">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-3">
            Season
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {seasons?.map((season) => (
              <button
                key={season}
                onClick={() => setActiveSeason(season)}
                className={`px-4 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase border transition-colors cursor-pointer ${
                  activeSeason === season
                    ? "bg-[#c49b32] text-[#0a0c10] border-[#c49b32]"
                    : "bg-transparent text-[#8a8880] border-white/10 hover:border-[#c49b32]/40"
                }`}
              >
                {season}
              </button>
            ))}
          </div>

          {/* Add new season */}
          <div className="flex gap-2">
            <input
              value={newSeason}
              onChange={(e) => setNewSeason(e.target.value)}
              placeholder="e.g. 2026-27"
              className="bg-[#0d1017] border border-white/10 rounded-lg px-4 py-2 text-[13px] text-[#f0ead8] outline-none focus:border-[#c49b32]/50 transition-colors flex-1"
            />
            <button
              onClick={handleAddSeason}
              className="px-4 py-2 rounded-lg bg-[#12161f] border border-white/10 text-[#c49b32] text-[11px] font-semibold tracking-widest uppercase hover:border-[#c49b32]/40 transition-colors cursor-pointer"
            >
              Add Season
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 mb-8">
          <h2 className="text-[14px] font-black text-[#f0ead8] mb-1">
            {editingId ? "Edit Team" : "Add Team"}
          </h2>
          <p className="text-[11px] text-[#56544e] mb-5">
            Season: {activeSeason}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Team Name</label>
              <input
                name="team"
                value={form.team}
                onChange={handleChange}
                placeholder="FK Novo Doba"
                required
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className={labelClass}>P</label>
                <input
                  type="number"
                  name="played"
                  value={form.played}
                  onChange={handleChange}
                  min="0"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>W</label>
                <input
                  type="number"
                  name="won"
                  value={form.won}
                  onChange={handleChange}
                  min="0"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>D</label>
                <input
                  type="number"
                  name="drawn"
                  value={form.drawn}
                  onChange={handleChange}
                  min="0"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>L</label>
                <input
                  type="number"
                  name="lost"
                  value={form.lost}
                  onChange={handleChange}
                  min="0"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>GF</label>
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
                <label className={labelClass}>GA</label>
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
              <div>
                <label className={labelClass}>Pts</label>
                <input
                  type="number"
                  name="points"
                  value={form.points}
                  onChange={handleChange}
                  min="0"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 rounded-lg bg-[#c49b32] text-[#0a0c10] text-[13px] font-black tracking-widest uppercase hover:bg-[#d4aa3f] transition-colors cursor-pointer border-none disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update Team" : "Add Team"}
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

        {/* Standings list */}
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
          Table — {activeSeason} ({standings?.length ?? 0} teams)
        </p>

        <div className="bg-[#12161f] border border-white/07 rounded-xl overflow-hidden mb-4">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0d1017]">
                <th className="py-2 pl-4 pr-2 text-left">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                    #
                  </span>
                </th>
                <th className="py-2 px-2 text-left">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                    Team
                  </span>
                </th>
                <th className="py-2 px-2 text-center">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                    P
                  </span>
                </th>
                <th className="py-2 px-2 text-center">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                    W
                  </span>
                </th>
                <th className="py-2 px-2 text-center">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                    D
                  </span>
                </th>
                <th className="py-2 px-2 text-center">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                    L
                  </span>
                </th>
                <th className="py-2 px-2 text-center">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                    GD
                  </span>
                </th>
                <th className="py-2 px-2 text-center">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                    Pts
                  </span>
                </th>
                <th className="py-2 pr-4 text-right">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3a3830]">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-8 text-center text-[#56544e] text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : standings && standings.length > 0 ? (
                standings.map((standing, index) => (
                  <tr
                    key={standing.id}
                    className="border-t border-white/04 hover:bg-white/02"
                  >
                    <td className="py-2 pl-4 pr-2">
                      <span
                        className={`text-[12px] font-black ${index < 3 ? "text-[#c49b32]" : "text-[#3a3830]"}`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className="text-[12px] font-semibold text-[#8a8880]">
                        {standing.team}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="text-[12px] text-[#56544e]">
                        {standing.played}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="text-[12px] text-[#56544e]">
                        {standing.won}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="text-[12px] text-[#56544e]">
                        {standing.drawn}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="text-[12px] text-[#56544e]">
                        {standing.lost}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span
                        className={`text-[12px] font-semibold ${gd(standing) > 0 ? "text-green-400" : gd(standing) < 0 ? "text-red-400" : "text-[#56544e]"}`}
                      >
                        {gd(standing) > 0 ? `+${gd(standing)}` : gd(standing)}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="text-[13px] font-black text-[#c49b32]">
                        {standing.points}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(standing)}
                          className="text-[11px] font-semibold uppercase tracking-widest text-[#8a8880] hover:text-[#c49b32] transition-colors cursor-pointer bg-transparent border-none"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(standing.id)}
                          className="text-[11px] font-semibold uppercase tracking-widest text-[#56544e] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="py-8 text-center text-[#56544e] text-sm"
                  >
                    No teams yet for {activeSeason}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStandings;
