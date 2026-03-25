// src/pages/owner/OwnerProfile.tsx

import { useEffect, useState } from "react";
import { User, Phone, Mail, MapPin, Pencil, Save, X, Tractor, IndianRupee, Eye, EyeOff, Trash2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Portal from "../../components/Portal";

const API = "http://localhost:5000/api";

export default function OwnerProfile() {
  const { updateUser, logout } = useAuth();
  const [data,     setData]     = useState<any>(null);
  const [original, setOriginal] = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [ownerStats, setOwnerStats] = useState({ equipment: 0, bookings: 0, earnings: 0 });

  // password change
  const [pwModal, setPwModal]       = useState(false);
  const [pwForm,  setPwForm]        = useState({ current: "", newPw: "", confirm: "" });
  const [showPw,  setShowPw]        = useState({ current: false, newPw: false, confirm: false });
  const [pwSaving, setPwSaving]     = useState(false);

  // delete account
  const [delModal, setDelModal]     = useState(false);
  const [delConfirm, setDelConfirm] = useState("");
  const [deleting, setDeleting]     = useState(false);

  // ── FETCH UNTOUCHED ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchAll = async () => {
      try {
        const [profileRes, eqRes, bRes] = await Promise.all([
          fetch(`${API}/auth/profile`,   { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/equipment/my`,   { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/bookings/owner`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const profile = await profileRes.json();
        const eq = await eqRes.json();
        const b  = await bRes.json();
        setData(profile); setOriginal(profile);
        if (Array.isArray(eq) && Array.isArray(b)) {
          setOwnerStats({
            equipment: eq.length,
            bookings:  b.length,
            earnings:  b.filter((x: any) => x.status === "completed").reduce((s: number, x: any) => s + (x.totalPrice || 0), 0),
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
      updateUser(resData);
      setOriginal(resData);
      setEditing(false);
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  const cancelEdit = () => { setData(original); setEditing(false); };

  // ── PASSWORD CHANGE (backend to be added) ──
  const changePassword = async () => {
    if (!pwForm.current || !pwForm.newPw) { toast.error("Please fill all fields"); return; }
    if (pwForm.newPw !== pwForm.confirm)  { toast.error("Passwords don't match"); return; }
    if (pwForm.newPw.length < 6)          { toast.error("Password must be at least 6 characters"); return; }
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
      toast.success("Password changed successfully!");
      setPwModal(false);
      setPwForm({ current: "", newPw: "", confirm: "" });
    } catch (err: any) { toast.error(err.message || "Failed to change password"); }
    finally { setPwSaving(false); }
  };

  // ── DELETE ACCOUNT (backend to be added) ──
  const deleteAccount = async () => {
    if (delConfirm !== "DELETE") { toast.error('Type "DELETE" to confirm'); return; }
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/auth/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("Account deleted");
      logout();
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

  const initials = data?.name?.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase() || "O";

  const inputClass = (disabled: boolean) =>
    `w-full rounded-xl px-4 py-3 text-sm font-medium outline-none transition
    ${disabled
      ? "bg-[#F5EDD8] border border-transparent text-[#1A0E05] cursor-default"
      : "bg-white border border-[#D9CBBA] text-[#1A0E05] focus:border-[#4A2E15] focus:ring-2 focus:ring-[#4A2E15]/10"
    }`;

  return (
    <div className="min-h-screen bg-[#FDF6E3] pb-16">
      <div className="max-w-2xl mx-auto px-4">

        {/* ── COVER + AVATAR CARD ── */}
        <div className="bg-white rounded-b-3xl shadow-sm border border-[#E0D0BC] border-t-0 overflow-visible mb-6">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-br from-[#4A2E15] via-[#3A2010] to-[#2C1A0E] relative rounded-t-3xl">
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%"><defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#E6A817"/></pattern></defs><rect width="100%" height="100%" fill="url(#dots)"/></svg>
            </div>
            {/* Role badge top right */}
            <span className="absolute top-4 right-4 bg-[#E6A817]/20 border border-[#E6A817]/40 text-[#E6A817] text-xs font-bold px-3 py-1 rounded-full">
              Equipment Owner
            </span>
          </div>

          {/* Avatar + info row */}
          <div className="px-6 pb-5">
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A2E15] to-[#2C1A0E] flex items-center justify-center shadow-lg border-2 border-white flex-shrink-0">
                <span className="text-xl font-extrabold text-[#E6A817]">{initials}</span>
              </div>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 border-2 border-[#E0D0BC] bg-white hover:bg-[#F5EDD8] text-[#2C1A0E] font-bold text-sm px-4 py-2 rounded-xl transition-all">
                  <Pencil className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={cancelEdit} className="inline-flex items-center gap-1.5 border-2 border-[#E0D0BC] bg-white text-[#5C3D1E] font-bold text-sm px-3 py-2 rounded-xl hover:bg-[#F5EDD8] transition-all">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={updateProfile} disabled={saving}
                    className="inline-flex items-center gap-1.5 bg-[#4A2E15] hover:bg-[#3A2010] disabled:opacity-60 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-md">
                    <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-xl font-extrabold text-[#1A0E05]">{data?.name}</h1>
            <span className="inline-block mt-1 bg-[#4A2E15] text-white text-xs font-bold px-3 py-1 rounded-full capitalize">{data?.role || "owner"}</span>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Equipment", value: ownerStats.equipment,  color: "from-amber-50   to-yellow-50",  border: "border-amber-100",  text: "text-amber-700"  },
            { label: "Bookings",  value: ownerStats.bookings,   color: "from-green-50   to-emerald-50", border: "border-green-100",  text: "text-green-700"  },
            { label: "Earned",    value: `₹${ownerStats.earnings.toLocaleString("en-IN")}`, color: "from-[#FDF6E3] to-[#F5EDD8]", border: "border-[#E0D0BC]", text: "text-[#4A2E15]" },
          ].map((s, i) => (
            <div key={i} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-4 text-center`}>
              <p className={`text-lg font-extrabold ${s.text}`}>{s.value}</p>
              <p className="text-xs font-semibold text-[#5C3D1E]/65 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── PERSONAL INFORMATION ── */}
        <div className="bg-white rounded-2xl border border-[#E0D0BC] shadow-sm p-6 mb-5">
          <h2 className="text-lg font-extrabold text-[#1A0E05] mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-[#4A2E15]" /> Personal Information
          </h2>
          <div className="space-y-4">
            {[
              { icon: User,  label: "Full Name",      key: "name",     placeholder: "Your full name"       },
              { icon: Phone, label: "Phone Number",   key: "phone",    placeholder: "+91 9876543210"       },
              { icon: Mail,  label: "Email Address",  key: "email",    placeholder: "you@example.com"      },
              { icon: MapPin,label: "Location",       key: "location", placeholder: "Village Rampur, Punjab" },
            ].map(f => (
              <div key={f.key}>
                <label className="flex items-center gap-1.5 text-sm font-bold text-[#1A0E05] mb-1.5">
                  <f.icon className="w-4 h-4 text-[#4A2E15]/60" /> {f.label}
                  {f.key === "location" && <span className="text-xs font-normal text-[#5C3D1E]/50">(optional)</span>}
                </label>
                {editing ? (
                  <input value={data?.[f.key] || ""} onChange={e => setData({...data, [f.key]: e.target.value})}
                    placeholder={f.placeholder} className={inputClass(false)} />
                ) : (
                  <p className={inputClass(true)}>{data?.[f.key] || <span className="text-[#5C3D1E]/40">{f.placeholder}</span>}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── SECURITY ── */}
        <div className="bg-white rounded-2xl border border-[#E0D0BC] shadow-sm p-6 mb-5">
          <h2 className="text-lg font-extrabold text-[#1A0E05] mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#4A2E15]" /> Security
          </h2>
          <div className="space-y-3">
            <button onClick={() => setPwModal(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-[#E0D0BC] hover:bg-[#FDF6E3] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-[#1A0E05]">Change Password</p>
                  <p className="text-xs text-[#5C3D1E]/55">Update your account password</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#4A2E15] group-hover:underline">Update →</span>
            </button>

            <button onClick={() => setDelModal(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-red-100 hover:bg-red-50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-red-600">Delete Account</p>
                  <p className="text-xs text-red-400">Permanently remove your account</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-red-500 group-hover:underline">Delete →</span>
            </button>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="grid grid-cols-2 gap-3">
          <a href="/owner/dashboard" className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-[#E0D0BC] bg-white hover:border-[#4A2E15]/30 hover:bg-[#FDF6E3] transition-all text-center group">
            <Tractor className="w-7 h-7 text-[#4A2E15]/40 group-hover:text-[#4A2E15] transition-colors" />
            <span className="text-sm font-bold text-[#2C1A0E]">My Equipment</span>
          </a>
          <a href="/owner/dashboard" className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-[#E0D0BC] bg-white hover:border-[#4A2E15]/30 hover:bg-[#FDF6E3] transition-all text-center group">
            <IndianRupee className="w-7 h-7 text-[#4A2E15]/40 group-hover:text-[#4A2E15] transition-colors" />
            <span className="text-sm font-bold text-[#2C1A0E]">Earnings</span>
          </a>
        </div>

      </div>

      {/* ── CHANGE PASSWORD MODAL ── */}
      {pwModal && (
        <Portal>
          <div style={{ position:"fixed", inset:0, zIndex:99999 }} className="bg-black/50 flex items-center justify-center px-4"
            onClick={e => { if (e.target === e.currentTarget) setPwModal(false); }}>
            <div className="bg-[#FDF6E3] rounded-2xl w-full max-w-md shadow-2xl p-7">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-extrabold text-[#1A0E05]">Change Password</h2>
                <button onClick={() => setPwModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5D5B5] transition text-[#5C3D1E]">
                  <X className="w-5 h-5" />
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

      {/* ── DELETE ACCOUNT MODAL ── */}
      {delModal && (
        <Portal>
          <div style={{ position:"fixed", inset:0, zIndex:99999 }} className="bg-black/60 flex items-center justify-center px-4"
            onClick={e => { if (e.target === e.currentTarget) setDelModal(false); }}>
            <div className="bg-[#FDF6E3] rounded-2xl w-full max-w-md shadow-2xl p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-red-700">Delete Account</h2>
                <button onClick={() => setDelModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E5D5B5] transition text-[#5C3D1E]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                <p className="text-sm font-bold text-red-700 mb-1">⚠️ This action is permanent</p>
                <p className="text-sm text-red-600">All your equipment listings, bookings, and data will be permanently deleted. This cannot be undone.</p>
              </div>
              <label className="block text-sm font-bold text-[#1A0E05] mb-2">
                Type <span className="font-extrabold text-red-600">DELETE</span> to confirm
              </label>
              <input value={delConfirm} onChange={e => setDelConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-white border-2 border-red-200 focus:border-red-400 rounded-xl px-4 py-3 text-sm text-[#1A0E05] outline-none transition mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setDelModal(false)} className="flex-1 border-2 border-[#D9CBBA] bg-white hover:bg-[#F5EDD8] text-[#1A0E05] font-bold py-3 rounded-xl transition-all">
                  Cancel
                </button>
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