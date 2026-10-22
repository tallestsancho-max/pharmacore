"use client";

import React, { useState } from 'react';
import { 
  Pill, Plus, Search, Filter, ChevronDown, 
  AlertTriangle, CheckCircle2, RotateCcw, 
  FileSpreadsheet, ShieldAlert, Activity, ClipboardList, 
  TrendingUp, Layers, Eye
} from "lucide-react";

export default function DrugsManagementPage() {
  // --- STATE MATRIX ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Categories");
  const [selectedStockStatus, setSelectedStockStatus] = useState("All States");
  
  // --- SAMPLE INVENTORY DATA ---
  const initialDrugsCollection = [
    { id: "PH-001", name: "Amoxicillin Trihydrate", category: "Antibiotic", dosage: "500mg", format: "Capsule", inventory: 1420, price: 12.50, status: "In Stock" },
    { id: "PH-002", name: "Paracetamol BP", category: "Analgesic", dosage: "500mg", format: "Tablet", inventory: 4800, price: 2.10, status: "In Stock" },
    { id: "PH-003", name: "Metformin Hydrochloride", category: "Antidiabetic", dosage: "850mg", format: "Tablet", inventory: 85, price: 18.75, status: "Low Stock" },
    { id: "PH-004", name: "Ibuprofen USP", category: "NSAID", dosage: "400mg", format: "Softgel", inventory: 2300, price: 4.30, status: "In Stock" },
    { id: "PH-005", name: "Atorvastatin Calcium", category: "Antihyperlipidemic", dosage: "20mg", format: "Tablet", inventory: 0, price: 34.20, status: "Out of Stock" },
    { id: "PH-006", name: "Azithromycin Dihydrate", category: "Antibiotic", dosage: "250mg", format: "Tablet", inventory: 640, price: 22.10, status: "In Stock" },
    { id: "PH-007", name: "Omeprazole Delayed-Release", category: "Antacid", dosage: "20mg", format: "Capsule", inventory: 12, price: 9.80, status: "Low Stock" },
    { id: "PH-008", name: "Lisinopril Dihydrate", category: "Antihuypertensive", dosage: "10mg", format: "Tablet", inventory: 1150, price: 14.00, status: "In Stock" },
    { id: "PH-009", name: "Cetirizine Hydrochloride", category: "Antihistamine", dosage: "10mg", format: "Tablet", inventory: 3200, price: 3.50, status: "In Stock" },
    { id: "PH-010", name: "Salbutamol Inhaler BP", category: "Bronchodilator", dosage: "100mcg", format: "Inhaler", inventory: 45, price: 15.25, status: "Low Stock" },
  ];

  // --- FILTER ENGINE LOGIC ---
  const filteredDrugs = initialDrugsCollection.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          drug.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilter === "All Categories" || drug.category === selectedFilter;
    const matchesStatus = selectedStockStatus === "All States" || drug.status === selectedStockStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen text-slate-800">
      
      {/* SECTION 1: HEADER & PRIMARY CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Activity size={14} /> Global Pharmacy Registry
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Institutional Drug Formulary</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage stock matrix arrays, categorical designations, and legal logistics thresholds.</p>
        </div>
      </div>

      {/* SECTION 2: ANALYTICAL STATS ARRAY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Formulations</p>
            <p className="text-2xl font-bold text-slate-900">1,482</p>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp size={10} /> +4.2% active list
            </span>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Layers size={18} /></div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In Stock Inventory</p>
            <p className="text-2xl font-bold text-slate-900">18,340 <span className="text-xs font-normal text-slate-400">units</span></p>
            <span className="text-[10px] text-slate-500">Distributed across 4 internal vault bays</span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><ClipboardList size={18} /></div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical Low Stock</p>
            <p className="text-2xl font-bold text-amber-600">3 Items</p>
            <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded-md">Requires priority</span>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><AlertTriangle size={18} /></div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Depleted Formulations</p>
            <p className="text-2xl font-bold text-rose-600">1 Item</p>
            <span className="text-[10px] text-rose-700 font-medium bg-rose-50 px-1.5 py-0.5 rounded-md">Procurement pipeline halted</span>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl"><ShieldAlert size={18} /></div>
        </div>
      </div>

      {/* SECTION 3: SEARCH SECTOR & FILTERS TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulations by compound name or catalog batch code..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="pl-8 pr-8 py-2 border border-slate-200 bg-white rounded-xl text-xs font-medium text-slate-700 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="Antibiotic">Antibiotics</option>
                <option value="Analgesic">Analgesics</option>
                <option value="Antidiabetic">Antidiabetics</option>
                <option value="NSAID">NSAIDs</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-3 pointer-events-none text-slate-400" size={12} />
            </div>

            <div className="relative">
              <select 
                value={selectedStockStatus}
                onChange={(e) => setSelectedStockStatus(e.target.value)}
                className="pl-3 pr-8 py-2 border border-slate-200 bg-white rounded-xl text-xs font-medium text-slate-700 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All States">All Stock States</option>
                <option value="In Stock">In Stock Only</option>
                <option value="Low Stock">Low Stock Warnings</option>
                <option value="Out of Stock">Depleted State Only</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-3 pointer-events-none text-slate-400" size={12} />
            </div>

            {(searchQuery || selectedFilter !== "All Categories" || selectedStockStatus !== "All States") && (
              <button 
                onClick={() => { setSearchQuery(""); setSelectedFilter("All Categories"); setSelectedStockStatus("All States"); }}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2 py-2 flex items-center gap-1"
              >
                <RotateCcw size={12} /> Reset Configs
              </button>
            )}
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Showing {filteredDrugs.length} of {initialDrugsCollection.length} formulations</p>
      </div>

      {/* SECTION 4: DRUGS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Batch Code</th>
              <th className="px-4 py-3">Compound Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Dosage</th>
              <th className="px-4 py-3">Format</th>
              <th className="px-4 py-3">Inventory</th>
              <th className="px-4 py-3">Price (USD)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredDrugs.map(drug => (
              <tr key={drug.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{drug.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{drug.name}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{drug.category}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{drug.dosage}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{drug.format}</td>
                <td className="px-4 py-3 text-xs text-slate-700">{drug.inventory}</td>
                <td className="px-4 py-3 text-xs text-slate-700">${drug.price.toFixed(2)}</td>
                <td className={`px-4 py-3 text-xs font-semibold ${drug.status === "In Stock" ? "text-emerald-600" : drug.status === "Low Stock" ? "text-amber-600" : "text-rose-600"}`}>
                  {drug.status}
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">View</button>
                  <button className="text-slate-600 hover:text-slate-800 text-xs font-medium">Edit</button>
                </td>
              </tr>
            ))}
            {filteredDrugs.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-sm text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <ShieldAlert size={24} className="text-slate-400" />
                    <p>No formulations match the current search or filter criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}