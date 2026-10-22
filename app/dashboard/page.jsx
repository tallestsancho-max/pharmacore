"use client";

import React from 'react';
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from 'next/navigation';
import { 
  Pill, Activity, LayoutDashboard, ShieldCheck, 
  User, IdCard, Mail, Clock, ArrowRight, 
  ExternalLink, BarChart3, PackagePlus, Users, Settings2
} from "lucide-react";

export default function CoreDashboardPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  // 1. CRITICAL: Stop all execution while loading is TRUE
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <p className="text-xs text-slate-500 font-medium animate-pulse">Syncing session data parameters...</p>
      </div>
    );
  }

  // 2. ONLY redirect if loading is finished AND no user profile is active
  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/auth/login");
    }
    return null;
  }

  // Helper flags for access management
  const isStaff = profile?.role !== "Student Operations";
  const accountIdentifier = profile?.fullName || user.email.split('@')[0];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-800">
      
      {/* SECTION 1: SYSTEM WELCOME BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-blue-600 uppercase">
              <ShieldCheck size={12} /> {profile?.role || "Standard Security Node"}
            </div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl mt-0.5">
              Welcome Back, {accountIdentifier}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              PharmaCore control workspace engine initialized for active operation metrics.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => router.push("/")}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            Terminal Home <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* SECTION 2: DYNAMIC CONTEXTUAL CARDS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Matrix: Metadata Coordinates */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4 lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            Institutional Profile Matrix
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs">
              <User className="text-slate-400 shrink-0" size={16} />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase leading-none">Legal Designation</p>
                <p className="font-semibold text-slate-800 mt-1">{profile?.fullName || "Not Configured"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <IdCard className="text-slate-400 shrink-0" size={16} />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase leading-none">
                  {isStaff ? "Staff Assignment ID" : "University Matric Number"}
                </p>
                <p className="font-mono font-medium text-slate-700 mt-1">
                  {profile?.staffId || profile?.matricNumber || "UNASSIGNED"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Mail className="text-slate-400 shrink-0" size={16} />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase leading-none">Secure Coordinates</p>
                <p className="text-slate-700 font-medium mt-1 break-all">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs border-t border-slate-100 pt-3">
              <Clock className="text-slate-400 shrink-0" size={16} />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase leading-none">Session Activation</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  {/* FIXED: Optional chaining (?.) added below to safely wait for firebase properties */}
                  {user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : "Active Now"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Matrix: Functional Command Spaces (Changes dynamically based on role) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4 lg:col-span-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            Operational Quick Action Array
          </h3>

          {isStaff ? (
            /* Staff View Actions Array */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
              <button 
                onClick={() => router.push("/dashboard/drugs")}
                className="group border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 text-left p-4 rounded-xl transition flex flex-col justify-between"
              >
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center transition group-hover:bg-blue-600 group-hover:text-white mb-4">
                  <Pill size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    Manage Drug Registries <ArrowRight className="opacity-0 group-hover:opacity-100 transition translate-x-[-4px] group-hover:translate-x-0" size={14} />
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">Audit active formulary nodes, adjust stock arrays, and configure catalog profiles.</p>
                </div>
              </button>

              {/* FIXED: Added working navigation hook link to direct users to your restock page schema */}
              <button 
                onClick={() => router.push("/restock")}
                className="group border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left p-4 rounded-xl transition flex flex-col justify-between"
              >
                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center transition group-hover:bg-emerald-600 group-hover:text-white mb-4">
                  <PackagePlus size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    Procure Stock Ledger <ArrowRight className="opacity-0 group-hover:opacity-100 transition translate-x-[-4px] group-hover:translate-x-0" size={14} />
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">Provision batch volumes, log manufacturing inputs, and trace transit operations.</p>
                </div>
              </button>
            </div>
          ) : (
            /* Student Operations Action Array */
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center space-y-2">
                <p className="text-xs text-slate-600 font-medium">
                  👋 Hello Student! Your account has read-only access clearance vectors for dispensary data arrays.
                </p>
                <p className="text-[11px] text-slate-400">
                  To modify registries or append prescription nodes, please route a permission override token code through your clinical pharmacy supervisor.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 border border-slate-100 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition" onClick={() => router.push("/dashboard/drugs")}>
                  <BarChart3 className="text-blue-500" size={18} />
                  <span className="text-xs font-semibold text-slate-700">Browse Global Formulary</span>
                </div>
                <div className="p-3 border border-slate-100 rounded-xl flex items-center gap-3">
                  <Users className="text-purple-500" size={18} />
                  <span className="text-xs font-semibold text-slate-700">Contact Supervisor Desk</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
