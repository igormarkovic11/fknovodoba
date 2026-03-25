import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useMatches } from "../../hooks/useMatches";
import { usePlayers } from "../../hooks/usePlayers";
import { useNews } from "../../hooks/useNews";

const StatCard = ({
  label,
  value,
  link,
}: {
  label: string;
  value: number | string;
  link: string;
}) => (
  <Link to={link} className="no-underline">
    <div className="bg-[#12161f] border border-white/07 rounded-xl p-5 hover:border-[#c49b32]/40 transition-colors duration-200">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-[#56544e] mb-2">
        {label}
      </p>
      <p className="text-[32px] font-black text-[#f5f0e8] leading-none">
        {value}
      </p>
    </div>
  </Link>
);

const QuickLink = ({
  label,
  description,
  to,
  color,
}: {
  label: string;
  description: string;
  to: string;
  color: string;
}) => (
  <Link to={to} className="no-underline">
    <div className="bg-[#12161f] border border-white/07 rounded-xl p-4 hover:border-[#c49b32]/40 transition-colors duration-200 flex items-center gap-4">
      <div className={`w-2 h-10 rounded-full shrink-0 ${color}`} />
      <div>
        <p className="text-[14px] font-bold text-[#f0ead8]">{label}</p>
        <p className="text-[12px] text-[#56544e]">{description}</p>
      </div>
      <span className="ml-auto text-[#c49b32] text-lg">→</span>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: matches } = useMatches();
  const { data: players } = usePlayers();
  const { data: news } = useNews(100);

  const played = matches?.filter((m) => m.status === "played").length ?? 0;
  const upcoming = matches?.filter((m) => m.status === "upcoming").length ?? 0;

  const handleLogout = async () => {
    await logout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e8e4d9]">
      {/* Header */}
      <div className="bg-[#0d1017] border-b border-white/05 px-5 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-black text-[#f5f0e8] tracking-wide">
            Admin Panel
          </h1>
          <p className="text-[11px] text-[#56544e]">{user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-[11px] font-semibold tracking-widest uppercase text-[#8a8880] hover:text-[#f0ead8] transition-colors no-underline"
          >
            View Site →
          </Link>
          <button
            onClick={handleLogout}
            className="text-[11px] font-semibold tracking-widest uppercase text-[#cc2222] hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="px-5 py-6">
        {/* Stats */}
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
          Overview
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            label="Players"
            value={players?.length ?? 0}
            link="/admin/players"
          />
          <StatCard label="Results" value={played} link="/admin/matches" />
          <StatCard label="Fixtures" value={upcoming} link="/admin/matches" />
          <StatCard
            label="News Posts"
            value={news?.length ?? 0}
            link="/admin/news"
          />
        </div>

        {/* Quick links */}
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#c49b32] mb-4">
          Manage
        </p>
        <div className="flex flex-col gap-3">
          <QuickLink
            label="Players & Staff"
            description="Add, edit or remove players and coaching staff"
            to="/admin/players"
            color="bg-[#3b82f6]"
          />
          <QuickLink
            label="Matches"
            description="Add results and upcoming fixtures"
            to="/admin/matches"
            color="bg-[#10b981]"
          />
          <QuickLink
            label="News"
            description="Write and publish news posts"
            to="/admin/news"
            color="bg-[#cc2222]"
          />
          <QuickLink
            label="League Standings"
            description="Update the league table"
            to="/admin/standings"
            color="bg-[#c49b32]"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
