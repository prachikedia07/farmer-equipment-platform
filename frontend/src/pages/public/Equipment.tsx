// src/pages/public/Equipment.tsx

import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import EquipmentCard from "../../components/EquipmentCard";

const API = "http://localhost:5000/api";

function formatCategory(cat: string): string {
  return cat
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Equipment() {
  const [data, setData]                         = useState<any[]>([]);
  const [searchQuery, setSearchQuery]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  // ── BACKEND FETCH UNTOUCHED ──
  useEffect(() => {
    fetch(`${API}/equipment`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const uniqueCategories: string[] = Array.from(
    new Set(data.map((item) => item.category).filter(Boolean))
  );

  const uniqueLocations: string[] = Array.from(
    new Set(data.map((item) => item.location).filter(Boolean))
  );

  const filtered = data.filter((item) => {
    const name      = (item.name || "").toLowerCase();
    const ownerName = (item.owner?.name || "").toLowerCase();
    const category  = item.category || "";
    const location  = item.location || "";
    const matchSearch   = name.includes(searchQuery.toLowerCase()) || ownerName.includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === "all" || category === selectedCategory;
    const matchLocation = selectedLocation === "all" || location === selectedLocation;
    return matchSearch && matchCategory && matchLocation;
  });

  return (
    <div className="min-h-screen bg-[#FDF6E3] px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2C1A0E] mb-1.5">
            Nearby Equipment
          </h1>
          <p className="text-[#5C3D1E]/65 text-base">
            Find and book farm equipment near you
          </p>
        </div>

        {/* ── FILTER BAR — shadcn components matching Figma ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#EDE3D0] p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search — spans 2 cols on md */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2C1A0E]/45 pointer-events-none z-10" />
              <Input
                placeholder="Search equipment or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#FDFAF5]  rounded-xl text-sm placeholder:text-[#2C1A0E] text-[#2C1A0E]"
              />
            </div>

            {/* Equipment Type */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-[#FDFAF5] rounded-xl text-sm text-[#120801] focus:ring-[#4A2E15]/20">
                <SelectValue placeholder="Equipment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                {uniqueCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {formatCategory(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="bg-[#FDFAF5] border-[#DDD0BE] rounded-xl text-sm text-[#2C1A0E] focus:ring-[#4A2E15]/20">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
        </div>

        {/* ── COUNT ── */}
        <p className="mb-5 text-sm text-[#5C3D1E]/60">
          Found <span className="font-semibold text-[#2C1A0E]">{filtered.length}</span> equipment
        </p>

        {/* ── GRID ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <EquipmentCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#F5EDD8] rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-9 h-9 text-[#C9A96E]" />
            </div>
            <h3 className="text-xl font-bold text-[#2C1A0E] mb-2">No equipment found</h3>
            <p className="text-[#5C3D1E]/60 text-sm">Try adjusting your search or filters</p>
          </div>
        )}

      </div>
    </div>
  );
}