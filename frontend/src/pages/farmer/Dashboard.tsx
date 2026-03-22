// src/pages/farmer/FarmerDashboard.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, Star, Tractor, MapPin } from "lucide-react";

const API = "http://localhost:5000/api";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800 border border-yellow-300",
  accepted:  "bg-green-100  text-green-800  border border-green-300",
  confirmed: "bg-green-100  text-green-800  border border-green-300",
  completed: "bg-blue-100   text-blue-800   border border-blue-300",
  rejected:  "bg-red-100    text-red-800    border border-red-300",
  cancelled: "bg-red-100    text-red-800    border border-red-300",
};

const STATUS_LABEL: Record<string, string> = {
  pending:   "Pending",
  accepted:  "Confirmed",
  confirmed: "Confirmed",
  completed: "Completed",
  rejected:  "Cancelled",
  cancelled: "Cancelled",
};

const FILTERS = ["all", "pending", "confirmed", "completed"] as const;

// Format "08:00" → "08:00 AM", "13:00" → "01:00 PM"
function formatTime(t: string): string {
  if (!t) return "—";
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return t;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2,"0")}:${mStr || "00"} ${ampm}`;
}

export default function FarmerDashboard() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter]     = useState("all");

  // ── BACKEND FETCH UNTOUCHED ──
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch(`${API}/bookings/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setBookings(data);
    };
    fetchBookings();
  }, []);

  const total     = bookings.length;
  const active    = bookings.filter(b => b.status === "accepted").length;
  const completed = bookings.filter(b => b.status === "completed").length;

  const filtered = bookings.filter(b => {
    if (filter === "all")       return true;
    if (filter === "pending")   return b.status === "pending";
    if (filter === "confirmed") return b.status === "accepted";
    if (filter === "completed") return b.status === "completed";
    return true;
  });

  const stats = [
    { label: "Total Bookings",  value: total,     icon: Calendar },
    { label: "Active Bookings", value: active,    icon: Clock    },
    { label: "Completed",       value: completed, icon: Star     },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6E3] px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#1A0E05] mb-1">Dashboard</h1>
          <p className="text-lg text-[#3A2010]/70">Welcome back, {user?.name}!</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E0D0BC] p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm font-semibold text-[#5C3D1E]/80 mb-1">{s.label}</p>
                <p className="text-4xl font-extrabold text-[#1A0E05]">{s.value}</p>
              </div>
              <s.icon className="w-10 h-10 text-[#4A2E15]/30" />
            </div>
          ))}
        </div>

        {/* CTA BANNER */}
        <div className="bg-[#EDE0CC] rounded-2xl border border-[#D0BFA8] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-extrabold text-[#1A0E05] text-xl mb-1">Need equipment?</h3>
            <p className="text-base text-[#3A2010]/70">Browse available equipment near you</p>
          </div>
          <Link
            to="/equipment"
            className="inline-flex items-center gap-2 bg-[#4A2E15] hover:bg-[#3A2010] text-white font-bold text-base px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex-shrink-0"
          >
            <Tractor className="w-5 h-5" />
            Find Equipment
          </Link>
        </div>

        {/* MY BOOKINGS */}
        <div className="bg-white rounded-2xl border border-[#E0D0BC] shadow-sm p-6">
          <h2 className="text-2xl font-extrabold text-[#1A0E05] mb-5">My Bookings</h2>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1 mb-6 bg-[#F5EDD8] rounded-full p-1 w-fit">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200
                  ${filter === f
                    ? "bg-white text-[#1A0E05] shadow-sm"
                    : "text-[#5C3D1E] hover:text-[#1A0E05]"
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-14">
              <Calendar className="w-14 h-14 text-[#C9A96E]/40 mx-auto mb-3" />
              <p className="text-[#5C3D1E]/60 text-base font-medium">No bookings found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(b => (
                <div key={b._id} className="border border-[#E0D0BC] rounded-2xl p-5 hover:shadow-sm transition-all bg-[#FDFAF5]">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                    {/* Left */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <h3 className="font-extrabold text-[#1A0E05] text-lg">
                          {b.equipment?.name}
                        </h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-700"}`}>
                          {STATUS_LABEL[b.status] || b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm font-medium text-[#3A2010]/80">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0 text-[#4A2E15]" />
                          <span>{b.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0 text-[#4A2E15]" />
                          <span>{formatTime(b.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-[#4A2E15]" />
                          <span>{b.equipment?.location}</span>
                        </div>
                        <div className="font-extrabold text-[#4A2E15] text-base">
                          ₹{b.equipment?.price}/{b.equipment?.pricingType}
                        </div>
                      </div>

                      <p className="text-sm font-medium text-[#5C3D1E]/70 mt-2">
                        Owner: <span className="text-[#3A2010]">{b.owner?.name}</span>
                      </p>
                    </div>

                    {/* Right */}
                    <div className="flex-shrink-0">
                      <Link
                        to={`/booking/${b._id}`}
                        className="inline-flex items-center justify-center border-2 border-[#D9CBBA] bg-[#FDF6E3] hover:bg-[#F5EDD8] text-[#2C1A0E] font-bold text-sm px-5 py-2.5 rounded-xl transition-all"
                      >
                        View Details
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}