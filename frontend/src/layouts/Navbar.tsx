// src/layouts/Navbar.tsx

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tractor, Globe, Menu, X, LogOut, User, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // ── SCROLL LISTENER — glass effect activates on scroll ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── AUTH LOGIC UNTOUCHED ──
  const getDashboardPath = () => {
    if (!user) return "/";
    if (user.role === "farmer") return "/farmer/dashboard";
    if (user.role === "owner")  return "/owner/dashboard";
    return "/admin/dashboard";
  };
  const getProfilePath = () => {
    if (!user) return "/";
    if (user.role === "farmer") return "/farmer/profile";
    if (user.role === "owner")  return "/owner/profile";
    return "/";
  };
  const handleLogout = () => { logout(); navigate("/login"); };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={
        scrolled
          ? { background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(229,213,181,0.7)", boxShadow: "0 2px 20px rgba(74,46,21,0.07)" }
          : { background: "#ffffff", borderBottom: "1px solid #f0e8d8" }
      }
    >
      <div className="container mx-auto px-6 py-5 flex items-center justify-between gap-4">

        {/* ── LEFT: Original logo style kept exactly ── */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-2 rounded-xl shadow-md group-hover:scale-105 transition">
            <Tractor className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Farm Equipment Booking Platform
          </span>
        </Link>

        {/* ── CENTER NAV — desktop ── */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/equipment"
            className="text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-secondary/10 px-3 py-2 rounded-lg transition-all"
          >
            Find Equipment
          </Link>
          {user && (
            <Link to={getDashboardPath()}
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-secondary/10 px-3 py-2 rounded-lg transition-all"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}
        </nav>

        {/* ── RIGHT ACTIONS — desktop ── */}
        <div className="hidden md:flex items-center gap-3">

          <button className="p-2 rounded-lg hover:bg-secondary/10 transition text-foreground">
            <Globe className="h-5 w-5" />
          </button>

          {user ? (
            /* Profile dropdown */
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-secondary/10 border border-transparent hover:border-primary/20 transition-all"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-xs font-extrabold text-primary-foreground">{initials}</span>
                </div>
                <span className="text-sm font-bold text-foreground max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-foreground/50 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-2xl border border-primary/10 shadow-2xl overflow-hidden z-50"
                  style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)" }}
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-primary/10 flex items-center gap-3 bg-primary/5">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-extrabold text-primary-foreground">{initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-foreground/50 capitalize">{user.role}</p>
                    </div>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <button onClick={() => { navigate(getProfilePath()); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 text-sm font-semibold text-foreground px-3 py-2.5 rounded-xl hover:bg-secondary/10 transition-all text-left"
                    >
                      <User className="w-4 h-4 text-primary/60" /> My Profile
                    </button>
                    <button onClick={() => { navigate(getDashboardPath()); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 text-sm font-semibold text-foreground px-3 py-2.5 rounded-xl hover:bg-secondary/10 transition-all text-left"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary/60" /> Dashboard
                    </button>
                  </div>

                  <div className="p-1.5 border-t border-primary/10">
                    <button onClick={() => { handleLogout(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 text-sm font-bold text-red-600 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="font-medium text-foreground hover:text-primary transition text-sm px-2">
                Login
              </Link>
              <Button asChild>
                <Link to="/signup" className="px-6 py-2 shadow-md hover:shadow-lg">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* ── MOBILE ── */}
        <div className="flex md:hidden items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-secondary/10 transition text-foreground">
            <Globe className="h-5 w-5" />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-secondary/10 transition text-foreground">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* ── MOBILE DROPDOWN ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-primary/10 bg-white/97 px-4 py-3 flex flex-col gap-1"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <Link to="/equipment" onClick={closeMenu} className="text-sm font-semibold text-foreground py-2.5 px-3 rounded-xl hover:bg-secondary/10 transition-all">
            Find Equipment
          </Link>
          {user && (
            <Link to={getDashboardPath()} onClick={closeMenu} className="flex items-center gap-2 text-sm font-semibold text-foreground py-2.5 px-3 rounded-xl hover:bg-secondary/10 transition-all">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}
          {user ? (
            <>
              <div className="flex items-center gap-3 py-2.5 px-3 mt-1 border-t border-primary/10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-extrabold text-primary-foreground">{initials}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{user.name}</p>
                  <p className="text-xs text-foreground/50 capitalize">{user.role}</p>
                </div>
              </div>
              <Link to={getProfilePath()} onClick={closeMenu} className="flex items-center gap-2 text-sm font-semibold text-foreground py-2.5 px-3 rounded-xl hover:bg-secondary/10 transition-all">
                <User className="w-4 h-4 text-primary/60" /> My Profile
              </Link>
              <button onClick={() => { closeMenu(); handleLogout(); }} className="flex items-center gap-2 text-sm font-bold text-red-600 py-2.5 px-3 rounded-xl hover:bg-red-50 transition-all w-full text-left border-t border-primary/10 mt-1 pt-3">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </>
          ) : (
            <div className="border-t border-primary/10 pt-2 mt-1 space-y-2">
              <Link to="/login" onClick={closeMenu} className="block text-sm font-semibold text-foreground py-2.5 px-3 rounded-xl hover:bg-secondary/10">Login</Link>
              <Button asChild className="w-full">
                <Link to="/signup" onClick={closeMenu}>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}