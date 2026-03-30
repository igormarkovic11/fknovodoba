import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNewsPost } from "../hooks/useNews";

const tagColors: Record<string, string> = {
  "Match Report": "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/30",
  Transfer: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30",
  "Club News": "text-[#c49b32] bg-[#c49b32]/10 border-[#c49b32]/30",
  Academy: "text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/30",
  Interview: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30",
};

const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-[#12161f] animate-pulse rounded-xl ${className}`} />
);

const NewsArticle = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading } = useNewsPost(id ?? "");

  const date = post
    ? new Date(post.date).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Sarajevo",
      })
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] px-5 pt-6">
        <Skeleton className="h-6 w-24 mb-6" />
        <Skeleton className="h-56 w-full mb-6" />
        <Skeleton className="h-8 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex flex-col items-center justify-center text-[#56544e]">
        <p className="text-[18px] font-bold mb-4">{t("news.notFound")}</p>
        <button
          onClick={() => navigate("/news")}
          className="text-[#c49b32] text-sm uppercase tracking-widest border border-[#c49b32]/30 px-4 py-2 rounded-lg hover:bg-[#c49b32]/10 transition-colors cursor-pointer bg-transparent"
        >
          {t("news.backToNews")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      <div className="px-5 pt-5">
        <button
          onClick={() => navigate("/news")}
          className="text-[11px] font-semibold tracking-widest uppercase text-[#8a8880] hover:text-[#c49b32] transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
        >
          {t("news.backToNews")}
        </button>
      </div>
      <div className="mx-5 mt-4 rounded-xl overflow-hidden bg-[#0d1017] h-56 md:h-72 flex items-center justify-center">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="text-[48px] font-black text-[#2a2f3e] leading-none">
              FK
            </div>
            <div className="text-[12px] tracking-widest uppercase text-[#2a2f3e] mt-1">
              Novo Doba
            </div>
          </div>
        )}
      </div>
      <div className="px-5 mt-6 pb-12">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded border ${tagColors[post.tag] ?? "text-[#8a8880] bg-white/05 border-white/10"}`}
          >
            {post.tag}
          </span>
          <span className="text-[12px] text-[#56544e]">{date}</span>
        </div>
        <h1 className="text-[28px] md:text-[36px] font-black text-[#f5f0e8] leading-tight tracking-wide mb-4">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-[16px] text-[#8a8880] leading-relaxed font-semibold mb-6 border-l-4 border-[#c49b32]/40 pl-4">
            {post.excerpt}
          </p>
        )}
        <div className="h-px bg-white/05 mb-6" />
        <div className="text-[15px] text-[#8a8880] leading-relaxed whitespace-pre-line">
          {post.body}
        </div>
        <div className="mt-10 pt-6 border-t border-white/05 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#cc2222] to-[#1a2e8a] border border-[#c49b32]/50 flex items-center justify-center text-white text-[10px] font-bold">
              FK
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#f0ead8]">
                FK Novo Doba
              </div>
              <div className="text-[11px] text-[#56544e]">
                {t("news.about")}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/news")}
            className="text-[11px] font-semibold tracking-widests uppercase text-[#c49b32] border border-[#c49b32]/30 px-4 py-2 rounded-lg hover:bg-[#c49b32]/10 transition-colors cursor-pointer bg-transparent"
          >
            {t("news.moreNews")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsArticle;
