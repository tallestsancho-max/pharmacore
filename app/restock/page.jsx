"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, addDoc, doc, updateDoc, increment } from "firebase/firestore";
import { 
  PackagePlus, Search, Truck, History, AlertCircle, Plus, Loader2, CheckCircle2
} from "lucide-react";

export default function RestockPage() {
  const router = useRouter(); 
  const [logs, setLogs] = useState([]);
  const [masterDrugs, setMasterDrugs] = useState([]); // Holds real drugs fetched from your DB
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    drugId: "",       // Tracks selected document ID reference
    selectedName: "", // Tracks selected readable name text
    batchNo: "",
    quantity: "",
    supplier: "",
    cost: "",
  });

  // 1. Fetch both real-time logs AND your actual master drugs list simultaneously
  useEffect(() => {
    // Sync logs
    const qLogs = query(collection(db, "restock_logs"));
    const unsubscribeLogs = onSnapshot(qLogs, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      items.sort((a, b) => new Date(b.dateLogged) - new Date(a.dateLogged));
      setLogs(items);
    });

    // Sync active master drugs for dropdown mapping
    const qDrugs = query(collection(db, "drugs"));
    const unsubscribeDrugs = onSnapshot(qDrugs, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Dynamically handles whether your DB fields are named 'name' or 'drugName'
        items.push({ 
          id: doc.id, 
          displayName: data.name || data.drugName || "Unnamed Drug" 
        });
      });
      setMasterDrugs(items);
      setLoading(false);
    }, (error) => {
      console.error("Database sync failed:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeLogs();
      unsubscribeDrugs();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handles dropdown select changes safely
  const handleDropdownChange = (e) => {
    const selectedId = e.target.value;
    const matchedDrug = masterDrugs.find(d => d.id === selectedId);
    setFormData(prev => ({
      ...prev,
      drugId: selectedId,
      selectedName: matchedDrug ? matchedDrug.displayName : ""
    }));
  };

  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    if (!formData.drugId) {
      setMessage({ type: "error", text: "Please select an existing medication from your dashboard catalog." });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const inputQuantity = parseInt(formData.quantity, 10) || 0;

      const newEntry = {
        drugName: formData.selectedName,
        batchNo: formData.batchNo.trim(),
        quantity: inputQuantity,
        supplier: formData.supplier.trim(),
        cost: parseFloat(formData.cost) || 0,
        dateLogged: new Date().toISOString().split('T')[0], 
        status: "Received"
      };

      // ACTION 1: Record to transaction timeline history log
      await addDoc(collection(db, "restock_logs"), newEntry);

      // ACTION 2: Directly target the exact existing document ID in your inventory
      const drugDocRef = doc(db, "drugs", formData.drugId);
      
      // Safety update package: sets both potential keys ('stock' and 'quantity') 
      // so it updates your page no matter what variable spelling your stock layout uses!
      await updateDoc(drugDocRef, {
        stock: increment(inputQuantity),
        quantity: increment(inputQuantity)
      });

      setMessage({ type: "success", text: `Batch ${formData.batchNo} verified and synced with live storage inventory metrics.` });
      setFormData({ drugId: "", selectedName: "", batchNo: "", quantity: "", supplier: "", cost: "" });

      alert("Inventory successfully updated! Redirecting to dashboard...");
      router.push('/stock'); // Redirects to your stock overview page

    } catch (error) {
      console.error("Restock failed entirely:", error);
      setMessage({ type: "error", text: `Failed to save entry: ${error.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const nameText = log.drugName || "";
    return nameText.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-slate-500 font-medium">
        <Loader2 className="animate-spin text-slate-600" size={28} />
        <span>Syncing Procurement Logs...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <PackagePlus className="text-slate-700" size={24} /> Restock & Batch Ingestion
        </h1>
        <p className="text-sm text-slate-500">Log new medication bulk deliveries, track wholesale order counts, and audit supply lines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Truck size={18} className="text-slate-400" /> Log Incoming Shipment
            </h2>

            {message.text && (
              <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 border ${
                message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"
              }`}>
                {message.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmitBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Medication *</label>
                {/* SMART DROPDOWN SELECTOR */}
                <select 
                  required 
                  value={formData.drugId} 
                  onChange={handleDropdownChange}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose From Active Stock --</option>
                  {masterDrugs.map((drug) => (
                    <option key={drug.id} value={drug.id}>{drug.displayName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">New Batch Serial *</label>
                  <input 
                    type="text" required name="batchNo" value={formData.batchNo} onChange={handleInputChange}
                    placeholder="e.g., B-AMX99"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Pack Intake Qty *</label>
                  <input 
                    type="number" required min="1" name="quantity" value={formData.quantity} onChange={handleInputChange}
                    placeholder="100"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Wholesale Supplier *</label>
                <input 
                  type="text" required name="supplier" value={formData.supplier} onChange={handleInputChange}
                  placeholder="Wholesale vendor name"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Total Procurement Cost ($)</label>
                <input 
                  type="number" step="0.01" name="cost" value={formData.cost} onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-semibold py-2.5 px-4 rounded-lg text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Ingesting Data...</>
                ) : (
                  <><Plus size={16} /> Process Batch Deposit</>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <History size={18} className="text-slate-400" /> Recent Restock Logs
            </h2>

            <div className="flex items-center gap-2 mb-3">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search by medication name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {filteredLogs.length === 0 ? (
              <p className="text-sm text-slate-500">No logs found matching your search criteria.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="border border-slate-100 rounded-lg p-3 flex justify-between items-center hover:bg-slate-50 transition">
                    <div>
                      <p className="font-semibold text-slate-800">{log.drugName}</p>
                      <p className="text-xs text-slate-500">Batch: {log.batchNo} | Qty: {log.quantity} | Supplier: {log.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{new Date(log.dateLogged).toLocaleDateString()}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        log.status === "Received" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>{log.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}