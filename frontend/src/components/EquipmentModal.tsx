// src/components/EquipmentModal.tsx

import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import Portal from "./Portal";

const API = import.meta.env.VITE_API_URL;
const CATEGORIES = ["tractor","rotavator","cultivator","seed_drill","trolley","harvester","sprayer","thresher"];
const fmt = (c: string) => c.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const inputCls = "w-full bg-white border border-[#D9CBBA] rounded-xl px-4 py-3 text-sm text-[#1A0E05] placeholder-[#5C3D1E]/40 outline-none focus:border-[#4A2E15] focus:ring-2 focus:ring-[#4A2E15]/10 transition";

export default function EquipmentModal({ open, onClose, initialData, refresh }: any) {
  const [form, setForm] = useState({ name:"", category:"", price:"", pricingType:"acre", location:"", availability:"", description:"", features:"", image:"" });

  // ── BACKEND LOGIC UNTOUCHED ──
  useEffect(() => {
    if (initialData) {
      setForm({ name:initialData.name||"", category:initialData.category||"", price:initialData.price||"", pricingType:initialData.pricingType||"acre", location:initialData.location||"", availability:initialData.availability||"", description:initialData.description||"", features:initialData.features?.join(", ")||"", image:initialData.image||"" });
    } else {
      setForm({ name:"", category:"", price:"", pricingType:"acre", location:"", availability:"", description:"", features:"", image:"" });
    }
  }, [initialData, open]);

  if (!open) return null;

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price || !form.location) { toast.error("Please fill all required fields"); return; }
    try {
      const method = initialData ? "PATCH" : "POST";
      const url = initialData ? `${API}/equipment/${initialData._id}` : `${API}/equipment`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ name:form.name, category:form.category, price:Number(form.price), pricingType:form.pricingType, location:form.location, availability:form.availability, description:form.description, image:form.image, features:form.features.split(",").map((f:string)=>f.trim()).filter(Boolean) })
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Something went wrong"); return; }
      toast.success(initialData ? "Equipment updated!" : "Equipment added!");
      refresh(); onClose();
    } catch { toast.error("Request failed"); }
  };

  return (
    <Portal>
      <div style={{ position:"fixed", inset:0, zIndex:99999 }} className="bg-black/50 flex items-center justify-center px-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="bg-[#FDF6E3] rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">

          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E5D5B5]">
            <h2 className="text-xl font-extrabold text-[#1A0E05]">{initialData ? "Edit Equipment" : "Add Equipment"}</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5D5B5] transition text-[#5C3D1E]"><X className="w-5 h-5" /></button>
          </div>

          <div className="px-6 py-5 space-y-5">

            <div>
              <label className="block text-sm font-bold text-[#1A0E05] mb-1.5">Equipment Name <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Mahindra Tractor" className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A0E05] mb-1.5">Equipment Type <span className="text-red-500">*</span></label>
              <div className="relative">
                <select value={form.category} onChange={e=>set("category",e.target.value)} className={`${inputCls} appearance-none pr-10 cursor-pointer`}>
                  <option value="">Select equipment type</option>
                  {CATEGORIES.map(c=><option key={c} value={c}>{fmt(c)}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C3D1E]/50 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#1A0E05] mb-1.5">Price <span className="text-red-500">*</span></label>
                <input value={form.price} onChange={e=>set("price",e.target.value)} placeholder="800" type="number" min="0" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A0E05] mb-1.5">Pricing Type</label>
                <div className="relative">
                  <select value={form.pricingType} onChange={e=>set("pricingType",e.target.value)} className={`${inputCls} appearance-none pr-10 cursor-pointer`}>
                    <option value="acre">Per Acre</option>
                    <option value="hour">Per Hour</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C3D1E]/50 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A0E05] mb-1.5">Location <span className="text-red-500">*</span></label>
              <input value={form.location} onChange={e=>set("location",e.target.value)} placeholder="Village Rampur, Punjab" className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A0E05] mb-1.5">Availability</label>
              <input value={form.availability} onChange={e=>set("availability",e.target.value)} placeholder="Available from tomorrow" className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A0E05] mb-1.5">Description</label>
              <textarea value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Describe your equipment, its condition, and any special features..." rows={3} className={`${inputCls} resize-none`} />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A0E05] mb-1.5">Features (comma-separated)</label>
              <textarea value={form.features} onChange={e=>set("features",e.target.value)} placeholder="50 HP Power, 4-Wheel Drive, Air-conditioned Cabin" rows={2} className={`${inputCls} resize-none`} />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A0E05] mb-1.5">Image URL</label>
              <input value={form.image} onChange={e=>set("image",e.target.value)} placeholder="https://..." className={inputCls} />
              {form.image && (
                <div className="mt-2 w-full h-28 rounded-xl overflow-hidden border border-[#E0D0BC]">
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={e=>(e.currentTarget.style.display="none")} />
                </div>
              )}
            </div>

            <button onClick={handleSubmit} className="w-full bg-[#4A2E15] hover:bg-[#3A2010] text-white font-extrabold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
              {initialData ? "Update Equipment" : "Submit"}
            </button>

          </div>
        </div>
      </div>
    </Portal>
  );
}