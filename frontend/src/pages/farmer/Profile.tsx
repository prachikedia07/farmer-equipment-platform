// src/pages/farmer/FarmerProfile.tsx

import { useEffect, useState } from "react";
import { User, Phone, Mail, MapPin, Pencil, Save, X, Tractor, Calendar, Eye, EyeOff, Trash2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Portal from "../../components/Portal";

const API = "http://localhost:5000/api";

export default function FarmerProfile() {
  const { updateUser, logout } = useAuth();
  const [data,     setData]     = useState<any>(null);
  const [original, setOriginal] = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [farmerStats, setFarmerStats] = useState({ total: 0, completed: 0, pending: 0 });

  const [pwModal,  setPwModal]  = useState(false);
  const [pwForm,   setPwForm]   = useState({ current: "", newPw: "", confirm: "" });
  const [showPw,   setShowPw]   = useState({ current: false, newPw: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);

  const [delModal,   setDelModal]   = useState(false);
  const [delConfirm, setDelConfirm] = useState("");
  const [deleting,   setDeleting]   = useState(false);

  // ── FETCH UNTOUCHED ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAll = async () => {
      try {
        const [profileRes, bRes] = await Promise.all([
          fetch(`${API}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/bookings/my`,  { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const profile = await profileRes.json();
        const b       = await bRes.json();
        setData(profile); setOriginal(profile);
        if (Array.isArray(b)) {
          setFarmerStats({
            total:     b.length,
            completed: b.filter((x: any) => x.status === "completed").length,
            pending:   b.filter((x: any) => x.status === "pending").length,
          });
        }
      } catch { toast.error("Failed to load profile"); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  // ── UPDATE UNTOUCHED ──
  const updateProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message);
      updateUser(resData); setOriginal(resData); setEditing(false);
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  const cancelEdit = () => { setData(original); setEditing(false); };

  // ── PASSWORD CHANGE ──
  const changePassword = async () => {
    if (!pwForm.current || !pwForm.newPw) { toast.error("Please fill all fields"); return; }
    if (pwForm.newPw !== pwForm.confirm)  { toast.error("Passwords don't match"); return; }
    if (pwForm.newPw.length < 6)          { toast.error("Min 6 characters"); return; }
    setPwSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/auth/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message);
      toast.success("Password changed!"); setPwModal(false); setPwForm({ current: "", newPw: "", confirm: "" });
    } catch (err: any) { toast.error(err.message || "Failed"); }
    finally { setPwSaving(false); }
  };

  // ── DELETE ACCOUNT ──
  const deleteAccount = async () => {
    if (delConfirm !== "DELETE") { toast.error('Type "DELETE" to confirm'); return; }
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/auth/account`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      toast.success("Account deleted"); logout();
    } catch { toast.error("Failed to delete account"); }
    finally { setDeleting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center">
      <svg className="animate-spin w-9 h-9 text-[#4A2E15]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  );

  const initials = data?.name?.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase() || "F";

  const inputClass = (disabled: boolean) =>
    `w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition border
    ${disabled
      ? "bg-[#F8F4EE] border-transparent text-[#1A0E05] cursor-default"
      : "bg-white border-[#D9CBBA] text-[#1A0E05] focus:border-[#4A2E15] focus:ring-2 focus:ring-[#4A2E15]/10"
    }`;

  return (
    <div className="min-h-screen bg-[#FDF6E3] py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── COVER + AVATAR CARD — full width, matches screenshot ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E8DCC8] overflow-hidden">
          {/* Cover band */}
          <div className="h-36 bg-gradient-to-br from-[#3A2010] via-[#4A2E15] to-[#2C1A0E] relative">
            {/* Dot pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dp" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="1.5" fill="#E6A817"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dp)"/>
            </svg>
            {/* Role badge */}
            <span className="absolute top-4 right-5 text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(230,168,23,0.18)", border: "1px solid rgba(230,168,23,0.5)", color: "#E6A817" }}>
              Farmer
            </span>
          </div>

          {/* Avatar overlapping + info */}
          <div className="px-6 pb-6">
            <div className="flex items-start justify-between" style={{ marginTop: "-28px" }}>
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A2E15] to-[#2C1A0E] flex items-center justify-center shadow-lg border-[3px] border-white flex-shrink-0">
                <span className="text-xl font-extrabold text-[#E6A817]">{initials}</span>
              </div>
              {/* Edit / Save buttons */}
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="mt-6 inline-flex items-center gap-1.5 border-2 border-[#E0D0BC] bg-white hover:bg-[#F5EDD8] text-[#2C1A0E] font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-sm">
                  <Pencil className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <div className="mt-6 flex gap-2">
                  <button onClick={cancelEdit} className="inline-flex items-center gap-1 border-2 border-[#E0D0BC] bg-white text-[#5C3D1E] font-bold text-sm px-3 py-2 rounded-xl hover:bg-[#F5EDD8] transition-all">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={updateProfile} disabled={saving}
                    className="inline-flex items-center gap-1 bg-[#4A2E15] hover:bg-[#3A2010] disabled:opacity-60 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-md">
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
            <div className="mt-3">
              <h1 className="text-xl font-extrabold text-[#1A0E05]">{data?.name}</h1>
              <span className="inline-block mt-1.5 bg-[#4A2E15] text-white text-xs font-bold px-3 py-1 rounded-full">Farmer</span>
            </div>
          </div>
        </div>

        {/* ── STATS — 3 cols with subtle colors matching screenshot ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-[#E8DCC8] p-5 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-[#4A2E15]">{farmerStats.total}</p>
            <p className="text-sm text-[#5C3D1E]/65 font-medium mt-0.5">Total</p>
          </div>
          <div className="rounded-2xl border border-green-100 p-5 text-center shadow-sm" style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)" }}>
            <p className="text-2xl font-extrabold text-green-700">{farmerStats.completed}</p>
            <p className="text-sm text-green-600/75 font-medium mt-0.5">Completed</p>
          </div>
          <div className="rounded-2xl border border-amber-100 p-5 text-center shadow-sm" style={{ background: "linear-gradient(135deg,#fffbeb,#fef3c7)" }}>
            <p className="text-2xl font-extrabold text-amber-600">{farmerStats.pending}</p>
            <p className="text-sm text-amber-600/75 font-medium mt-0.5">Pending</p>
          </div>
        </div>

        {/* ── PERSONAL INFORMATION ── */}
        <div className="bg-white rounded-2xl border border-[#E8DCC8] shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-[#1A0E05] mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-[#4A2E15]" /> Personal Information
          </h2>
          <div className="space-y-4">
            {[
              { icon: User,   label: "Full Name",     key: "name",     placeholder: "Your full name"         },
              { icon: Phone,  label: "Phone Number",  key: "phone",    placeholder: "+91 9876543210"         },
              { icon: Mail,   label: "Email Address", key: "email",    placeholder: "you@example.com"        },
              { icon: MapPin, label: "Location",      key: "location", placeholder: "Village Rampur, Punjab" },
            ].map(f => (
              <div key={f.key}>
                <label className="flex items-center gap-1.5 text-sm font-bold text-[#3A2010] mb-1.5">
                  <f.icon className="w-4 h-4 text-[#4A2E15]/55" /> {f.label}
                  {f.key === "location" && <span className="text-xs font-normal text-[#5C3D1E]/45 ml-1">(optional)</span>}
                </label>
                {editing
                  ? <input value={data?.[f.key] || ""} onChange={e => setData({...data, [f.key]: e.target.value})} placeholder={f.placeholder} className={inputClass(false)} />
                  : <div className={inputClass(true)}>{data?.[f.key] || <span className="text-[#5C3D1E]/35">{f.placeholder}</span>}</div>
                }
              </div>
            ))}
          </div>
        </div>

        {/* ── SECURITY ── */}
        <div className="bg-white rounded-2xl border border-[#E8DCC8] shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-[#1A0E05] mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#4A2E15]" /> Security
          </h2>
          <div className="space-y-3">
            <button onClick={() => setPwModal(true)}
              className="w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 border-[#E8DCC8] hover:bg-[#FDF6E3] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#1A0E05]">Change Password</p>
                  <p className="text-xs text-[#5C3D1E]/55 mt-0.5">Update your account password</p>
                </div>
              </div>
              <span className="text-sm font-bold text-[#4A2E15]">→</span>
            </button>
            <button onClick={() => setDelModal(true)}
              className="w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 border-red-100 hover:bg-red-50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-red-600">Delete Account</p>
                  <p className="text-xs text-red-400/80 mt-0.5">Permanently remove your account</p>
                </div>
              </div>
              <span className="text-sm font-bold text-red-500">→</span>
            </button>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="grid grid-cols-2 gap-3">
          <a href="/equipment" className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-[#E8DCC8] bg-white hover:bg-[#FDF6E3] hover:border-[#C9A96E] transition-all text-center group">
            <Tractor className="w-7 h-7 text-[#4A2E15]/35 group-hover:text-[#4A2E15] transition-colors" />
            <span className="text-sm font-bold text-[#2C1A0E]">Browse Equipment</span>
          </a>
          <a href="/farmer/dashboard" className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-[#E8DCC8] bg-white hover:bg-[#FDF6E3] hover:border-[#C9A96E] transition-all text-center group">
            <Calendar className="w-7 h-7 text-[#4A2E15]/35 group-hover:text-[#4A2E15] transition-colors" />
            <span className="text-sm font-bold text-[#2C1A0E]">My Bookings</span>
          </a>
        </div>

      </div>

      {/* CHANGE PASSWORD MODAL */}
      {pwModal && (
        <Portal>
          <div style={{ position:"fixed", inset:0, zIndex:99999 }} className="bg-black/50 flex items-center justify-center px-4"
            onClick={e => { if (e.target === e.currentTarget) setPwModal(false); }}>
            <div className="bg-[#FDF6E3] rounded-2xl w-full max-w-md shadow-2xl p-7">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-extrabold text-[#1A0E05]">Change Password</h2>
                <button onClick={() => setPwModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5D5B5] transition">
                  <X className="w-5 h-5 text-[#5C3D1E]" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Current Password", key: "current", show: showPw.current, toggle: () => setShowPw(p => ({...p, current: !p.current})) },
                  { label: "New Password",     key: "newPw",   show: showPw.newPw,   toggle: () => setShowPw(p => ({...p, newPw:   !p.newPw  })) },
                  { label: "Confirm Password", key: "confirm", show: showPw.confirm, toggle: () => setShowPw(p => ({...p, confirm: !p.confirm})) },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-bold text-[#1A0E05] mb-1.5">{f.label}</label>
                    <div className="relative">
                      <input type={f.show ? "text" : "password"} value={(pwForm as any)[f.key]}
                        onChange={e => setPwForm(p => ({...p, [f.key]: e.target.value}))}
                        placeholder="••••••••"
                        className="w-full bg-white border border-[#D9CBBA] rounded-xl px-4 py-3 pr-11 text-sm text-[#1A0E05] outline-none focus:border-[#4A2E15] focus:ring-2 focus:ring-[#4A2E15]/10 transition" />
                      <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C3D1E]/50 hover:text-[#1A0E05] transition">
                        {f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={changePassword} disabled={pwSaving}
                className="w-full mt-5 bg-[#4A2E15] hover:bg-[#3A2010] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all">
                {pwSaving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </Portal>
      )}

      {/* DELETE ACCOUNT MODAL */}
      {delModal && (
        <Portal>
          <div style={{ position:"fixed", inset:0, zIndex:99999 }} className="bg-black/60 flex items-center justify-center px-4"
            onClick={e => { if (e.target === e.currentTarget) setDelModal(false); }}>
            <div className="bg-[#FDF6E3] rounded-2xl w-full max-w-md shadow-2xl p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-red-700">Delete Account</h2>
                <button onClick={() => setDelModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5D5B5] transition">
                  <X className="w-5 h-5 text-[#5C3D1E]" />
                </button>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                <p className="text-sm font-bold text-red-700 mb-1">⚠️ This action is permanent</p>
                <p className="text-sm text-red-600/80">All your bookings and account data will be deleted. This cannot be undone.</p>
              </div>
              <label className="block text-sm font-bold text-[#1A0E05] mb-2">
                Type <span className="text-red-600 font-extrabold">DELETE</span> to confirm
              </label>
              <input value={delConfirm} onChange={e => setDelConfirm(e.target.value)} placeholder="DELETE"
                className="w-full bg-white border-2 border-red-200 focus:border-red-400 rounded-xl px-4 py-3 text-sm text-[#1A0E05] outline-none transition mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setDelModal(false)} className="flex-1 border-2 border-[#D9CBBA] bg-white hover:bg-[#F5EDD8] text-[#1A0E05] font-bold py-3 rounded-xl transition-all">Cancel</button>
                <button onClick={deleteAccount} disabled={deleting || delConfirm !== "DELETE"}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all">
                  {deleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

    </div>
  );
}