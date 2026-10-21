"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, doc, updateDoc } from "firebase/firestore";
import { 
  AlertTriangle, 
  Calendar, 
  Search, 
  ShieldAlert, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  Loader2
} from "lucide-react";

export default function DrugExpiryPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");

  // 1. Sync data in real time from your live Firestore "drugs" collection
  useEffect(() => {
    const q = query(collection(db, "drugs"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setBatches(items);
      setLoading(false);
    }, (error) => {
      console.error("Failed to stream expiry batch logs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Evaluates expiration risk metrics relative to the current time: October 21, 2026
  const getExpiryStatus = (dateString) => {
    if (!dateString) {
      return { label: "Unknown Date", color: "text-slate-400 bg-slate-50 border-slate-100", severity: "unknown" };
    }

    const today = new Date("2026-10-21"); // Synced directly with current date anchor parameters
    const expiryDate = new Date(dateString);
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysRemaining = Math.ceil((expiryDate - today) / msPerDay);

    if (daysRemaining <= 0) {
      return { label: "Expired", color: "text-rose-600 bg-rose-50 border-rose-100", severity: "critical" };
    } else if (daysRemaining <= 90) {
      return { label: `Critical (${daysRemaining} Days)`, color: "text-amber-600 bg-amber-50 border-amber-100", severity: "warning" };
    } else {
      return { label: `Safe (${daysRemaining} Days)`, color: "text-emerald-600 bg-emerald-50 border-emerald-100", severity: "safe" };
    }
  };

  // 3. Filter database collection results based on query matches and risk levels
  const filteredBatches = batches.filter(batch => {
    const status = getExpiryStatus(batch.expiryDate);
    const name = batch.name || "";
    const sku = batch.sku || "";
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "All" || status.severity === filterSeverity;
    
    return matchesSearch && matchesSeverity;
  });

  // Quarantine flag execution logic: Zeroes stock balance safely upon hazard confirmation
  const handleQuarantine = async (id, name) => {
    if (confirm(`Are you sure you want to log quarantine disposal actions for ${name}? This sets available stock balances to 0 units immediately.`)) {
      try {
        const drugRef = doc(db, "drugs", id);
        await updateDoc(drugRef, {
          quantity: 0,
          notes: "Batch quarantined and removed from circulation due to shelf expiration.",
          lastUpdated: new Date().toISOString().split('T')[0]
        });
      } catch (error) {
        console.error("Disposal logging failed:", error);
        alert("Failed to alter record. Check cloud permissions configurations.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-slate-500 font-medium">
        <Loader2 className="animate-spin text-slate-600" size={28} />
        <span>Evaluating Batch Expiration Records...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* Risk Alert Warning Panel Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start gap-4">
        <div className="p-3 bg-amber-100/80 text-amber-700 rounded-xl shrink-0">
          <ShieldAlert size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Drug Expiry & Compliance Tracker</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Real-time shelf validation synced with tracking benchmarks. Expired lots must be safely flagged and immediately quarantined from clinical medical circulation [tech-support].
          </p>
        </div>
      </div>

      {/* Interactive Operational Filters Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by medication description name or product SKU reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: "All", label: "All Items" },
            { id: "critical", label: "🚨 Expired" },
            { id: "warning", label: "⚠️ Under 90 Days" },
            { id: "safe", label: "✅ Stable Stock" }
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setFilterSeverity(btn.id)}
              className={`px-3 py-2 text-xs font-bold rounded-lg border whitespace-nowrap transition-all ${
                filterSeverity === btn.id
                  ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Expiry Timeline Logs Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Medication Item Info</th>
                <th className="px-6 py-4">Shelf Position</th>
                <th className="px-6 py-4">Expiration Date</th>
                <th className="px-6 py-4">Risk Status Countdown</th>
                <th className="px-6 py-4 text-right">Compliance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => {
                  const status = getExpiryStatus(batch.expiryDate);
                  
                  return (
                    <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Descriptions metadata */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{batch.name || "Medication"} <span className="text-xs font-normal text-slate-400">({batch.strength || "N/A"})</span></div>
                        <div className="text-xs text-slate-500">{batch.genericName || "Generic composition profile"}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-1">SKU: {batch.sku || "UNASSIGNED"}</div>
                      </td>

                      {/* Location shelf positions */}
                      <td className="px-6 py-4 text-slate-600 text-xs font-semibold">
                        {batch.storageLocation || "General Shelves"}
                      </td>

                      {/* Expiration date */}
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400" />
                          {batch.expiryDate || "Not Provided"}
                        </div>
                      </td>

                      {/* Status Badges */}
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border whitespace-nowrap ${status.color}`}>
                          {status.label}
                        </span>
                      </td>

                      {/* Execution Action buttons */}
                      <td className="px-6 py-4 text-right">
                        {status.severity === "critical" ? (
                          <button
                            type="button"
                            onClick={() => handleQuarantine(batch.id, batch.name)}
                            className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            <Trash2 size={13} /> Quarantine Stock
                          </button>
                        ) : status.severity === "warning" ? (
                          <a
                            href="/restock"
                            className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            <RefreshCw size={13} /> Order Re-stock
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">No Action Needed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-slate-500 text-sm font-medium">
                    No matching records found for the current search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}