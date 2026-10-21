"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, doc, deleteDoc,  } from "firebase/firestore";
import { 
  Pill, 
  Search, 
  Plus, 
  AlertTriangle, 
  Filter, 
  Trash2,
  ShoppingCart,
  Loader2 
} from "lucide-react";

export default function ManageDrugsPage() {
  const router = useRouter();
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 1. Monitor your Firestore "drugs" collection in real time
  useEffect(() => {
    const q = query(collection(db, "drugs"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const drugItems = [];
      snapshot.forEach((doc) => {
        drugItems.push({ id: doc.id, ...doc.data() });
      });
      setDrugs(drugItems);
      setLoading(false);
    }, (error) => {
      console.error("Firestore loading error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Gather unique categories dynamically for the filter dropdown layout
  const categories = ["All", ...new Set(drugs.map(d => d.category).filter(Boolean))];

  // 2. Perform live query filtering matching search terms
  const filteredDrugs = drugs.filter(drug => {
    const name = drug.name || "";
    const genericName = drug.genericName || "";
    const sku = drug.sku || "";
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sku.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesCategory = selectedCategory === "All" || drug.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 3. Optional: Add to cart launcher shortcut utility function
  const handleAddToCartLink = (drug) => {
    if ((drug.quantity || 0) === 0) {
      alert("This medication is completely out of stock and cannot be queued for dispensation.");
      return;
    }
    // Routes directly to your dedicated checkout deck passing item parameters parameters
    alert(`Queuing ${drug.name} for checkout dispensation...`);
    router.push("/checkout");
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to permanently delete ${name} from records?`)) {
      try {
        await deleteDoc(doc(db, "drugs", id));
      } catch (err) {
        alert("Failed to delete record from cloud database.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-slate-500 font-medium">
        <Loader2 className="animate-spin text-slate-600" size={28} />
        <span>Syncing Live Medication Catalog...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* Title Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Pill className="text-slate-700" size={24} /> Pharmacy Stock Catalog
          </h1>
          <p className="text-sm text-slate-500">Monitor physical quantities, review classifications, and stage selections for checkout processing.</p>
        </div>
        <button
          onClick={() => router.push("/drug")}
          className="bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={16} /> Register Medication
        </button>
      </div>

      {/* Filter and Query Sub-Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by brand name, generic formulation, or stock SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-full md:w-48 shrink-0">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-700"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat} Category</option>)}
          </select>
        </div>
      </div>

      {/* Interactive Catalog Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Medication Profiles</th>
                <th className="px-6 py-4">Therapeutic Class</th>
                <th className="px-6 py-4">On-Hand Stock</th>
                <th className="px-6 py-4">Batch Expiry</th>
                <th className="px-6 py-4 text-right">Dispense Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredDrugs.length > 0 ? (
                filteredDrugs.map((drug) => {
                  const qty = drug.quantity || 0;
                  const minAlert = drug.minStockLevel || 10;
                  const isOut = qty === 0;
                  const isLow = !isOut && qty <= minAlert;
                  
                  return (
                    <tr key={drug.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Descriptions column */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{drug.name || "Medication"} <span className="text-xs font-normal text-slate-400">({drug.strength || "N/A"})</span></div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{drug.sku || "NO-SKU"}</div>
                      </td>
                      
                      {/* Classification Category */}
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                          {drug.category || "General"}
                        </span>
                      </td>

                      {/* Stock metrics warning badges */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-700'}`}>
                            {qty} units
                          </span>
                          {isOut && <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Depleted</span>}
                          {isLow && <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-0.5"><AlertTriangle size={10} /> Low</span>}
                        </div>
                      </td>

                      {/* Expiration Timeline */}
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs font-medium">
                        {drug.expiryDate || "N/A"}
                      </td>

                      {/* Actions workflow triggers */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddToCartLink(drug)}
                            disabled={isOut}
                            className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-800 hover:text-white disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-100 disabled:cursor-not-allowed px-2.5 py-1.5 rounded-md transition-all shadow-sm"
                          >
                            <ShoppingCart size={13} /> Add to Cart
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDelete(drug.id, drug.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Purge Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 text-sm font-medium">
                    No medications observed matching those search parameters.
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