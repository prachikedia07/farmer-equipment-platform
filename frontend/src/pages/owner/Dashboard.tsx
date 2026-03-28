// src/pages/owner/OwnerDashboard.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Tractor, Calendar, IndianRupee, Eye, Pencil, Trash2,
  Plus, MapPin, CheckCircle2, XCircle, Clock
} from "lucide-react";
import EquipmentModal from "../../components/EquipmentModal";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

// All filter first, then status filters including cancelled
const BOOKING_FILTERS = ["All", "Pending", "Confirmed", "Completed", "Rejected", "Cancelled"] as const;

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800 border border-yellow-200",
  accepted:  "bg-green-100  text-green-800  border border-green-200",
  completed: "bg-blue-100   text-blue-800   border border-blue-200",
  rejected:  "bg-red-100    text-red-800    border border-red-200",
  cancelled: "bg-red-100    text-red-800    border border-red-200",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", accepted: "Confirmed", completed: "Completed",
  rejected: "Rejected", cancelled: "Cancelled",
};

function formatTime(t: string) {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return t;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2,"0")}:${mStr || "00"} ${ampm}`;
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState<any[]>([]);
  const [bookings,  setBookings]  = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<any>(null);
  const [bookingFilter, setBookingFilter] = useState("All"); // ← Default: All

  // ── BACKEND FETCH UNTOUCHED ──
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [eqRes, bRes] = await Promise.all([
        fetch(`${API}/equipment/my`,   { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/bookings/owner`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const eqData = await eqRes.json();
      const bData  = await bRes.json();
      setEquipment(Array.isArray(eqData) ? eqData : []);
      // Latest first
      setBookings(
        Array.isArray(bData)
          ? bData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          : []
      );
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  // ── BOOKING ACTIONS UNTOUCHED ──
  const updateBooking = async (id: string, status: string) => {
    const token = localStorage.getItem("token");
    await fetch(`${API}/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    toast.success(status === "accepted" ? "Booking accepted!" : "Booking rejected");
    fetchData();
  };

  // ── DELETE EQUIPMENT UNTOUCHED ──
  const deleteEquipment = async (id: string) => {
    const token = localStorage.getItem("token");
    await fetch(`${API}/equipment/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    toast.success("Equipment deleted");
    fetchData();
  };

  const totalEarnings = bookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  // ── FILTER LOGIC — All shows everything, others filter by status ──
  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === "All")       return true;
    if (bookingFilter === "Pending")   return b.status === "pending";
    if (bookingFilter === "Confirmed") return b.status === "accepted";
    if (bookingFilter === "Completed") return b.status === "completed";
    if (bookingFilter === "Rejected")  return b.status === "rejected";
    if (bookingFilter === "Cancelled") return b.status === "cancelled";
    return true;
  });

  const stats = [
    { label: "My Equipment",     value: equipment.length,                                   icon: Tractor      },
    { label: "Pending Requests", value: bookings.filter(b => b.status === "pending").length, icon: Calendar     },
    { label: "Total Earnings",   value: `₹${totalEarnings.toLocaleString("en-IN")}`,        icon: IndianRupee  },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6E3] px-4 sm:px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1A0E05]">Dashboard</h1>
            <p className="text-base text-[#3A2010]/65 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowModal(true); }}
            className="inline-flex items-center gap-2 bg-[#4A2E15] hover:bg-[#3A2010] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Equipment
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E0D0BC] p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm font-semibold text-[#5C3D1E]/70 mb-1">{s.label}</p>
                <p className="text-3xl font-extrabold text-[#1A0E05]">{s.value}</p>
              </div>
              <s.icon className="w-10 h-10 text-[#4A2E15]/20" />
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* MY EQUIPMENT */}
          <div className="bg-white rounded-2xl border border-[#E0D0BC] shadow-sm p-6">
            <h2 className="text-xl font-extrabold text-[#1A0E05] mb-5">My Equipment</h2>
            {equipment.length === 0 ? (
              <div className="text-center py-12">
                <Tractor className="w-12 h-12 text-[#C9A96E]/30 mx-auto mb-3" />
                <p className="text-[#5C3D1E]/50 text-sm">No equipment added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {equipment.map(e => (
                  <div key={e._id} className="border border-[#EDE3D0] rounded-2xl p-4 flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#F5EDD8]">
                      {e.image
                        ? <img src={e.image} alt={e.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Tractor className="w-8 h-8 text-[#C9A96E]/40" /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-[#1A0E05] text-base">{e.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-[#3A2010]/70 mt-0.5">
                        <IndianRupee className="w-3.5 h-3.5" /><span>₹{e.price}/{e.pricingType}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[#3A2010]/70 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" /><span>{e.location}</span>
                      </div>
                      {e.availability && (
                        <span className="inline-block mt-1.5 text-xs font-semibold bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full">
                          {e.availability}
                        </span>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => navigate(`/equipment/${e._id}`)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold border-2 border-[#E0D0BC] bg-[#FDF6E3] hover:bg-[#F5EDD8] text-[#2C1A0E] px-3 py-1.5 rounded-lg transition-all">
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button onClick={() => { setEditing(e); setShowModal(true); }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold border-2 border-[#E0D0BC] bg-[#FDF6E3] hover:bg-[#F5EDD8] text-[#2C1A0E] px-3 py-1.5 rounded-lg transition-all">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => deleteEquipment(e._id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOOKINGS */}
          <div className="bg-white rounded-2xl border border-[#E0D0BC] shadow-sm p-6">
            <h2 className="text-xl font-extrabold text-[#1A0E05] mb-5">Bookings</h2>

            {/* Filter tabs — scrollable on mobile */}
            <div className="overflow-x-auto pb-1 mb-5">
              <div className="flex gap-1 bg-[#F5EDD8] rounded-full p-1 w-fit min-w-full sm:min-w-0">
                {BOOKING_FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap
                      ${bookingFilter === f ? "bg-white text-[#1A0E05] shadow-sm" : "text-[#5C3D1E]/70 hover:text-[#1A0E05]"}`}
                  >
                    {f}
                    {/* Show count badge */}
                    {f !== "All" && (
                      <span className="ml-1 opacity-60">
                        ({bookings.filter(b => {
                          if (f === "Pending")   return b.status === "pending";
                          if (f === "Confirmed") return b.status === "accepted";
                          if (f === "Completed") return b.status === "completed";
                          if (f === "Rejected")  return b.status === "rejected";
                          if (f === "Cancelled") return b.status === "cancelled";
                        }).length})
                      </span>
                    )}
                    {f === "All" && <span className="ml-1 opacity-60">({bookings.length})</span>}
                  </button>
                ))}
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-10">
                <Calendar className="w-10 h-10 text-[#C9A96E]/30 mx-auto mb-2" />
                <p className="text-[#5C3D1E]/50 text-sm">No {bookingFilter.toLowerCase()} bookings</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {filteredBookings.map(b => (
                  <div key={b._id} className="border border-[#EDE3D0] rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-extrabold text-[#1A0E05] text-base">{b.farmer?.name}</p>
                        <p className="text-sm text-[#3A2010]/65">{b.equipment?.name || "Deleted Equipment"}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-700"}`}>
                        {STATUS_LABEL[b.status] || b.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#3A2010]/70 mb-3">
                      <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#4A2E15]" /><span>{b.date}</span></div>
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#4A2E15]" /><span>{formatTime(b.startTime)}</span></div>
                    </div>
                    {b.status === "pending" && (
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <button onClick={() => updateBooking(b._id, "accepted")}
                          className="inline-flex items-center justify-center gap-1.5 bg-[#4A2E15] hover:bg-[#3A2010] text-white font-bold text-sm py-2.5 rounded-xl transition-all">
                          <CheckCircle2 className="w-4 h-4" /> Accept
                        </button>
                        <button onClick={() => updateBooking(b._id, "rejected")}
                          className="inline-flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-2.5 rounded-xl transition-all">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                    <button onClick={() => navigate(`/owner/booking/${b._id}`)}
                      className="w-full inline-flex items-center justify-center gap-1.5 border-2 border-[#E0D0BC] bg-[#FDF6E3] hover:bg-[#F5EDD8] text-[#2C1A0E] font-bold text-sm py-2.5 rounded-xl transition-all">
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <EquipmentModal
        open={showModal}
        initialData={editing}
        onClose={() => { setShowModal(false); setEditing(null); }}
        refresh={fetchData}
      />
    </div>
  );
}