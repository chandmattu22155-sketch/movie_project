import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Search, LogOut, User } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [text, setText] = useState(searchParams.get("search") || "");
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = text.trim();
    navigate(value ? `/home?search=${encodeURIComponent(value)}` : "/home");
  };

  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/home" className="text-2xl font-black tracking-tight text-brand-primary"><span className="text-white">Prime</span>Cinema</Link>
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md md:flex relative">
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search movies..." className="w-full rounded-full border border-brand-border bg-brand-card py-2 pl-4 pr-10 text-sm text-white outline-none focus:border-brand-primary transition-colors" />
          <button type="submit" className="absolute right-3 top-2 text-brand-muted hover:text-brand-primary"><Search size={18} /></button>
        </form>
        <div className="flex items-center gap-4">
          {isAuthenticated && <Link to="/profile" className="text-brand-muted hover:text-brand-primary transition-colors"><User size={20} /></Link>}
          <button onClick={handleLogout} className="text-brand-muted hover:text-red-500 transition-colors"><LogOut size={20} /></button>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;


