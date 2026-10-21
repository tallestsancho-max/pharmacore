"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Pill, LogOut, User, ShieldCheck, Mail, ChevronDown, UserCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider"; 
import { getAuth, signOut } from "firebase/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth(); 
  const auth = getAuth();

  // Dropdown visibility matrix toggle state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the menu if clicked outside of the dashboard dropdown container
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logging out safely
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      window.location.reload(); 
    } catch (error) {
      console.error("Sign out process encountered an error:", error);
    }
  };

  // Base constant configuration navigation links
  const baseLinks = [
    { label: "Home", href: "/" },
    { label: "Manage Drugs", href: "/drugs" },
    { label: "Stock Control", href: "/stock" },
    { label: "Expiry Alerts", href: "/expiry" },
    { label: "Reports", href: "/reports" },
    { label: "Add Drugs", href: "/drug" },
    { label: "Restock", href: "/restock" },
    { label: "Checkout", href: "/checkout" },
  ];

  // Resolve user details layout profiles
  const userDisplayName = profile?.fullName || user?.email?.split('@')[0] || "Operator";
  const userIdentifier = profile?.fullName || user?.email || "";
  const initialLetter = userIdentifier.charAt(0).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center relative">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-800 text-lg shrink-0">
          <Pill className="text-blue-600" size={20} />
          <span>PharmaCore</span>
        </Link>

        {/* Regular Nav Links + Dynamic Auth Items */}
        <div className="flex items-center gap-2">
          {baseLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* DYNAMIC ACTIONS VECTOR BLOCK */}
          {user ? (
            <div className="relative border-l border-slate-200 pl-2 ml-1" ref={dropdownRef}>
              
              {/* TRIGGER BUTTON: COMBINES THE ROUND PROFILE BADGE + DROPDOWN CARAT */}
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 focus:outline-none group p-1 hover:bg-slate-50 rounded-xl transition"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center font-bold text-sm tracking-wide shadow-inner transition select-none">
                  {initialLetter || "?"}
                </div>
                <ChevronDown size={14} className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN USER INTERFACE EXPANSION PANEL */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 px-4 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  {/* Header Segment: Live Account Profile Array Display */}
                  <div className="border-b border-slate-100 pb-3 mb-2 flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                      <UserCircle size={24} />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{userDisplayName}</h4>
                      <p className="text-[10px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider inline-flex items-center gap-1 mt-1">
                        <ShieldCheck size={10} /> {profile?.role || "Standard Operator"}
                      </p>
                    </div>
                  </div>

                  {/* Core Content Body Meta Identifiers */}
                  <div className="space-y-2 py-1 text-xs text-slate-600 border-b border-slate-100 pb-3 mb-2">
                    <div className="flex items-center gap-2.5 truncate" title={user.email}>
                      <Mail size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <User size={14} className="text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                        ID: {profile?.staffId || profile?.matricNumber || "Unassigned Matrix"}
                      </span>
                    </div>
                  </div>

                  {/* Quick Functional Command Links */}
                  <div className="flex flex-col gap-1 text-xs">
                    <button 
                      onClick={() => { setDropdownOpen(false); router.push("/dashboard"); }}
                      className="w-full text-left font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-2.5 py-2 rounded-lg transition"
                    >
                      View Full Profile
                    </button>
                    
                    <button 
                      onClick={() => { setDropdownOpen(false); router.push("/auth/login"); }}
                      className="w-full text-left font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 px-2.5 py-2 rounded-lg transition border-t border-dashed border-slate-100 mt-0.5 pt-2"
                    >
                      Switch Operational Account
                    </button>
                    
                    <button 
                      onClick={handleLogOut}
                      className="w-full text-left font-semibold text-rose-600 hover:bg-rose-50 px-2.5 py-2 rounded-lg transition flex items-center gap-1.5 mt-1"
                    >
                      <LogOut size={13} /> Secure Log Out
                    </button>
                  </div>

                </div>
              )}

            </div>
          ) : (
            /* Guest layout strings visible if profile state is unauthenticated */
            <>
              <Link
                href="/auth/login"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === "/auth/login" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Login
              </Link>
              <Link
                href="/auth/signin"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === "/auth/signin" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
              >
                Sign In
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
