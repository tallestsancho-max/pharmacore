"use client";
import { useState, Suspense } from "react";
import { 
  CreditCard, 
  Search, 
  Receipt, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowUpRight
} from "lucide-react";

// Mock historical payment logs matching the pharmacy system
const initialPayments = [
  { id: "TXN-9021", patientName: "Michael Chang", studentId: "STU-2025-04", method: "Insurance Card", amount: 37.50, date: "2026-10-20", status: "Completed" },
  { id: "TXN-8841", patientName: "Sarah Jenkins", studentId: "STU-2026-99", method: "School Subsidy", amount: 4.20, date: "2026-10-19", status: "Completed" },
  { id: "TXN-8712", patientName: "Prof. David Vance", studentId: "STAF-4412", method: "Credit Card", amount: 55.00, date: "2026-10-18", status: "Completed" },
  { id: "TXN-8605", patientName: "Emma Watson", studentId: "STU-2024-11", method: "School Subsidy", amount: 12.80, date: "2026-10-15", status: "Pending Approval" },
];

function PaymentsContent() {
  const [payments, setPayments] = useState(initialPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");

  const filteredPayments = payments.filter(pay => {
    const matchesSearch = pay.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pay.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pay.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === "All" || pay.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  // Calculate totals
  const totalRevenue = payments.reduce((acc, curr) => curr.status === "Completed" ? acc + curr.amount : acc, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="text-blue-600" size={24} /> Billing Ledger & Payments
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">Track medication transaction revenue, co-pays, and institutional school allocations.</p>
        </div>
        
        <button
          type="button"
          onClick={() => alert("Downloading spreadsheet ledger extraction...")}
          className="bg-slate-800 hover:bg-slate-900 text-white text-xs md:text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Download size={14} /> Export General Ledger
        </button>
      </div>

      {/* Revenue Snapshot Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl p-5 shadow-sm">
          <div className="text-[11px] font-medium text-blue-100 uppercase tracking-wider mb-1">Total Revenue Logged</div>
          <div className="text-2xl md:text-3xl font-mono font-bold">${totalRevenue.toFixed(2)}</div>
          <div className="text-[11px] text-blue-100 flex items-center gap-1 mt-2">
            <ArrowUpRight size={13} /> Synced with central accounts
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xl md:text-2xl font-bold text-slate-800">
              {payments.filter(p => p.method === "School Subsidy").length}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Subsidy Allocations</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg md:rounded-xl"><Receipt size={18} /></div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xl md:text-2xl font-bold text-amber-600">
              {payments.filter(p => p.status === "Pending Approval").length}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Pending Approvals</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg md:rounded-xl"><Clock size={18} /></div>
        </div>
      </div>

      {/* Interactive Controls / Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search transaction code, name, or student record ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs md:text-sm bg-slate-50/50 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Filter size={14} className="text-slate-400 hidden sm:inline" />
          <select 
            value={methodFilter} 
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-200 rounded-lg text-xs md:text-sm bg-white focus:outline-none focus:border-blue-500 h-9"
          >
            <option value="All">All Payment Systems</option>
            <option value="Insurance Card">Insurance Card</option>
            <option value="School Subsidy">School Allocation</option>
            <option value="Credit Card">Credit/Debit Card</option>
          </select>
        </div>
      </div>

      {/* Main Responsive Ledger Table / Card View Grid */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        
        {/* --- DESKTOP TABLE INTERFACE (Visible on medium viewports and above) --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Patient / Recipient</th>
                <th className="px-6 py-4">Allocation Channel</th>
                <th className="px-6 py-4">Financial Amount</th>
                <th className="px-6 py-4">Clearing Status</th>
                <th className="px-6 py-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((pay) => {
                  const isPending = pay.status === "Pending Approval";
                  return (
                    <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-slate-800 text-xs">{pay.id}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{pay.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{pay.patientName}</div>
                        <div className="text-xs text-slate-400 font-mono">{pay.studentId}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs font-medium">{pay.method}</td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-800">${pay.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 w-fit ${
                          isPending ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}>
                          {isPending ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                          {pay.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => alert(`Printing detailed invoice breakdown for receipt reference: ${pay.id}`)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors inline-flex"
                        >
                          <Receipt size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-sm font-medium">No ledger matches.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE STACKED DISPLAY INTERFACE (Visible on mobile viewports below 768px) --- */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((pay) => {
              const isPending = pay.status === "Pending Approval";
              return (
                <div key={pay.id} className="p-4 flex flex-col gap-3 hover:bg-slate-50/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="font-mono font-bold text-slate-800 text-sm">{pay.id}</div>
                    <div className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 w-fit ${
                      isPending ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>
                      {isPending ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                      {pay.status}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">{pay.patientName} <span className="font-mono text-xs text-slate-400">({pay.studentId})</span></div>
                  <div className="text-xs text-slate-500">{pay.method}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-mono font-bold text-slate-800">${pay.amount.toFixed(2)}</div>
                    <button
                      type="button"
                      onClick={() => alert(`Printing detailed invoice breakdown for receipt reference: ${pay.id}`)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors inline-flex"
                    >
                      <Receipt size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-slate-400">No ledger matches.</div>
          )}
        </div>
      </div>
    </div>
  );
}