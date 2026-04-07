import { useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Dodato za storage
import { db, storage } from "../../firebase/config"; // Dodat storage import
import { useNews } from "../../hooks/useNews";
import type { NewsPost } from "../../types";

type NewsForm = {
  title: string;
  excerpt: string;
  body: string;
  tag: string;
  date: string;
};

const emptyForm: NewsForm = {
  title: "",
  excerpt: "",
  body: "",
  tag: "Club News",
  date: new Date().toISOString().slice(0, 16),
};

const tags = ["Match Report", "Transfer", "Club News", "Academy", "Interview"];

const tagColors: Record<string, string> = {
  "Match Report": "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/30",
  Transfer: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30",
  "Club News": "text-[#c49b32] bg-[#c49b32]/10 border-[#c49b32]/30",
  Academy: "text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/30",
  Interview: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30",
};

const AdminNews = () => {
  const { data: news, refetch } = useNews(100);
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // State za sliku (kopirano iz AdminPlayers)
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handler za biranje fajla
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // Upload funkcija na Firebase Storage
  const uploadPhoto = async (title: string): Promise<string | undefined> => {
    if (!photoFile) return undefined;
    const photoRef = ref(
      storage,
      `news/${title.toLowerCase().replace(/\s/g, "-")}-${Date.now()}`,
    );
    await uploadBytes(photoRef, photoFile);
    return getDownloadURL(photoRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Prvo upload-uj sliku ako je izabrana
      const coverImage = await uploadPhoto(form.title);

      const data: Partial<NewsPost> = {
        title: form.title,
        excerpt: form.excerpt,
        body: form.body,
        tag: form.tag,
        date: form.date,
        ...(coverImage && { coverImage }), // Čuvamo URL slike u bazu
      };

      if (editingId) {
        await updateDoc(doc(db, "news", editingId), data);
      } else {
        await addDoc(collection(db, "news"), data);
      }

      handleCancel(); // Resetuje sve
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: NewsPost) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt ?? "",
      body: post.body,
      tag: post.tag,
      date: post.date.slice(0, 16),
    });
    setEditingId(post.id);
    setPhotoPreview(post.coverImage ?? null); // Prikaži staru sliku u preview
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await deleteDoc(doc(db, "news", id));
    refetch();
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const inputClass =
    "bg-[#0d1017] border border-white/10 rounded-lg px-4 py-3 text-[14px] text-[#f0ead8] outline-none focus:border-[#c49b32]/50 transition-colors duration-200 w-full";
  const labelClass =
    "text-[11px] font-semibold tracking-widest uppercase text-[#56544e] mb-1 block";

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      <div className="bg-[#0d1017] border-b border-white/05 px-5 py-4 flex items-center gap-3">
        <Link
          to="/admin/dashboard"
          className="text-[#56544e] hover:text-[#c49b32] transition-colors no-underline text-[13px]"
        >
          ← Dashboard
        </Link>
        <span className="text-[#3a3830]">/</span>
        <h1 className="text-[16px] font-black text-[#f5f0e8]">News</h1>
      </div>

      <div className="px-5 py-6 max-w-2xl mx-auto">
        <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 mb-8">
          <h2 className="text-[14px] font-black text-[#f0ead8] mb-5">
            {editingId ? "Edit Post" : "New Post"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Match report vs FK Mladost..."
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Excerpt</label>
              <input
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Short summary..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Body</label>
              <textarea
                name="body"
                value={form.body}
                onChange={handleChange}
                placeholder="Full content..."
                required
                rows={8}
                className={`${inputClass} resize-none leading-relaxed`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tag</label>
                <select
                  name="tag"
                  value={form.tag}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Photo upload - ISTO KAO KOD IGRAČA */}
            <div>
              <label className={labelClass}>Cover Photo</label>
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-20 h-14 rounded-lg object-cover shrink-0 border border-white/10"
                  />
                ) : (
                  <div className="w-20 h-14 rounded-lg bg-[#0d1017] border border-white/10 flex items-center justify-center text-[#3a3830] text-[10px] shrink-0">
                    No Image
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
                  : editingId
                    ? "Update Post"
                    : "Publish Post"}
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

        {/* List of News - Skraćena verzija za lakši pregled */}
        <div className="flex flex-col gap-3">
          {news?.map((post) => (
            <div
              key={post.id}
              className="bg-[#12161f] border border-white/07 rounded-xl p-4 flex items-center gap-4"
            >
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  className="w-16 h-12 rounded object-cover"
                  alt=""
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-bold text-[#f0ead8] truncate">
                  {post.title}
                </h3>
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${tagColors[post.tag]}`}
                >
                  {post.tag}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(post)}
                  className="text-[11px] font-semibold uppercase text-[#8a8880] hover:text-[#c49b32]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-[11px] font-semibold uppercase text-[#56544e] hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNews;
