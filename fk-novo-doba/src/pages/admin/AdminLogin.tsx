import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logos/fk-novo-doba.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(`${err instanceof Error ? err.message : "Login failed"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="FK Novo Doba"
            className="w-20 h-20 object-contain mb-4"
            style={{ mixBlendMode: "lighten" }}
          />
          <h1 className="text-[22px] font-black text-[#f5f0e8] tracking-wide">
            FK Novo Doba
          </h1>
          <p className="text-[11px] text-[#56544e] tracking-widest uppercase mt-1">
            Admin Panel
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#12161f] border border-white/07 rounded-xl p-6">
          <h2 className="text-[15px] font-bold text-[#f0ead8] mb-6">
            Sign in to continue
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-[#56544e]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fknovodoba.com"
                required
                className="bg-[#0d1017] border border-white/10 rounded-lg px-4 py-3 text-[14px] text-[#f0ead8] placeholder-[#3a3830] outline-none focus:border-[#c49b32]/50 transition-colors duration-200"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-[#56544e]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[#0d1017] border border-white/10 rounded-lg px-4 py-3 text-[14px] text-[#f0ead8] placeholder-[#3a3830] outline-none focus:border-[#c49b32]/50 transition-colors duration-200"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900/20 border border-red-400/20 rounded-lg px-4 py-3">
                <p className="text-[12px] text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-lg bg-[#c49b32] text-[#0a0c10] text-[13px] font-black tracking-widest uppercase hover:bg-[#d4aa3f] transition-colors duration-200 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#3a3830] mt-6">
          FK Novo Doba © 2026
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
