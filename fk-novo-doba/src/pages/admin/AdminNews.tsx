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
import { useNews } from "../../hooks/useNews";
import type { NewsPost } from "../../types";

type NewsForm = {
  title: string;
  excerpt: string;
  body: string;
  tag: string;
  date: string;
  coverImage: string;
};

const emptyForm: NewsForm = {
  title: "",
  excerpt: "",
  body: "",
  tag: "Club News",
  date: new Date().toISOString().slice(0, 16),
  coverImage: "",
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
  const { data: news, isLoading, refetch } = useNews(100);
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data: Partial<NewsPost> = {
        title: form.title,
        excerpt: form.excerpt,
        body: form.body,
        tag: form.tag,
        date: form.date,
        ...(form.coverImage && { coverImage: form.coverImage }),
      };
      if (editingId) {
        await updateDoc(doc(db, "news", editingId), data);
      } else {
        await addDoc(collection(db, "news"), data);
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

  const handleEdit = (post: NewsPost) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt ?? "",
      body: post.body,
      tag: post.tag,
      date: post.date.slice(0, 16),
      coverImage: post.coverImage ?? "",
    });
    setEditingId(post.id);
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
        {/* Form */}
        <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 mb-8">
          <h2 className="text-[14px] font-black text-[#f0ead8] mb-5">
            {editingId ? "Edit Post" : "New Post"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Title */}
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

            {/* Excerpt */}
            <div>
              <label className={labelClass}>Excerpt</label>
              <input
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Short summary shown on news cards..."
                className={inputClass}
              />
            </div>

            {/* Body */}
            <div>
              <label className={labelClass}>Body</label>
              <textarea
                name="body"
                value={form.body}
                onChange={handleChange}
                placeholder="Full article content..."
                required
                rows={8}
                className={`${inputClass} resize-none leading-relaxed`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tag */}
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

              {/* Date */}
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

            {/* Cover image URL */}
            <div>
              <label className={labelClass}>Cover Image URL (optional)</label>
              <input
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass}
              />
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

        {/* News list */}
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
          All Posts ({news?.length ?? 0})
        </p>
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="text-[#56544e] text-sm text-center py-8">
              Loading...
            </div>
          ) : news && news.length > 0 ? (
            news.map((post) => (
              <div
                key={post.id}
                className="bg-[#12161f] border border-white/07 rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${tagColors[post.tag] ?? ""}`}
                    >
                      {post.tag}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold text-[#f0ead8] truncate">
                    {post.title}
                  </p>
                  <p className="text-[11px] text-[#56544e]">
                    {formatDate(post.date)}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(post)}
                  className="text-[11px] font-semibold uppercase tracking-widest text-[#8a8880] hover:text-[#c49b32] transition-colors cursor-pointer bg-transparent border-none shrink-0"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-[11px] font-semibold uppercase tracking-widest text-[#56544e] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none shrink-0"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="text-[#56544e] text-sm text-center py-8">
              No posts yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNews;
