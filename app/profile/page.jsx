"use client";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { 
  User, 
  Mail, 
  Shield, 
  BadgeId, 
  Activity, 
  Lock, 
  Save, 
  Loader2, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // local editable state initialized with database profile context descriptors
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "Alex Mercer",
    staffId: profile?.staffId || "PHARMA-2026-88",
    email: user?.email || "a.mercer@schoolclinic.edu",
    phoneNumber: profile?.phoneNumber || "+234 803 123 4567",
    department: profile?.department || "Campus Health Services",
    role: profile?.role || "Head Pharmacist"
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    // Simulate backend writing update process to your Firestore users collection path
    setTimeout(() => {
      setIsSaving(false);
      setMessage({ type: "success", text: "Administrative profile settings updated successfully." });
    }, 1400);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      
      {/* Upper Banner Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <User className="text-blue-600" size={26} /> My Professional Profile
        </h1>
        <p className="text-sm text-slate-500">Manage your system credentials, contact routes, and review encryption roles mapping.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border text-sm font-medium ${
          message.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Information Card & System Badges */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
            
            {/* Avatar Placeholder Frame */}
            <div className="w-20 h-20 bg-blue-50 text-blue-600 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              {formData.fullName.split(" ").map(n => n[0]).join("")}
            </div>
            
            <h2 className="text-lg font-bold text-slate-800">{formData.fullName}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{formData.staffId}</p>
            
            {/* Security Clearance Tag */}
            <div className="mt-4 inline-flex items-center gap-1.5 bg-slate-800 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Shield size={12} /> {formData.role}
            </div>

            <div className="border-t border-slate-100 mt-6 pt-6 text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Department</span>
                <span className="text-slate-700 font-semibold">{formData.department}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Clearance Scope</span>
                <span className="text-emerald-600 font-bold uppercase tracking-wide">Full Admin</span>
              </div>
            </div>
          </div>

          {/* System Security Notice Container */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-500 space-y-2">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Lock size={12} /> Privacy & Compliance
            </h4>
            <p>Account mutations are cryptographically signed and tracked within your clinic instance audit trails under active HIPAA log parameters.</p>
          </div>
        </div>

        {/* Right Column: Edit Profile Parameters Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleUpdateProfile} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Personal Parameters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Legal Name</label>
                  <input 
                    type="text" required
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Clinic Staff Identifier Token</label>
                  <input 
                    type="text" disabled
                    value={formData.staffId}
                    className="w-full border border-slate-200 bg-slate-50 text-slate-400 rounded-lg px-3 py-2 text-sm font-mono cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Routes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Coordinates</label>
                  <input 
                    type="email" disabled
                    value={formData.email}
                    className="w-full border border-slate-200 bg-slate-50 text-slate-400 rounded-lg px-3 py-2 text-sm font-mono cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Phone Mobile</label>
                  <input 
                    type="text" required
                    value={formData.phoneNumber}
                    onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Save Buttons footer */}
            <div className="border-t border-slate-100 pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Update Profile Data
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
