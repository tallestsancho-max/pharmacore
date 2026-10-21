"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Pill, ShieldCheck, Activity } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function Footer() {
  const { user } = useAuth();
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    // Changed bg-white to a soft gray bg-slate-50, matching your layout background
    <footer className="w-full bg-slate-500 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-semibold text-slate-700 text-lg">
              {/* Changed logo container color to slate-200/60 and icon to slate-600 */}
              <span className="p-1.5 bg-slate-200/60 text-slate-600 rounded-lg">
                <Pill size={20} />
              </span>
              <span>PharmaCore</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Secure institutional pharmacy management software optimizing stock control and compliance.
            </p>
          </div>

          {/* Quick Actions Column */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Workspace Tools</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {/* Swapped text-blue-600 hover triggers to text-slate-800 for gray consistency */}
              <li><Link href="/drugs" className="hover:text-slate-800 transition-colors">Drug Management</Link></li>
              <li><Link href="/stock" className="hover:text-slate-800 transition-colors">Inventory Levels</Link></li>
              <li><Link href="/expiry" className="hover:text-slate-800 transition-colors">Critical Alerts</Link></li>
            </ul>
          </div>

          {/* Billing & Administration Column */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Administration</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li><Link href="/payments" className="hover:text-slate-800 transition-colors">Billing & Ledgers</Link></li>
              <li><Link href="/reports" className="hover:text-slate-800 transition-colors">Data Reports</Link></li>
              <li><Link href="/profile" className="hover:text-slate-800 transition-colors">Account Settings</Link></li>
            </ul>
          </div>

          {/* Compliance & System Status */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">System Status</h4>
            <div className="space-y-3">
              {/* Muted the system operational pill box to gray tones */}
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-200/50 px-3 py-1.5 rounded-lg w-fit border border-slate-200">
                <Activity size={14} className="animate-pulse text-slate-400" />
                <span className="font-medium">All systems operational</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={14} />
                <span>HIPAA & Data Compliant</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            &copy; {currentYear} PharmaCore Systems. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:underline hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline hover:text-slate-600 transition-colors">Terms of Service</Link>
            <Link href="/support" className="hover:underline hover:text-slate-600 transition-colors">Support Desk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
