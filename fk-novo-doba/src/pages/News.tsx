import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNews } from "../hooks/useNews";
import type { NewsPost } from "../types";

const tagColors: Record<string, string> = {
  "Match Report": "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/30",
  Transfer: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30",
  "Club News": "text-[#c49b32] bg-[#c49b32]/10 border-[#c49b32]/30",
  Academy: "text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/30",
  Interview: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30",
};

const tagKeys = [
  "All",
  "Match Report",
  "Transfer",
  "Club News",
  "Academy",
  "Interview",
] as const;

const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-[#12161f] animate-pulse rounded-xl ${className}`} />
);

type TagKey = (typeof tagKeys)[number];

const NewsCard = ({ post }: { post: NewsPost }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const locale = i18n.language === "sr" ? "sr-RS" : "en-GB";
  const date = new Date(post.date).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Sarajevo",
  });

  return (
    <div className="bg-[#12161f] border border-white/07 rounded-xl overflow-hidden hover:border-[#c49b32]/30 transition-colors duration-200 flex flex-col h-full">
      {/* IZMENA: Uklonjen h-44, dodat aspect-video (16:9) */}
      <div className="w-full aspect-video bg-[#0d1017] overflow-hidden flex-shrink-0">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-[#2a2f3e] text-center">
              <div className="text-[32px] font-black leading-none">FK</div>
              <div className="text-[11px] tracking-widest uppercase mt-1">
                Novo Doba
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded border ${tagColors[post.tag] ?? "text-[#8a8880] bg-white/05 border-white/10"}`}
          >
            {t(`news.tags.${post.tag}`)}
          </span>
          <span className="text-[11px] text-[#56544e]">{date}</span>
        </div>
        <h3 className="text-[15px] font-bold text-[#f0ead8] leading-snug">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-[13px] text-[#56544e] leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <button
          onClick={() => navigate(`/news/${post.id}`)}
          className="mt-1 w-full py-2 rounded-lg border border-[#c49b32]/30 text-[#c49b32] text-[12px] font-semibold tracking-widest uppercase hover:bg-[#c49b32]/10 transition-colors duration-200 cursor-pointer bg-transparent"
        >
          {t("news.readMore")}
        </button>
      </div>
    </div>
  );
};

const News = () => {
  const { t } = useTranslation();
  const [activeTag, setActiveTag] = useState<TagKey>("All");
  const { data: news, isLoading } = useNews(50);

  const filtered = news?.filter((post) =>
    activeTag === "All" ? true : post.tag === activeTag,
  );

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      <div className="bg-[#0d1017] border-b border-white/05 px-5 pt-8 pb-6">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-1">
          FK Novo Doba
        </p>
        <h1 className="text-[36px] font-black text-[#f5f0e8] tracking-wide leading-none">
          {t("news.title")}
        </h1>
      </div>
      <div className="px-5 py-4 border-b border-white/05 flex gap-2 overflow-x-auto scrollbar-none">
        {tagKeys.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase border transition-colors duration-200 cursor-pointer ${
              activeTag === tag
                ? "bg-[#c49b32] text-[#0a0c10] border-[#c49b32]"
                : "bg-transparent text-[#8a8880] border-white/10 hover:border-[#c49b32]/40 hover:text-[#f0ead8]"
            }`}
          >
            {t(`news.tags.${tag}`)}
          </button>
        ))}
      </div>
      <div className="px-5 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-[#56544e] text-sm py-12 text-center">
            {t("news.noNews")}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
