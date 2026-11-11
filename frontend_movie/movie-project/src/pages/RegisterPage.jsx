import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authApi";

const inputClass = "mt-1 w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-2.5 outline-none focus:border-brand-primary transition-colors";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", password: "", password2: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (form.password !== form.password2) { setError("Passwords do not match."); return; }
    const data = { ...form, email: form.email.trim() };
    if (!data.phone) delete data.phone;
    setLoading(true);
    try { await registerUser(data); navigate("/login"); } 
    catch (err) { setError(err.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4 py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-card p-8 shadow-xl shadow-brand-primary/10">
        <h1 className="text-center text-3xl font-extrabold text-brand-primary">CineVerse</h1>
        <p className="mt-2 text-center text-sm text-brand-muted">Create an account</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-brand-text">First name<input name="first_name" value={form.first_name} onChange={handleChange} className={inputClass} required /></label>
          <label className="block text-sm text-brand-text">Last name<input name="last_name" value={form.last_name} onChange={handleChange} className={inputClass} required /></label>
        </div>
        <label className="mt-4 block text-sm text-brand-text">Email<input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} required /></label>
        <label className="mt-4 block text-sm text-brand-text">Phone (optional)<input name="phone" value={form.phone} onChange={handleChange} className={inputClass} maxLength={15} /></label>
        <label className="mt-4 block text-sm text-brand-text">Password<input type="password" name="password" value={form.password} onChange={handleChange} className={inputClass} required /></label>
        <label className="mt-4 block text-sm text-brand-text">Confirm Password<input type="password" name="password2" value={form.password2} onChange={handleChange} className={inputClass} required /></label>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="mt-6 w-full rounded-lg bg-brand-primary py-2.5 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50">{loading ? "Creating..." : "Create Account"}</button>
        <p className="mt-6 text-center text-sm text-brand-muted">Already have an account? <Link to="/login" className="text-brand-primary hover:underline">Login</Link></p>
      </form>
    </div>
  );
}
export default RegisterPage;