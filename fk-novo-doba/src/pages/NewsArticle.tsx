import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNewsPost } from "../hooks/useNews";
import logo from "../assets/logos/fk-novo-doba.webp";
import PlayerOfTheMatch from "../components/PlayerOfTheMatch";

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
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading } = useNewsPost(id ?? "");

  const locale = i18n.language === "sr" ? "sr-Latn-RS" : "en-GB";

  const date = post
    ? new Date(post.date).toLocaleDateString(locale, {
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
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-6 w-24 mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-10 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-20 w-full mb-2" />
        </div>
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
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9] pb-20">
      {/* Header sa dugmetom nazad - centriran */}
      <div className="max-w-4xl mx-auto px-5 pt-8">
        <button
          onClick={() => navigate("/news")}
          className="group flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#8a8880] hover:text-[#c49b32] transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer"
        >
          <span className="text-[14px] transition-transform group-hover:-translate-x-1">
            ←
          </span>
          {t("news.backToNews")}
        </button>
      </div>

      {/* Kontejner za sliku - Optimizovan da se uvek vidi cela slika */}
      <div className="max-w-5xl mx-auto px-5 mt-6">
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-[#0d1017] border border-white/05 shadow-2xl
                        aspect-video md:h-[400px] lg:h-[500px]"
        >
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              /* object-contain osigurava da se ništa ne odseče */
              className="w-full h-full object-contain md:object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20">
              <div className="text-[64px] font-black">FKND</div>
            </div>
          )}
        </div>
      </div>

      {/* Glavni sadržaj teksta - Sužen na max-w-3xl za bolju čitljivost */}
      <div className="max-w-3xl mx-auto px-5 mt-10">
        {/* Tag i Datum */}
        <div className="flex items-center gap-4 mb-6">
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${tagColors[post.tag] ?? "text-[#8a8880] border-white/10"}`}
          >
            {t(`news.tags.${post.tag}`)}
          </span>
          <span className="text-[12px] text-[#56544e] font-medium first-letter:uppercase italic">
            {date}
          </span>
        </div>

        {/* Naslov */}
        <h1 className="text-[32px] md:text-[44px] font-black text-[#f5f0e8] leading-tight tracking-tight mb-8">
          {post.title}
        </h1>

        {/* Excerpt - Istaknut stilski */}
        {post.excerpt && (
          <div className="relative mb-10">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#c49b32] rounded-full shadow-[0_0_10px_rgba(196,155,50,0.3)]" />
            <p className="text-[18px] md:text-[20px] text-[#f0ead8] leading-relaxed font-medium pl-6 italic opacity-90">
              {post.excerpt}
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" />

        {/* Telo teksta */}
        <div className="text-[16px] md:text-[17px] text-[#8a8880] leading-[1.8] whitespace-pre-line font-normal selection:bg-[#c49b32]/30">
          {post.body}
        </div>

        {/* Player of the match sekcija */}
        {post.matchId && (
          <div className="mt-12 p-1 rounded-2xl bg-gradient-to-br from-[#c49b32]/20 to-transparent">
            <PlayerOfTheMatch matchId={post.matchId} />
          </div>
        )}

        {/* Author/Club Footer */}
        <div className="mt-16 pt-8 border-t border-white/05 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/03 rounded-xl border border-white/05">
              <img
                src={logo}
                alt="FK Novo Doba"
                className="h-12 w-12 object-contain"
                style={{ mixBlendMode: "lighten" }}
              />
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#f5f0e8]">
                FK Novo Doba
              </div>
              <div className="text-[12px] text-[#56544e]">
                {t("news.about")}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/news")}
            className="w-full md:w-auto text-[11px] font-bold tracking-widest uppercase text-[#c49b32] border border-[#c49b32]/30 px-6 py-3 rounded-xl hover:bg-[#c49b32] hover:text-[#0a0c10] transition-all duration-300 cursor-pointer bg-transparent"
          >
            {t("news.moreNews")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsArticle;
