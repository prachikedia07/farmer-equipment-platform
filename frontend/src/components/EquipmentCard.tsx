// src/components/EquipmentCard.tsx

import { useNavigate } from "react-router-dom";
import { MapPin, Star, IndianRupee } from "lucide-react";

export default function EquipmentCard({ item }: any) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F0E8D8] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

      {/* ── IMAGE ── */}
      <div className="relative h-48 flex-shrink-0 bg-[#F5EDD8]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-[#C9A96E]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
              <path d="M21 15l-5-5L5 21" strokeWidth="1.5" />
            </svg>
          </div>
        )}

        {/* Availability badge */}
        {item.availability && (
          <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full
            ${item.availability === "Available"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {item.availability}
          </span>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name */}
        <h2 className="text-lg font-bold text-[#2C1A0E] mb-2">{item.name}</h2>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-4 h-4 fill-[#E6A817] text-[#E6A817]" />
          <span className="font-semibold text-sm text-[#2C1A0E]">{item.rating}</span>
          <span className="text-sm text-[#5C3D1E]/60">
            ({item.numReviews} Reviews)
          </span>
        </div>

        {/* Location + Price */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm text-[#5C3D1E]/70">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-[#4A2E15]" />
            <span className="font-bold text-[#4A2E15]">
              ₹{item.price}/{item.pricingType}
            </span>
          </div>
        </div>

        {/* Owner */}
        <p className="text-sm text-[#5C3D1E]/60 mb-4">
          Owner: {item.owner?.name}
        </p>

        {/* Buttons — pushed to bottom */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => navigate(`/equipment/${item._id}`)}
            className="flex-1 bg-[#4A2E15] hover:bg-[#3A2010] text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
          >
            View Details
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex-1 border-2 border-[#E5D5B5] bg-[#FDF6E3] hover:bg-[#F5EDD8] text-[#4A2E15] text-sm font-semibold py-2.5 rounded-xl transition-all"
          >
            Book
          </button>
        </div>
      </div>

    </div>
  );
}