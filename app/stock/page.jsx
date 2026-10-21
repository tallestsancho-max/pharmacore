"use client";
import { useState } from "react";
import { 
  Boxes, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  SlidersHorizontal, 
  AlertCircle,
  PackageCheck,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

// Mock broad inventory stock levels for the clinic setup
const initialStock = [
  { id: "s1", name: "Amoxil Capsules", sku: "AMX-500", quantity: 45, minStock: 30, unit: "packs", lastUpdated: "2026-10-18", status: "In Stock" },
  { id: "s2", name: "Paracetamol 500mg", sku: "PCM-500", quantity: 350, minStock: 100, unit: "tabs", lastUpdated: "2026-10-20", status: "Good" },
  { id: "s3", name: "Claritin Syrup", sku: "LOR-10", quantity: 12, minStock: 25, unit: "bottles", lastUpdated: "2026-10-15", status: "Low Stock" },
  { id: "s4", name: "Brufen Forte", sku: "IBU-400", quantity: 0, minStock: 40, unit: "tabs", lastUpdated: "2026-10-02", status: "Out of Stock" },
  { id: "s5", name: "Ventolin Inhaler", sku: "VEN-012", quantity: 15, minStock: 10, unit: "units", lastUpdated: "2026-10-19", status: "In Stock" },
];

export default function StockManagementPage({ activeTab }) {
  const [stockList, setStockList] = useState(initialStock);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredStock = stockList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "Low") matchesStatus = item.quantity > 0 && item.quantity <= item.minStock;
    if (statusFilter === "Out") matchesStatus = item.quantity === 0;
    if (statusFilter === "Good") matchesStatus = item.quantity > item.minStock;

    return matchesSearch && matchesStatus;
  });

  // Calculate global summary counters
  const totalItems = stockList.length;
  const outOfStockItems = stockList.filter(i => i.quantity === 0).length;
  const lowStockItems = stockList.filter(i => i.quantity > 0 && i.quantity <= i.minStock).length;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Boxes className="text-blue-600" size={26} /> Stock Management & Control
          </h1>
          <p className="text-sm text-slate-500">Perform adjustments, reconcile disparities, and audit volumetric system levels.</p>
        </div>
        <div className="flex gap-2 self-stretch md:self-auto">
          <Link href="/restock" className="flex-1 md:flex-initial">
  <button
    type="button"
    className="w-full bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
  >
    <RefreshCw size={15} /> Quick Restock
  </button>
</Link>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Boxes size={22} /></div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{totalItems}</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monitored Lines</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle size={22} /></div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{lowStockItems}</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Low Level Warning</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><AlertCircle size={22} /></div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{outOfStockItems}</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Depleted Supply (Zero)</div>
          </div>
        </div>
      </div>

      {/* Table Control Filtration Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Filter item line indices by stock title or SKU reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto">
          {[
            { id: "All", label: "All Items" },
            { id: "Good", label: "✅ Sufficient Stock" },
            { id: "Low", label: "⚠️ Low Level Alert" },
            { id: "Out", label: "🚨 Depleted" }
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setStatusFilter(btn.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border whitespace-nowrap transition-all ${
                statusFilter === btn.id
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Medication Item / Code</th>
                <th className="px-6 py-4">Safety Alert Cap</th>
                <th className="px-6 py-4">Available Balance</th>
                <th className="px-6 py-4">Log Status</th>
                <th className="px-6 py-4">Last Modified</th>
                <th className="px-6 py-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStock.length > 0 ? (
                filteredStock.map((item) => {
                  const isZero = item.quantity === 0;
                  const isLow = !isZero && item.quantity <= item.minStock;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        <div className="text-xs font-mono text-slate-400 mt-0.5">{item.sku}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                        {item.minStock} {item.unit} Threshold
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-mono font-bold ${isZero ? "text-rose-600" : isLow ? "text-amber-600" : "text-slate-700"}`}>
                          {item.quantity}
                        </span>
                        <span className="text-xs text-slate-400 font-medium ml-1">{item.unit}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${
                          isZero 
                            ? "bg-rose-50 text-rose-700 border-rose-100" 
                            : isLow 
                            ? "bg-amber-50 text-amber-700 border-amber-100" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}>
                          {isZero ? "Depleted" : isLow ? "Low Volume" : "Sufficient"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">
                        {item.lastUpdated}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => alert(`Adjusting stock levels manually for: ${item.name}`)}
                            className="text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 border border-slate-200 hover:border-blue-200 px-2.5 py-1 rounded transition-colors"
                          >
                            Reconcile
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm font-medium">
                    No matching item positions observed under this log filtering combination.
                  </td>
                </tr>
              )}
            </tbody>
            </table>
            </div>
            </div>
            </div>
  )}