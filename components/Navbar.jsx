"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider"; // Keeps track of login status
import { Pill, Menu, X, LogOut, LayoutDashboard, Database, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth(); // Destructure authentication configurations
  const [isOpen, setIsOpen] = useState(false); // Mobile collapse toggle matrix state

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        
        {/* Brand Identity Branding Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Pill size={18} />
          </div>
          <span>PharmaCore</span>
        </Link>

        {/* --- DESKTOP NAVIGATION LAYOUT (Hidden on mobile screens) --- */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link href="/drugs" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                <Database size={16} /> Registry
              </Link>
              <Link href="/profile" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                <User size={16} /> Profile
              </Link>
              <button 
                onClick={logout}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-all"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-blue-600 transition-colors">Login</Link>
              <Link href="/auth/signin" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm">
                Register
              </Link>
            </>
          )}
        </div>

        {/* --- MOBILE HAMBURGER BUTTON TRIGER (Visible only on mobile screens) --- */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE EXPANDABLE DRAWER SCREEN LAYER --- */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-4 space-y-3 text-sm font-medium text-slate-700">
            {user ? (
              <>
                <Link 
                  href="/dashboard" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link 
                  href="/drugs" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Database size={18} /> Inventory Registry
                </Link>
                <Link 
                  href="/profile" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <User size={18} /> User Profile
                </Link>
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left font-medium border border-transparent border-t-slate-100 mt-2 pt-3"
                >
                  <LogOut size={18} /> Disconnect Account
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" onClick={() => setIsOpen(false)}
                  className="w-full text-center p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Sign In Gateway
                </Link>
                <Link 
                  href="/auth/signin" onClick={() => setIsOpen(false)}
                  className="w-full text-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                >
                  Register Coordinates
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
