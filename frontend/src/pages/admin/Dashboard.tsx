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

export default function AdminDashboard() {
  const { user } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#6D4C41', '#8D6E63', '#689F38', '#D4A574', '#FFA726'];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
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

  if (loading) return <div className="p-10">Loading...</div>;
  if (!data) return <div className="p-10">No data</div>;

  const stats = [
    {
      label: "Total Farmers",
      value: data.totalFarmers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Total Owners",
      value: data.totalOwners,
      icon: Tractor,
      color: "text-green-600",
    },
    {
      label: "Total Bookings",
      value: data.totalBookings,
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      label: "Commission",
      value: `₹${data.commission}`,
      icon: IndianRupee,
      color: "text-orange-600",
    },
  ];

  console.log("ADMIN DATA:", data);

  return (
    <div className="min-h-screen bg-[#FDF6E3] p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and analytics</p>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        {/* BAR */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Booking Trends</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#6D4C41" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Equipment Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.equipmentStats || []}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={(e: any) => `${e.name} (${e.value})`}
              >
                {(data.equipmentStats || []).map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* TABLE + LOCATIONS */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* RECENT BOOKINGS */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Farmer</th>
                <th className="text-left py-2">Owner</th>
                <th className="text-left py-2">Equipment</th>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {(data.recentBookings || []).map((b: any) => (
                <tr key={b._id} className="border-b">
                  <td className="py-2">{b.farmer?.name}</td>
                  <td className="py-2">{b.owner?.name}</td>
                  <td className="py-2">
  {b.equipment?.name || "Deleted Equipment"}
</td>
                  <td className="py-2">{b.date}</td>
                  <td className="py-2">₹{b.totalPrice}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LOCATIONS */}
        <div className="bg-white p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Top Locations</h2>

         {(data.topLocations || []).map((l: any, i: number) => (
            <div key={i} className="flex justify-between mb-3">
              <div className="flex gap-2">
                <span>{i + 1}.</span>
                <span>{l._id || "Unknown"}</span>
              </div>
              <span>{l.bookings}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}