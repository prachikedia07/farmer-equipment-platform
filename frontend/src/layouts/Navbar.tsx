// src/layouts/Navbar.tsx

import { Link } from "react-router-dom";
import { Tractor, Globe } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Navbar() {
  return (
    <header className="border-b border-primary/10 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-2 rounded-xl shadow-md group-hover:scale-105 transition">
            <Tractor className="h-6 w-6 text-primary-foreground" />
          </div>

          <span className="font-bold text-xl hidden sm:inline bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Farm Equipment Booking Platform
          </span>
        </Link>

        {/* CENTER */}
        <nav className="hidden md:flex">
          <Link
            to="/equipment"
            className="font-medium text-foreground hover:text-primary transition"
          >
            Find Equipment
          </Link>
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Globe */}
          <button className="p-2 rounded-lg hover:bg-secondary/10 transition">
            <Globe className="h-5 w-5 text-foreground" />
          </button>

          {/* Login */}
          <Link
            to="/login"
            className="font-medium text-foreground hover:text-primary transition"
          >
            Login
          </Link>

          {/* Signup */}
          <Button>
             <Link
            to="/signup"
            className="px-6 py-2 shadow-md hover:shadow-lg"
          >
            Sign Up
          </Link>
          </Button>
        </div>

      </div>
    </header>
  );
}