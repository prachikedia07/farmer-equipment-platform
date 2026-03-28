// src/pages/auth/Signup.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tractor, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const API = "http://localhost:5000/api";

const ROLES = [
  { value: "farmer", label: "Farmer"         },
  { value: "owner",  label: "Equipment Owner" },
  // { value: "admin",  label: "Admin"           },
];

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole]               = useState("farmer");
  const [form, setForm]               = useState({ name: "", email: "", phone: "", location: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // ── BACKEND UNTOUCHED ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      navigate("/login");
      toast.success("Account created!");
    } else {
      toast.error(data.message || "Signup failed. Please try again.");
    }
  };

  const inputClass =
    "w-full bg-[#FDF6E3] border border-[#E5D5B5] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] placeholder-[#5C3D1E]/40 outline-none focus:border-[#4A2E15] focus:ring-2 focus:ring-[#4A2E15]/10 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3] px-4 py-12">

      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md px-8 py-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FDF6E3] border border-[#E5D5B5] flex items-center justify-center mb-4">
            <Tractor className="w-8 h-8 text-[#4A2E15]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C1A0E]">Sign Up</h1>
          <p className="text-sm text-[#5C3D1E]/60 mt-1">
            Create your account to get started
          </p>
        </div>

        {/* ── ROLE SWITCHER ── */}
        <div className="flex bg-[#F5EDD8] rounded-full p-1 mb-6">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => { setRole(r.value); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200
                ${role === r.value
                  ? "bg-white text-[#2C1A0E] shadow-sm"
                  : "text-[#5C3D1E]/70 hover:text-[#2C1A0E]"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* ── FORM ── */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-medium text-[#2C1A0E]">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ramesh Kumar"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-[#2C1A0E]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="farmer@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-sm font-medium text-[#2C1A0E]">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={form.phone}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Location — hidden for admin, same as Figma reference */}
          {role !== "admin" && (
            <div className="space-y-1.5">
              <label htmlFor="location" className="block text-sm font-medium text-[#2C1A0E]">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Village Rampur, Punjab"
                value={form.location}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-[#2C1A0E]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C3D1E]/50 hover:text-[#2C1A0E] transition"
                aria-label="Toggle password visibility"
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4A2E15] hover:bg-[#3A2010] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating account...
              </span>
            ) : "Sign Up"}
          </button>

        </form>

        {/* ── FOOTER ── */}
        <p className="mt-6 text-center text-sm text-[#5C3D1E]/60">
          Already have an account?{" "}
          <Link to="/login" className="text-[#4A2E15] font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}