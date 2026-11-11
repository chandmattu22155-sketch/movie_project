import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProfile, updateProfile } from "../services/authApi";
import { formatDate } from "../utils/movie";

const inputClass = "mt-1 w-full rounded-lg border border-brand-border bg-brand-bg px-4 py-2.5 outline-none focus:border-brand-primary transition-colors";

function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", bio: "" });
  const [picture, setPicture] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => { if (user) setForm({ first_name: user.first_name || "", last_name: user.last_name || "", phone: user.phone || "", bio: user.bio || "" }); }, [user]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      setPicture(null);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    },
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append("first_name", form.first_name);
    body.append("last_name", form.last_name);
    body.append("phone", form.phone);
    body.append("bio", form.bio);
    if (picture) body.append("profile_picture", picture);
    mutation.mutate(body);
  };

  if (isLoading) return <div className="min-h-screen"><Navbar /><p className="py-20 text-center text-brand-muted">Loading Profile...</p></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="mx-auto flex-1 w-full max-w-2xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-extrabold text-white">My Profile</h1>
        {user && (
          <div className="rounded-2xl border border-brand-border bg-brand-card p-6 md:p-8 shadow-lg">
            <div className="flex items-center gap-6">
              {user.profile_picture ? (
                <img src={user.profile_picture} alt="Profile" className="h-24 w-24 rounded-full object-cover ring-4 ring-brand-primary/20" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-bg text-3xl font-bold text-brand-primary ring-4 ring-brand-primary/20">{(user.first_name || user.email).charAt(0).toUpperCase()}</div>
              )}
              <div>
                <p className="text-2xl font-bold text-white">{`${user.first_name} ${user.last_name}`.trim() || "User"}</p>
                <p className="text-sm text-brand-muted">{user.email}</p>
                <p className="mt-1 text-xs text-brand-muted">Joined: {formatDate(user.date_joined)}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-brand-text">First name<input name="first_name" value={form.first_name} onChange={handleChange} className={inputClass} /></label>
                <label className="block text-sm text-brand-text">Last name<input name="last_name" value={form.last_name} onChange={handleChange} className={inputClass} /></label>
              </div>
              <label className="mt-4 block text-sm text-brand-text">Phone<input name="phone" value={form.phone} onChange={handleChange} className={inputClass} maxLength={15} /></label>
              <label className="mt-4 block text-sm text-brand-text">Bio<textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className={inputClass} /></label>
              <label className="mt-4 block text-sm text-brand-text">Profile Picture<input type="file" accept="image/*" onChange={(e) => setPicture(e.target.files[0] || null)} className="mt-2 block w-full text-sm text-brand-muted file:mr-4 file:rounded-lg file:border-0 file:bg-brand-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-primary hover:file:bg-brand-primary/20" /></label>
              {mutation.isError && <p className="mt-4 text-sm text-red-400">{mutation.error.message}</p>}
              {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
              <button type="submit" disabled={mutation.isPending} className="mt-6 rounded-lg bg-brand-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50">{mutation.isPending ? "Saving..." : "Save Changes"}</button>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
export default ProfilePage;