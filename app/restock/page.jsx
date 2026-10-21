"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import Next.js routing handle
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, addDoc, doc, updateDoc, increment, getDocs, where } from "firebase/firestore";
import { 
  PackagePlus, 
  Search, 
  Truck, 
  History, 
  Calendar,
  AlertCircle,
  Plus,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function RestockPage() {
  const router = useRouter(); // 2. Initialize the router utility navigation hook
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form handling state for fresh delivery orders
  const [formData, setFormData] = useState({
    drugName: "",
    batchNo: "",
    quantity: "",
    supplier: "",
    cost: "",
  });

  // Sync data in real time from your live Firestore restock_logs collection
  useEffect(() => {
    const q = query(collection(db, "restock_logs"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      // Order by date logged (newest first)
      items.sort((a, b) => new Date(b.dateLogged) - new Date(a.dateLogged));
      setLogs(items);
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch restock logs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const inputQuantity = parseInt(formData.quantity, 10) || 0;
      const cleanDrugName = formData.drugName.trim();

      const newEntry = {
        drugName: cleanDrugName,
        batchNo: formData.batchNo.trim(),
        quantity: inputQuantity,
        supplier: formData.supplier.trim(),
        cost: parseFloat(formData.cost) || 0,
        dateLogged: new Date().toISOString().split('T')[0], // 2026-10-21
        status: "Received"
      };

      // ACTION 1: Commit the transaction entry directly into historical restock logs
      await addDoc(collection(db, "restock_logs"), newEntry);

      // ACTION 2: Find and increment or dynamically create the matching entry inside the active 'drugs' collection
      const drugsRef = collection(db, "drugs");
      const q = query(drugsRef, where("name", "==", cleanDrugName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If a drug item matching this name already exists, update its existing stock count atomically
        const existingDrugDoc = querySnapshot.docs[0];
        const drugDocRef = doc(db, "drugs", existingDrugDoc.id);
        
        await updateDoc(drugDocRef, {
          stock: increment(inputQuantity)
        });
      } else {
        // Optional Fallback: If it's a completely new drug variant, spin it up natively inside the database
        await addDoc(collection(db, "drugs"), {
          name: cleanDrugName,
          category: "General Pharmacy", // Assign a default placeholder fallback category
          price: Math.floor(Math.random() * 2000) + 500, // Assigns a random fallback price if creating fresh
          stock: inputQuantity
        });
      }

      setMessage({ type: "success", text: `Batch ${formData.batchNo} verified and added to live storage metrics.` });
      setFormData({ drugName: "", batchNo: "", quantity: "", supplier: "", cost: "" });

      // ACTION 3: Redirect the window immediately over to the active drugs marketplace dashboard path 
      alert("Inventory successfully updated! Redirecting to dashboard...");
      router.push('/dashboard/drugs');

    } catch (error) {
      console.error("Restock log operation failed entirely:", error);
      setMessage({ type: "error", text: "Failed to save entry. Check database rules." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const drugName = log.drugName || "";
    const batchNo = log.batchNo || "";
    const supplier = log.supplier || "";
    return drugName.toLowerCase().includes(searchQuery.toLowerCase() || "") ||
           batchNo.toLowerCase().includes(searchQuery.toLowerCase() || "") ||
           supplier.toLowerCase().includes(searchQuery.toLowerCase() || "");
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
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <PackagePlus className="text-slate-700" size={24} /> Restock & Batch Ingestion
        </h1>
        <p className="text-sm text-slate-500">Log new medication bulk deliveries, track wholesale order counts, and audit supply lines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Intake Registration Form */}
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">Medication Name *</label>
                <input 
                  type="text" required name="drugName" value={formData.drugName} onChange={handleInputChange}
                  placeholder="e.g., Amoxil Capsules"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
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
                  <>
                    <Loader2 size={16} className="animate-spin" /> Ingesting Data...
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Process Batch Deposit
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Historical Ingestion Audit Trail */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <History size={18} className="text-slate-400" /> Historical Restock Logs
            </h2>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text" placeholder="Search by drug, batch, or supplier..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {filteredLogs.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-6">
                No matching restock logs found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-700">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-2">Date Logged</th>
                      <th className="px-4 py-2">Drug Name</th>
                      <th className="px-4 py-2">Batch No</th>
                      <th className="px-4 py-2">Quantity</th>
                      </tr>
                      </thead>
                      </table>
                      </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}