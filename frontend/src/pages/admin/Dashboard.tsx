// src/pages/admin/AdminDashboard.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Users, Tractor, Calendar, IndianRupee, TrendingUp, MapPin
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const API = "http://localhost:5000/api";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  accepted:  "bg-green-100  text-green-700",
  confirmed: "bg-green-100  text-green-700",
  completed: "bg-blue-100   text-blue-700",
  rejected:  "bg-red-100    text-red-700",
  cancelled: "bg-red-100    text-red-700",
};

const CHART_COLORS = ["#6D4C41", "#8D6E63", "#689F38", "#D4A574", "#FFA726"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ── BACKEND FETCH UNTOUCHED ──
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const result = await res.json();
        setData(result);
      } catch {
        toast.error("Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin w-9 h-9 text-[#4A2E15]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-[#3A2010] text-sm font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center">
      <p className="text-[#5C3D1E]/60 text-base">No data available</p>
    </div>
  );

  const stats = [
    { label: "Total Farmers",  value: data.totalFarmers?.toLocaleString("en-IN") ?? "—", change: "+12%", icon: Users,        iconColor: "text-blue-500",   iconBg: "bg-blue-50 border-blue-100"   },
    { label: "Total Owners",   value: data.totalOwners?.toLocaleString("en-IN")  ?? "—", change: "+8%",  icon: Tractor,      iconColor: "text-green-500",  iconBg: "bg-green-50 border-green-100" },
    { label: "Total Bookings", value: data.totalBookings?.toLocaleString("en-IN") ?? "—",change: "+24%", icon: Calendar,     iconColor: "text-purple-500", iconBg: "bg-purple-50 border-purple-100"},
    { label: "Commission",     value: `₹${data.commission ?? 0}`,                        change: "+18%", icon: IndianRupee,  iconColor: "text-orange-500", iconBg: "bg-orange-50 border-orange-100"},
  ];

  return (
    <div className="min-h-screen bg-[#FDF6E3] px-4 sm:px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#1A0E05]">Admin Dashboard</h1>
          <p className="text-base text-[#3A2010]/60 mt-1">Platform overview and analytics</p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E8DCC8] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#5C3D1E]/65 font-semibold mb-1">{s.label}</p>
                  <p className="text-3xl font-extrabold text-[#1A0E05] mb-2">{s.value}</p>
                  <div className="flex items-center gap-1 text-sm text-green-600 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    <span>{s.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
                  <s.icon className={`w-10 h-10 ${s.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* Bar chart — Booking Trends */}
          <div className="bg-white rounded-2xl border border-[#E8DCC8] shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-[#1A0E05] mb-6">Booking Trends</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.monthlyBookings || []} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D8" vertical={false} />
                <XAxis dataKey="month" stroke="#8D6E63" tick={{ fontSize: 13, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#8D6E63" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#FDF6E3", border: "1px solid #E0D0BC", borderRadius: "12px", fontSize: "13px", fontWeight: 600 }}
                  cursor={{ fill: "#F5EDD8" }}
                />
                <Bar dataKey="bookings" fill="#6D4C41" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart — Equipment Distribution */}
          <div className="bg-white rounded-2xl border border-[#E8DCC8] shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-[#1A0E05] mb-6">Equipment Distribution</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.equipmentStats || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={(entry: any) => `${entry.name} (${entry.value}%)`}
                >
                  {(data.equipmentStats || []).map((_: any, i: number) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#FDF6E3", border: "1px solid #E0D0BC", borderRadius: "12px", fontSize: "13px", fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* TABLE + LOCATIONS */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent Bookings table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8DCC8] shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-[#1A0E05] mb-6">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0E8D8]">
                    {["Farmer","Owner","Equipment","Date","Amount","Status"].map(h => (
                      <th key={h} className="text-left py-3 px-2 text-sm font-bold text-[#5C3D1E]/65">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.recentBookings || []).map((b: any) => (
                    <tr key={b._id} className="border-b border-[#F8F2E8] last:border-0 hover:bg-[#FDF6E3]/60 transition-colors">
                      <td className="py-3 px-2 text-sm font-semibold text-[#1A0E05]">{b.farmer?.name || "—"}</td>
                      <td className="py-3 px-2 text-sm text-[#3A2010]/80">{b.owner?.name || "—"}</td>
                      <td className="py-3 px-2 text-sm text-[#3A2010]/80">{b.equipment?.name || "Deleted"}</td>
                      <td className="py-3 px-2 text-sm text-[#5C3D1E]/60">{b.date}</td>
                      <td className="py-3 px-2 text-sm font-bold text-[#1A0E05]">₹{b.totalPrice?.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status] || "bg-gray-100 text-gray-700"}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!data.recentBookings || data.recentBookings.length === 0) && (
                <p className="text-center py-8 text-[#5C3D1E]/45 text-sm">No recent bookings</p>
              )}
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-2xl border border-[#E8DCC8] shadow-sm p-6">
            <h2 className="text-lg font-extrabold text-[#1A0E05] mb-6">Top Locations</h2>
            <div className="space-y-3">
              {(data.topLocations || []).map((l: any, i: number) => (
                <div key={i} className="flex items-center justify-between group hover:bg-[#FDF6E3] px-3 py-2.5 rounded-xl transition-colors -mx-3">
                  <div className="flex items-center gap-3">
                    {/* Numbered circle */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-extrabold"
                      style={{ background: "#F5EDD8", color: "#4A2E15", border: "1px solid #E0D0BC" }}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1A0E05]">{l._id || "Unknown"}</p>
                      <p className="text-xs text-[#5C3D1E]">{l.bookings} bookings</p>
                    </div>
                  </div>
                  <MapPin className="w-4 h-4 text-[#5C3D1E] flex-shrink-0" />
                </div>
              ))}
              {(!data.topLocations || data.topLocations.length === 0) && (
                <p className="text-sm text-[#5C3D1E]/45 text-center py-4">No location data</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}