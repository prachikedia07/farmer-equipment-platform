// src/layouts/Navbar.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tractor, Globe, Menu, X, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // ── AUTH LOGIC UNTOUCHED ──
  const getDashboardPath = () => {
    if (!user) return "/";
    if (user.role === "farmer") return "/farmer/dashboard";
    if (user.role === "owner")  return "/owner/dashboard";
    return "/admin/dashboard";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="border-b border-primary/10 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* ── LEFT: Logo — untouched ── */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-2 rounded-xl shadow-md group-hover:scale-105 transition">
            <Tractor className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Farm Equipment Booking Platform
          </span>
        </Link>

        {/* ── CENTER: Nav links — desktop only ── */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/equipment" className="font-medium text-foreground hover:text-primary transition text-sm">
            Find Equipment
          </Link>
          {user && (
            <Link to={getDashboardPath()} className="font-medium text-foreground hover:text-primary transition text-sm">
              Dashboard
            </Link>
          )}
        </nav>

        {/* ── RIGHT: Actions — desktop only ── */}
        <div className="hidden md:flex items-center gap-3">

          <button className="p-2 rounded-lg hover:bg-secondary/10 transition">
            <Globe className="h-5 w-5 text-foreground" />
          </button>

          {user ? (
            <>
              {/* User name pill */}
              <span className="text-sm font-semibold text-[#2C1A0E] bg-[#F5EDD8] border border-[#E5D5B5] px-3 py-1.5 rounded-full">
                {user.name}
              </span>

              {/* Logout button — styled, not raw red */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-medium text-foreground hover:text-primary transition text-sm px-2">
                Login
              </Link>
              <Button asChild>
                <Link to="/signup" className="px-6 py-2 shadow-md hover:shadow-lg">
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* ── MOBILE: Globe + Hamburger ── */}
        <div className="flex md:hidden items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-secondary/10 transition">
            <Globe className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-secondary/10 transition"
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <X className="h-5 w-5 text-foreground" />
              : <Menu className="h-5 w-5 text-foreground" />
            }
          </button>
        </div>

      </div>

      {/* ── MOBILE DROPDOWN ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-primary/10 bg-white/95 backdrop-blur-md px-6 py-4 flex flex-col gap-3">

          <Link
            to="/equipment"
            onClick={closeMenu}
            className="font-medium text-foreground hover:text-primary transition py-2 border-b border-primary/10 text-sm"
          >
            Find Equipment
          </Link>

          {user && (
            <Link
              to={getDashboardPath()}
              onClick={closeMenu}
              className="font-medium text-foreground hover:text-primary transition py-2 border-b border-primary/10 text-sm"
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <>
              {/* User name */}
              <div className="py-2 border-b border-primary/10">
                <span className="text-sm font-semibold text-[#2C1A0E]">
                  👤 {user.name}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={() => { closeMenu(); handleLogout(); }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-lg transition-all w-full justify-center mt-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="font-medium text-foreground hover:text-primary transition py-2 border-b border-primary/10 text-sm"
              >
                Login
              </Link>
              <Button asChild className="w-full mt-1">
                <Link to="/signup" onClick={closeMenu}>Sign Up</Link>
              </Button>
            </>
          )}

        </div>
      )}
    </header>
  );
}