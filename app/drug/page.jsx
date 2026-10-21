"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { 
  PackagePlus, 
  AlertCircle, 
  ArrowLeft, 
  Loader2, 
  Save,
  CheckCircle2
} from "lucide-react";

export default function AddDrugPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    sku: "",
    category: "Analgesics",
    dosageForm: "Tablet",
    strength: "",
    quantity: "",
    minStockLevel: "10",
    expiryDate: "",
    supplier: "",
    storageLocation: "",
  });

  const categories = [
    "Analgesics",
    "Antibiotics",
    "Antihistamines",
    "Antipyretics",
    "Supplements/Vitamins",
    "Topical Creams",
    "First Aid Supplies"
  ];

  const dosageForms = ["Tablet", "Capsule", "Liquid/Syrup", "Ointment", "Injection", "Inhaler"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // CORE BACKEND BLOCK: Writing data into your "drugs" Firestore collection
      const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const drugPayload = {
        name: formData.name,
        genericName: formData.genericName,
        sku: formData.sku,
        category: formData.category,
        dosageForm: formData.dosageForm,
        strength: formData.strength,
        quantity: parseInt(formData.quantity, 10) || 0,
        minStockLevel: parseInt(formData.minStockLevel, 10) || 10,
        expiryDate: formData.expiryDate, 
        supplier: formData.supplier,
        storageLocation: formData.storageLocation,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      // Connect to Firestore
      const docRef = await addDoc(collection(db, "drugs"), drugPayload);
      console.log("Document successfully written with ID: ", docRef.id);

      setMessage({ type: "success", text: "Medication successfully logged into database inventory!" });
      
      // Redirect
      setTimeout(() => {
        router.push("/drugs");
      }, 1500);

    } catch (error) {
      console.error("Firestore Write Error Details: ", error);
      // FIX: This forces the alert to print on your screen banner if it crashes
      setMessage({ type: "error", text: `Database write aborted: ${error.message || error.code}` });
      setIsSubmitting(false); // Unfreezes the button immediately
    }
  };



  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* Top Header Navigation */}
      <button 
        type="button"
        onClick={() => router.push("/drugs")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-semibold"
      >
        <ArrowLeft size={16} /> Back to Drug Management
      </button>

      {/* Heading Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-xl">
          <PackagePlus size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add New Medication</h1>
          <p className="text-sm text-slate-500">Register a new batch entry into the pharmacy database records.</p>
        </div>
      </div>

      {/* Dynamic Feedback Status Banner */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-start gap-3 border text-sm font-medium ${
          message.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Input Form */}
<form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        
        {/* Section 1: Core Identifiers */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Medication Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Brand Name *</label>
              <input 
                type="text" required name="name" value={formData.name} onChange={handleChange}
                placeholder="e.g., Panadol Extra"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Generic Formulation *</label>
              <input 
                type="text" required name="genericName" value={formData.genericName} onChange={handleChange}
                placeholder="e.g., Paracetamol"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">SKU / Item Code *</label>
              <input 
                type="text" required name="sku" value={formData.sku} onChange={handleChange}
                placeholder="e.g., PCM-EX-500"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Strength (mg/ml) *</label>
              <input 
                type="text" required name="strength" value={formData.strength} onChange={handleChange}
                placeholder="e.g., 500mg"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Classification Formats */}
        <div className="border-t border-slate-100 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Therapeutic Classification</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-700">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Dosage Form</label>
              <select name="dosageForm" value={formData.dosageForm} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 font-medium text-slate-700">
                {dosageForms.map(form => <option key={form} value={form}>{form}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Volumetric Metrics Counters */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Inventory Safeguards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Initial Pack Qty *</label>
              <input 
                type="number" required min="1" name="quantity" value={formData.quantity} onChange={handleChange}
                placeholder="100"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Low Stock Alert Level *</label>
              <input 
                type="number" required min="1" name="minStockLevel" value={formData.minStockLevel} onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Batch Expiry Date *</label>
              <input 
                type="date" required name="expiryDate" value={formData.expiryDate} onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Logistical Sourcing */}
        <div className="border-t border-slate-100 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Supplier / Distributor</label>
              <input 
                type="text" name="supplier" value={formData.supplier} onChange={handleChange}
                placeholder="e.g., Medline Industries"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>

              <label className="block text-xs font-semibold text-slate-600 mb-1">Storage Location Shelf Code</label>
              <input 
                type="text" name="storageLocation" value={formData.storageLocation} onChange={handleChange}
                placeholder="e.g., Shelf B-Row 4"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Controls Footer Button Row with Redirection */}
        <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/drugs")}
            className="border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all flex items-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving to Cloud...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Medication
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
