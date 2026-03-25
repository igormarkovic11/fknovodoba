import { useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import { usePlayers, useStaff } from "../../hooks/usePlayers";
import type { Player, Staff } from "../../types";

type PlayerForm = {
  name: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  number: string;
  goals: string;
  assists: string;
  age: string;
  bio: string;
};

type StaffForm = {
  name: string;
  role: string;
};

const emptyPlayerForm: PlayerForm = {
  name: "",
  position: "Forward",
  number: "",
  goals: "0",
  assists: "0",
  age: "",
  bio: "",
};

const emptyStaffForm: StaffForm = {
  name: "",
  role: "",
};

const positionColor: Record<string, string> = {
  Goalkeeper: "text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/10",
  Defender: "text-[#3b82f6] border-[#3b82f6]/40 bg-[#3b82f6]/10",
  Midfielder: "text-[#10b981] border-[#10b981]/40 bg-[#10b981]/10",
  Forward: "text-[#ef4444] border-[#ef4444]/40 bg-[#ef4444]/10",
};

const AdminPlayers = () => {
  const {
    data: players,
    isLoading: loadingPlayers,
    refetch: refetchPlayers,
  } = usePlayers();
  const {
    data: staff,
    isLoading: loadingStaff,
    refetch: refetchStaff,
  } = useStaff();

  const [activeTab, setActiveTab] = useState<"players" | "staff">("players");
  const [playerForm, setPlayerForm] = useState<PlayerForm>(emptyPlayerForm);
  const [staffForm, setStaffForm] = useState<StaffForm>(emptyStaffForm);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const inputClass =
    "bg-[#0d1017] border border-white/10 rounded-lg px-4 py-3 text-[14px] text-[#f0ead8] outline-none focus:border-[#c49b32]/50 transition-colors duration-200 w-full";
  const labelClass =
    "text-[11px] font-semibold tracking-widest uppercase text-[#56544e] mb-1 block";

  const handlePlayerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setPlayerForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStaffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaffForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async (
    name: string,
    folder: string,
  ): Promise<string | undefined> => {
    if (!photoFile) return undefined;
    const photoRef = ref(
      storage,
      `${folder}/${name.toLowerCase().replace(/\s/g, "-")}-${Date.now()}`,
    );
    await uploadBytes(photoRef, photoFile);
    return getDownloadURL(photoRef);
  };

  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const photoUrl = await uploadPhoto(playerForm.name, "players");
      const data: Partial<Player> = {
        name: playerForm.name,
        position: playerForm.position,
        number: parseInt(playerForm.number),
        goals: parseInt(playerForm.goals),
        assists: parseInt(playerForm.assists),
        ...(playerForm.age && { age: parseInt(playerForm.age) }),
        ...(playerForm.bio && { bio: playerForm.bio }),
        ...(photoUrl && { photoUrl }),
      };
      if (editingPlayerId) {
        await updateDoc(doc(db, "players", editingPlayerId), data);
      } else {
        await addDoc(collection(db, "players"), data);
      }
      setPlayerForm(emptyPlayerForm);
      setEditingPlayerId(null);
      setPhotoFile(null);
      setPhotoPreview(null);
      refetchPlayers();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const photoUrl = await uploadPhoto(staffForm.name, "staff");
      const data: Partial<Staff> = {
        name: staffForm.name,
        role: staffForm.role,
        ...(photoUrl && { photoUrl }),
      };
      if (editingStaffId) {
        await updateDoc(doc(db, "staff", editingStaffId), data);
      } else {
        await addDoc(collection(db, "staff"), data);
      }
      setStaffForm(emptyStaffForm);
      setEditingStaffId(null);
      setPhotoFile(null);
      setPhotoPreview(null);
      refetchStaff();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEditPlayer = (player: Player) => {
    setPlayerForm({
      name: player.name,
      position: player.position,
      number: player.number.toString(),
      goals: player.goals.toString(),
      assists: player.assists.toString(),
      age: player.age?.toString() ?? "",
      bio: player.bio ?? "",
    });
    setEditingPlayerId(player.id);
    setPhotoPreview(player.photoUrl ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditStaff = (member: Staff) => {
    setStaffForm({
      name: member.name,
      role: member.role,
    });
    setEditingStaffId(member.id);
    setPhotoPreview(member.photoUrl ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePlayer = async (id: string) => {
    if (!confirm("Delete this player?")) return;
    await deleteDoc(doc(db, "players", id));
    refetchPlayers();
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Delete this staff member?")) return;
    await deleteDoc(doc(db, "staff", id));
    refetchStaff();
  };

  const handleCancelPlayer = () => {
    setPlayerForm(emptyPlayerForm);
    setEditingPlayerId(null);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleCancelStaff = () => {
    setStaffForm(emptyStaffForm);
    setEditingStaffId(null);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

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
        <h1 className="text-[16px] font-black text-[#f5f0e8]">
          Players & Staff
        </h1>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-5 flex gap-2">
        {(["players", "staff"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase border transition-colors cursor-pointer ${
              activeTab === tab
                ? "bg-[#c49b32] text-[#0a0c10] border-[#c49b32]"
                : "bg-transparent text-[#8a8880] border-white/10 hover:border-[#c49b32]/40"
            }`}
          >
            {tab} (
            {tab === "players" ? (players?.length ?? 0) : (staff?.length ?? 0)})
          </button>
        ))}
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto">
        {/* ── PLAYERS TAB ── */}
        {activeTab === "players" && (
          <>
            {/* Player form */}
            <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 mb-8">
              <h2 className="text-[14px] font-black text-[#f0ead8] mb-5">
                {editingPlayerId ? "Edit Player" : "Add Player"}
              </h2>
              <form
                onSubmit={handlePlayerSubmit}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      name="name"
                      value={playerForm.name}
                      onChange={handlePlayerChange}
                      placeholder="Marko Nikolić"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Jersey Number</label>
                    <input
                      type="number"
                      name="number"
                      value={playerForm.number}
                      onChange={handlePlayerChange}
                      placeholder="9"
                      required
                      min="1"
                      max="99"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Position</label>
                    <select
                      name="position"
                      value={playerForm.position}
                      onChange={handlePlayerChange}
                      className={inputClass}
                    >
                      <option value="Goalkeeper">Goalkeeper</option>
                      <option value="Defender">Defender</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Forward">Forward</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={playerForm.age}
                      onChange={handlePlayerChange}
                      placeholder="24"
                      min="15"
                      max="50"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Goals</label>
                    <input
                      type="number"
                      name="goals"
                      value={playerForm.goals}
                      onChange={handlePlayerChange}
                      min="0"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Assists</label>
                    <input
                      type="number"
                      name="assists"
                      value={playerForm.assists}
                      onChange={handlePlayerChange}
                      min="0"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Bio (optional)</label>
                  <textarea
                    name="bio"
                    value={playerForm.bio}
                    onChange={handlePlayerChange}
                    placeholder="Short player biography..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Photo upload */}
                <div>
                  <label className={labelClass}>Player Photo (optional)</label>
                  <div className="flex items-center gap-4">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-[#0d1017] border border-white/10 flex items-center justify-center text-[#3a3830] text-[10px] shrink-0">
                        Photo
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="text-[13px] text-[#8a8880] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0d1017] file:text-[#c49b32] file:text-[11px] file:font-semibold file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-[#c49b32]/10"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 rounded-lg bg-[#c49b32] text-[#0a0c10] text-[13px] font-black tracking-widest uppercase hover:bg-[#d4aa3f] transition-colors cursor-pointer border-none disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingPlayerId
                        ? "Update Player"
                        : "Add Player"}
                  </button>
                  {editingPlayerId && (
                    <button
                      type="button"
                      onClick={handleCancelPlayer}
                      className="px-6 py-3 rounded-lg border border-white/10 text-[#8a8880] text-[13px] font-semibold hover:border-white/20 hover:text-[#f0ead8] transition-colors cursor-pointer bg-transparent"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Players list */}
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
              Squad ({players?.length ?? 0})
            </p>
            <div className="flex flex-col gap-3">
              {loadingPlayers ? (
                <div className="text-[#56544e] text-sm text-center py-8">
                  Loading...
                </div>
              ) : players && players.length > 0 ? (
                players.map((player) => (
                  <div
                    key={player.id}
                    className="bg-[#12161f] border border-white/07 rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    {/* Photo or number */}
                    {player.photoUrl ? (
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#c49b32] flex items-center justify-center shrink-0">
                        <span className="text-[13px] font-black text-[#0a0c10]">
                          {player.number}
                        </span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-bold text-[#f0ead8]">
                          {player.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${positionColor[player.position]}`}
                        >
                          {player.position}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#56544e]">
                        #{player.number} · {player.goals}G {player.assists}A
                      </span>
                    </div>

                    <button
                      onClick={() => handleEditPlayer(player)}
                      className="text-[11px] font-semibold uppercase tracking-widest text-[#8a8880] hover:text-[#c49b32] transition-colors cursor-pointer bg-transparent border-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlayer(player.id)}
                      className="text-[11px] font-semibold uppercase tracking-widest text-[#56544e] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-[#56544e] text-sm text-center py-8">
                  No players yet.
                </div>
              )}
            </div>
          </>
        )}

        {/* ── STAFF TAB ── */}
        {activeTab === "staff" && (
          <>
            {/* Staff form */}
            <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 mb-8">
              <h2 className="text-[14px] font-black text-[#f0ead8] mb-5">
                {editingStaffId ? "Edit Staff Member" : "Add Staff Member"}
              </h2>
              <form
                onSubmit={handleStaffSubmit}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      name="name"
                      value={staffForm.name}
                      onChange={handleStaffChange}
                      placeholder="Dragan Petrović"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Role</label>
                    <input
                      name="role"
                      value={staffForm.role}
                      onChange={handleStaffChange}
                      placeholder="Head Coach"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Photo upload */}
                <div>
                  <label className={labelClass}>Photo (optional)</label>
                  <div className="flex items-center gap-4">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-[#0d1017] border border-white/10 flex items-center justify-center text-[#3a3830] text-[10px] shrink-0">
                        Photo
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="text-[13px] text-[#8a8880] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0d1017] file:text-[#c49b32] file:text-[11px] file:font-semibold file:uppercase file:tracking-widest file:cursor-pointer hover:file:bg-[#c49b32]/10"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 rounded-lg bg-[#c49b32] text-[#0a0c10] text-[13px] font-black tracking-widest uppercase hover:bg-[#d4aa3f] transition-colors cursor-pointer border-none disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingStaffId
                        ? "Update Staff"
                        : "Add Staff"}
                  </button>
                  {editingStaffId && (
                    <button
                      type="button"
                      onClick={handleCancelStaff}
                      className="px-6 py-3 rounded-lg border border-white/10 text-[#8a8880] text-[13px] font-semibold hover:border-white/20 hover:text-[#f0ead8] transition-colors cursor-pointer bg-transparent"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Staff list */}
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
              Staff ({staff?.length ?? 0})
            </p>
            <div className="flex flex-col gap-3">
              {loadingStaff ? (
                <div className="text-[#56544e] text-sm text-center py-8">
                  Loading...
                </div>
              ) : staff && staff.length > 0 ? (
                staff.map((member) => (
                  <div
                    key={member.id}
                    className="bg-[#12161f] border border-white/07 rounded-xl px-4 py-3 flex items-center gap-3"
                  >
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#1a1f2e] border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[14px] font-black text-[#3a3830]">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#f0ead8]">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-[#56544e]">
                        {member.role}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditStaff(member)}
                      className="text-[11px] font-semibold uppercase tracking-widest text-[#8a8880] hover:text-[#c49b32] transition-colors cursor-pointer bg-transparent border-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      className="text-[11px] font-semibold uppercase tracking-widest text-[#56544e] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-[#56544e] text-sm text-center py-8">
                  No staff yet.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPlayers;
