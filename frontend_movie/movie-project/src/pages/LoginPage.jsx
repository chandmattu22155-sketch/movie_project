import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../features/auth/authSlice";
import { loginUser } from "../services/authApi";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      await loginUser(email.trim(), password);
      dispatch(setAuth({ email }));
      navigate("/home");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-brand-border bg-brand-card p-8 shadow-xl shadow-brand-primary/10">
        <h1 className="text-center text-3xl font-extrabold text-brand-primary">CineVerse</h1>
        <p className="mt-2 text-center text-sm text-brand-muted">Sign in to continue</p>
        <div className="mt-6 space-y-4">
          <label className="block text-sm text-brand-text">Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-2.5 outline-none focus:border-brand-primary transition-colors" />
          </label>
          <label className="block text-sm text-brand-text">Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-2.5 outline-none focus:border-brand-primary transition-colors" />
          </label>
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="mt-6 w-full rounded-lg bg-brand-primary py-2.5 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50">{loading ? "Signing in..." : "Sign In"}</button>
        <p className="mt-6 text-center text-sm text-brand-muted">Don't have an account? <Link to="/register" className="text-brand-primary hover:underline">Register</Link></p>
      </form>
    </div>
  );
}
export default LoginPage;