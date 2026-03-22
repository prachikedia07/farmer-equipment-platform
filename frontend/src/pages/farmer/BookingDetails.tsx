// src/pages/farmer/BookingDetails.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Tractor, FileText, User, IndianRupee,
  Calendar, Clock, MapPin, Phone, CheckCircle, XCircle, Star, X
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

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
const PAYMENT_STYLES: Record<string, string> = {
  pending:  "bg-yellow-50 text-yellow-800 border border-yellow-300",
  paid:     "bg-green-50  text-green-800  border border-green-300",
  refunded: "bg-blue-50   text-blue-800   border border-blue-300",
};

function formatTime(t: string): string {
  if (!t) return "—";
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return t;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2,"0")}:${mStr || "00"} ${ampm}`;
}

export default function BookingDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData]             = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // ── BACKEND FETCH UNTOUCHED ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user) return;
    if (!token) { toast.error("Please login again"); navigate("/login"); return; }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`${API}/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!Array.isArray(result)) { setLoading(false); return; }
        const found = result.find((b: any) => String(b._id) === String(id));
        setData(found || null);
      } catch (err) {
        console.error(err);
        toast.error("Error loading booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, user]);

  // ── CANCEL UNTOUCHED ──
  const cancelBooking = async () => {
  setCancelling(true);
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/bookings/${data._id}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "cancelled" }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message);
    }

    // ✅ UPDATE UI INSTANTLY
    setData((prev: any) => ({
      ...prev,
      status: "cancelled",
    }));

    toast.success("Booking cancelled");

    // optional slight delay so user sees update
    setTimeout(() => {
      navigate("/farmer/dashboard");
    }, 500);

  } catch {
    toast.error("Error cancelling booking");
  } finally {
    setCancelling(false);
    setShowCancel(false);
  }
};

  if (loading) return (
    <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin w-9 h-9 text-[#4A2E15]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="text-[#3A2010] text-base font-medium">Loading booking...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#1A0E05] font-bold text-lg mb-3">Booking not found</p>
        <button onClick={() => navigate("/farmer/dashboard")} className="text-sm text-[#4A2E15] underline font-medium">
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  const equipment     = data.equipment;
  const bookingStatus = data.status || "pending";
  const paymentStatus = data.paymentStatus || "pending";
  const canCancel     = !["completed","rejected","cancelled"].includes(bookingStatus);

  // ── Rating: pull from equipment (not owner — owner is User model, no rating field) ──
  const equipmentRating = equipment?.rating;

  // ── Features: safe extraction ──
  const features: string[] = Array.isArray(equipment?.features)
    ? equipment.features.filter((f: any) => typeof f === "string" && f.trim() !== "")
    : [];

  return (
    <div className="min-h-screen bg-[#FDF6E3] px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* BACK */}
        <button
          onClick={() => navigate("/farmer/dashboard")}
          className="inline-flex items-center gap-2 text-base font-semibold text-[#3A2010] hover:text-[#1A0E05] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-7">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1A0E05]">Booking Details</h1>
            <p className="text-base text-[#5C3D1E]/70 mt-1 font-medium">
              Booking ID: #{String(data._id).slice(-6).toUpperCase()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${STATUS_STYLES[bookingStatus] || "bg-gray-100 text-gray-700"}`}>
              {STATUS_LABEL[bookingStatus] || bookingStatus}
            </span>
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${PAYMENT_STYLES[paymentStatus] || "bg-gray-100 text-gray-700"}`}>
              Payment: {paymentStatus}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── LEFT ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Equipment Info */}
            <div className="bg-white rounded-2xl border border-[#E0D0BC] shadow-sm p-6">
              <h2 className="text-xl font-extrabold text-[#1A0E05] mb-5 flex items-center gap-2">
                <Tractor className="w-5 h-5 text-[#4A2E15]" />
                Equipment Information
              </h2>
              <div className="flex gap-5">
                {/* Thumbnail */}
                <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-[#F5EDD8] border border-[#E0D0BC]">
                  {equipment?.image ? (
                    <img src={equipment.image} alt={equipment.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#C9A96E]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
                        <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5"/>
                        <path d="M21 15l-5-5L5 21" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-[#1A0E05] text-xl mb-2">{equipment?.name}</h3>
                  <div className="space-y-1.5 text-base text-[#3A2010]/80 font-medium mb-3">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-[#4A2E15]" />
                      <span>₹{equipment?.price}/{equipment?.pricingType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#4A2E15]" />
                      <span>Duration: {data.duration} hrs</span>
                    </div>
                  </div>

                  {/* Features — always shown, message if empty */}
                  <div>
                    <p className="text-sm font-bold text-[#1A0E05] mb-2">Features:</p>
                    {features.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {features.map((f: string, i: number) => (
                          <span key={i} className="text-xs font-semibold border border-[#D9CBBA] bg-[#FDF6E3] text-[#3A2010] px-3 py-1 rounded-full">
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#5C3D1E]/50">No features listed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="bg-white rounded-2xl border border-[#E0D0BC] shadow-sm p-6">
              <h2 className="text-xl font-extrabold text-[#1A0E05] mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#4A2E15]" />
                Booking Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { icon: Calendar, label: "Service Date", value: data.date },
                  { icon: Clock,    label: "Time",         value: formatTime(data.startTime) },
                  { icon: MapPin,   label: "Location",     value: equipment?.location },
                  { icon: Calendar, label: "Booked On",    value: new Date(data.createdAt).toLocaleDateString("en-IN",{ day:"numeric", month:"short", year:"numeric" }) },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 text-[#4A2E15] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[#5C3D1E]/65">{item.label}</p>
                      <p className="font-bold text-[#1A0E05] text-base mt-0.5">{item.value || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner — name + rating (from equipment.rating) + Call Owner + divider + Contact Number */}
            <div className="bg-white rounded-2xl border border-[#E0D0BC] shadow-sm p-6">
              <h2 className="text-xl font-extrabold text-[#1A0E05] mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-[#4A2E15]" />
                Equipment Owner
              </h2>

              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-extrabold text-[#1A0E05] text-lg">{data.owner?.name}</p>
                  {/* Rating pulled from equipment, not owner */}
                  {equipmentRating != null && equipmentRating > 0 && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-4 h-4 fill-[#E6A817] text-[#E6A817]" />
                      <span className="font-bold text-[#1A0E05] text-sm">{equipmentRating}</span>
                      <span className="text-sm text-[#5C3D1E]/65 font-medium">/5</span>
                    </div>
                  )}
                </div>
                {data.owner?.phone && (
                  <a
                    href={`tel:${data.owner.phone}`}
                    className="inline-flex items-center gap-2 border-2 border-[#D9CBBA] bg-[#FDF6E3] hover:bg-[#F5EDD8] text-[#2C1A0E] font-bold text-sm px-5 py-2.5 rounded-xl transition-all flex-shrink-0"
                  >
                    <Phone className="w-4 h-4" />
                    Call Owner
                  </a>
                )}
              </div>

              {/* Divider + Contact Number — always shown if phone exists */}
              {data.owner?.phone && (
                <div className="border-t border-[#EDE3D0] pt-4">
                  <p className="text-sm font-semibold text-[#5C3D1E]/65 mb-1">Contact Number</p>
                  <p className="font-bold text-[#1A0E05] text-base">{data.owner.phone}</p>
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-5">

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl border border-[#E0D0BC] shadow-sm p-6">
              <h2 className="text-xl font-extrabold text-[#1A0E05] mb-5 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-[#4A2E15]" />
                Payment Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-[#5C3D1E]/80">Rate</span>
                  <span className="font-bold text-[#1A0E05]">₹{equipment?.price}/{equipment?.pricingType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-[#5C3D1E]/80">Duration</span>
                  <span className="font-bold text-[#1A0E05]">{data.duration} hrs</span>
                </div>
                {data.paymentMethod && (
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-[#5C3D1E]/80">Payment method</span>
                    <span className="font-bold text-[#1A0E05] capitalize">{data.paymentMethod}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#EDE3D0] flex justify-between items-center">
                  <span className="font-extrabold text-[#1A0E05] text-base">Total Amount</span>
                  <span className="text-2xl font-extrabold text-[#4A2E15]">₹{data.totalPrice}</span>
                </div>
                <div className={`w-full text-center text-sm font-bold py-2.5 rounded-full flex items-center justify-center gap-2 ${PAYMENT_STYLES[paymentStatus] || "bg-gray-100 text-gray-700"}`}>
                  <CheckCircle className="w-4 h-4" />
                  Payment {paymentStatus}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-[#E0D0BC] shadow-sm p-6">
              <h2 className="text-xl font-extrabold text-[#1A0E05] mb-4">Actions</h2>
              <div className="space-y-3">

                {data.owner?.phone && (
                  <a
                    href={`tel:${data.owner.phone}`}
                    className="w-full flex items-center justify-center gap-2 border-2 border-[#D9CBBA] bg-[#FDF6E3] hover:bg-[#F5EDD8] text-[#2C1A0E] font-bold text-sm py-3.5 rounded-xl transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    Contact Owner
                  </a>
                )}

                {/* Cancel button — always shown when cancellable */}
                <button
  onClick={() => canCancel && setShowCancel(true)}
  disabled={!canCancel}
  className={`w-full flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-xl transition-all
    ${
      canCancel
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
>
  <XCircle className="w-4 h-4" />
  Cancel Booking
</button>

              </div>
            </div>

            {/* Help */}
            <div className="bg-gradient-to-br from-[#FDF6E3] to-[#F0E4CC] rounded-2xl border border-[#D9CBBA] p-6">
              <h3 className="font-extrabold text-[#1A0E05] text-lg mb-1">Need Help?</h3>
              <p className="text-sm font-medium text-[#5C3D1E]/70 mb-4">
                Contact our support team for any assistance.
              </p>
              <button className="w-full border-2 border-[#D9CBBA] bg-white hover:bg-[#F5EDD8] text-[#2C1A0E] font-bold text-sm py-3 rounded-xl transition-all">
                Contact Support
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── CANCEL MODAL — matches Figma exactly ── */}
      {showCancel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] px-4">
          <div className="bg-[#FDF6E3] rounded-2xl w-full max-w-md shadow-2xl p-7">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-extrabold text-[#1A0E05]">Cancel Booking</h2>
              <button
                onClick={() => setShowCancel(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5D5B5] transition text-[#5C3D1E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-base text-[#3A2010]/80 font-medium mb-5">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>

            {/* Reason textarea */}
            <div className="mb-6">
              <p className="text-sm font-bold text-[#1A0E05] mb-2">
                Reason for cancellation (optional)
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason..."
                rows={3}
                className="w-full bg-white border-2 border-[#E6A817]/60 focus:border-[#E6A817] rounded-xl px-4 py-3 text-sm text-[#1A0E05] placeholder-[#5C3D1E]/40 outline-none transition resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancel(false)}
                className="flex-1 border-2 border-[#D9CBBA] bg-white hover:bg-[#F5EDD8] text-[#1A0E05] font-bold py-3.5 rounded-xl transition-all"
              >
                Keep Booking
              </button>
              <button
                onClick={cancelBooking}
                disabled={cancelling}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}