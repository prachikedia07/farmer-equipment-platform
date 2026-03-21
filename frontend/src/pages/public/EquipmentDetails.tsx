// src/pages/public/EquipmentDetails.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Star, Phone, IndianRupee, Clock, CheckCircle } from "lucide-react";

const API = "http://localhost:5000/api";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export default function EquipmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData]       = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  // ── BACKEND FETCHES UNTOUCHED ──
  useEffect(() => {
    fetch(`${API}/equipment/${id}`)
      .then((res) => res.json())
      .then(setData);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetch(`${API}/reviews/${id}`)
        .then((res) => res.json())
        .then(setReviews);
    }
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-[#4A2E15]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-[#5C3D1E]/70 text-sm">Loading equipment...</p>
        </div>
      </div>
    );
  }

  // Safely extract features — handles null, undefined, empty array
  const features: string[] = Array.isArray(data.features)
    ? data.features.filter((f: any) => typeof f === "string" && f.trim() !== "")
    : [];

  return (
    <div className="min-h-screen bg-[#FDF6E3] px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── LEFT: Main Content ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#F0E8D8] h-64 sm:h-80 lg:h-96 border border-[#E5D5B5] shadow-sm">
              {data.image ? (
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-20 h-20 text-[#C9A96E]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                    <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
                    <path d="M21 15l-5-5L5 21" strokeWidth="1.5" />
                  </svg>
                </div>
              )}
              {data.availability && (
                <span className="absolute top-4 right-4 bg-green-100 text-green-700 border border-green-200 text-sm font-semibold px-3 py-1 rounded-full">
                  {data.availability}
                </span>
              )}
            </div>

            {/* Details card — name, rating, location, price, description, features all in ONE card */}
            <div className="bg-white rounded-2xl border border-[#F0E8D8] shadow-sm p-6 space-y-5">

              {/* Name */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1A0E]">
                {data.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-[#E6A817] text-[#E6A817]" />
                <span className="font-bold text-[#2C1A0E]">{data.rating}</span>
                <span className="text-[#5C3D1E]/60 text-sm">
                  ({data.numReviews} Reviews)
                </span>
              </div>

              {/* Location + Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#5C3D1E]/70 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{data.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-[#4A2E15]" />
                  <span className="text-2xl font-bold text-[#4A2E15]">
                    ₹{data.price}
                    <span className="text-base font-normal text-[#5C3D1E]/60">/{data.pricingType}</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-[#F0E8D8] pt-5">
                <h3 className="font-bold text-[#2C1A0E] mb-2">Description</h3>
                <p className="text-[#5C3D1E]/75 text-sm leading-relaxed">
                  {data.description || "No description available"}
                </p>
              </div>

              {/* Features — always render section, show message if empty */}
              <div className="border-t border-[#F0E8D8] pt-5">
                <h3 className="font-bold text-[#2C1A0E] mb-3">Features</h3>
                {features.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {features.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-[#5C3D1E]/80">
                        <CheckCircle className="w-4 h-4 text-[#4A7C59] flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#5C3D1E]/50">No features listed</p>
                )}
              </div>

            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-[#F0E8D8] shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#2C1A0E] mb-5">Reviews</h2>

              {reviews.length === 0 ? (
                <p className="text-[#5C3D1E]/50 text-sm">No reviews yet</p>
              ) : (
                <div>
                  {reviews.map((r, idx) => (
                    <div
                      key={r._id}
                      className={`py-4 ${idx < reviews.length - 1 ? "border-b border-[#F0E8D8]" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-[#120801] text-sm">
                          {r.farmer?.name || r.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-[#2b1709]">
                          {formatDate(r.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < r.rating
                              ? "fill-[#E6A817] text-[#E6A817]"
                              : "fill-none text-[#E5D5B5]"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-[#5C3D1E]/70 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="space-y-5">

            {/* Owner Card */}
            <div className="bg-white rounded-2xl border border-[#F0E8D8] shadow-sm p-6">
              <h3 className="font-bold text-[#2C1A0E] mb-4">Equipment Owner</h3>
              <div className="space-y-3">
                <p className="font-semibold text-[#2C1A0E]">{data.owner?.name}</p>
                {data.owner?.phone && (
                  <div className="flex items-center gap-2 text-[#5C3D1E]/70 text-sm">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{data.owner.phone}</span>
                  </div>
                )}
                <button className="w-full mt-2 border-2 border-[#E5D5B5] bg-[#FDF6E3] hover:bg-[#F5EDD8] text-[#4A2E15] font-semibold text-sm py-2.5 rounded-xl transition-all">
                  Contact Owner
                </button>
              </div>
            </div>

            {/* Booking Card */}
            <div className="bg-white rounded-2xl border border-[#F0E8D8] shadow-sm p-6 sticky top-24">
              <p className="text-sm text-[#5C3D1E]/60 mb-1">Price</p>
              <p className="text-3xl font-bold text-[#2C1A0E] mb-6">
                ₹{data.price}
                <span className="text-base font-normal text-[#5C3D1E]/60">/{data.pricingType}</span>
              </p>

              <button
                onClick={() => navigate("/login")}
                className="w-full bg-[#4A2E15] hover:bg-[#3A2010] text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Request Booking
              </button>

              <div className="mt-4 pt-4 border-t border-[#F0E8D8] flex items-center gap-2 text-xs text-[#5C3D1E]/50">
                <Clock className="w-3.5 h-3.5" />
                <span>Response within 24 hours</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}