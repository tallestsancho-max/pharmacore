'use client';
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600 antialiased font-sans">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        
        {/* 1. MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          
          {/* Column 1: System Info Branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 font-bold text-white text-md">
                +
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">PharmaCore</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Integrated inventory pipelines, dynamic restock triggers, and real-time checkout accounting interfaces engineered for modern healthcare spaces.
            </p>
          </div>

          {/* Column 2: Customer Features Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Customer Portal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#drugs" className="hover:text-emerald-600 transition-colors">Browse Medications</a>
              </li>
              <li>
                <a href="#payments" className="hover:text-emerald-600 transition-colors">Digital Payments</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors">Order History Tracking</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Pharmacy Operations Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Management</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#restock" className="hover:text-emerald-600 transition-colors">Inventory Restocking</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors">Supplier Networks</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors">Analytics Reports</a>
              </li>
            </ul>
          </div>

          {/* Column 4: System Connection Status */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Live Services</h3>
            <div className="mt-4 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                Payment Gateway: Connected
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/10">
                Database Synced
              </div>
            </div>
          </div>

        </div>

        {/* 2. SUB-FOOTER BOTTOM LAW / TRADEMARK SECTION */}
        <div className="mt-12 border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2026 PharmaCore Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Operational Policy</a>
            <a href="#" className="hover:underline">Secure Webhooks</a>
            <a href="#" className="hover:underline">System Status</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
