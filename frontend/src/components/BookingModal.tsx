// src/components/BookingModal.tsx

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const API = "http://localhost:5000/api";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function BookingModal({ isOpen, onClose, equipmentId }: any) {
  const today = new Date();

  const [calYear, setCalYear]       = useState(today.getFullYear());
  const [calMonth, setCalMonth]     = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime]   = useState("08:00");
  const [duration, setDuration]     = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  if (!isOpen) return null;

  // ── Calendar helpers ──
  const daysInMonth  = getDaysInMonth(calYear, calMonth);
  const firstDaySlot = getFirstDayOfMonth(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const selectDay = (day: number) => {
    const d = `${calYear}-${String(calMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    setSelectedDate(d);
  };

  const isToday = (day: number) => {
    return calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();
  };
  const isPast = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    d.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  };
  const isSelected = (day: number) => {
    return selectedDate === `${calYear}-${String(calMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  };

  // ── BACKEND PAYLOAD UNTOUCHED ──
  const handleBooking = async () => {
    if (!selectedDate) { toast.error("Please select a date"); return; }
    try {
      const res = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          equipmentId,
          date: selectedDate,
          startTime,
          duration,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Booking successful 🎉");
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#FDF6E3] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold text-[#2C1A0E]">Booking Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5D5B5] transition text-[#5C3D1E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">

          {/* ── SELECT DATE ── */}
          <div>
            <p className="text-sm font-semibold text-[#2C1A0E] mb-3">Select Date</p>

            <div className="bg-white rounded-2xl border border-[#E5D5B5] p-4">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5D5B5] hover:bg-[#F5EDD8] transition"
                >
                  <ChevronLeft className="w-4 h-4 text-[#5C3D1E]" />
                </button>
                <span className="font-bold text-[#2C1A0E] text-sm">
                  {MONTHS[calMonth]} {calYear}
                </span>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5D5B5] hover:bg-[#F5EDD8] transition"
                >
                  <ChevronRight className="w-4 h-4 text-[#5C3D1E]" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-[#5C3D1E]/60 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-y-1">
                {/* Empty slots before first day */}
                {Array.from({ length: firstDaySlot }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const past = isPast(day);
                  const selected = isSelected(day);
                  const todayDay = isToday(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={past}
                      onClick={() => selectDay(day)}
                      className={`
                        h-9 w-full flex items-center justify-center rounded-xl text-sm font-medium transition-all
                        ${past ? "text-[#5C3D1E]/25 cursor-not-allowed" : "hover:bg-[#F5EDD8] cursor-pointer"}
                        ${selected ? "bg-[#E6A817] text-white hover:bg-[#D4981A]" : ""}
                        ${todayDay && !selected ? "border-2 border-[#E6A817] text-[#2C1A0E]" : ""}
                        ${!selected && !todayDay && !past ? "text-[#2C1A0E]" : ""}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── SELECT TIME ── */}
          <div>
            <p className="text-sm font-semibold text-[#2C1A0E] mb-2">Select Time</p>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-white border border-[#E5D5B5] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] outline-none focus:border-[#4A2E15] focus:ring-2 focus:ring-[#4A2E15]/10 transition"
            />
          </div>

          {/* ── DURATION ── */}
          <div>
            <p className="text-sm font-semibold text-[#2C1A0E] mb-2">Duration (hours)</p>
            <input
              type="number"
              min={1}
              max={24}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-white border border-[#E5D5B5] rounded-xl px-4 py-3 text-sm text-[#2C1A0E] outline-none focus:border-[#4A2E15] focus:ring-2 focus:ring-[#4A2E15]/10 transition"
            />
          </div>

          {/* ── PAYMENT METHOD ── */}
          <div>
            <p className="text-sm font-semibold text-[#2C1A0E] mb-3">Payment Method</p>
            <div className="space-y-2">
              {[
                { value: "upi",     label: "UPI" },
                { value: "cash",    label: "Cash After Work" },
                { value: "advance", label: "Advance Booking Fee" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div
                    onClick={() => setPaymentMethod(opt.value)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition
                      ${paymentMethod === opt.value
                        ? "border-[#4A2E15] bg-[#4A2E15]"
                        : "border-[#C9A96E] bg-white"
                      }`}
                  >
                    {paymentMethod === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-sm text-[#2C1A0E]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── SUBMIT ── */}
          <button
            onClick={handleBooking}
            className="w-full bg-[#4A2E15] hover:bg-[#3A2010] text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            Submit
          </button>

        </div>
      </div>
    </div>
  );
}