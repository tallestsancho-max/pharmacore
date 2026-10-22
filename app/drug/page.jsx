"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/components/AuthProvider";
import { 
  PackagePlus, 
  AlertCircle, 
  ArrowLeft, 
  Loader2, 
  Save,
  CheckCircle2,
  ShieldAlert
} from "lucide-react";

function AddDrugContent() {
  const router = useRouter();
  const { profile, loading } = useAuth();
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
      setMessage({ type: "error", text: `Database write aborted: ${error.message || error.code}` });
      setIsSubmitting(false); // Unfreezes the button immediately
    }
  };

  // 1. Show a loader while authentication profile layers initialize
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={28} />
        <p className="text-xs text-slate-500 font-medium">Validating gateway credentials...</p>
      </div>
    );
  }

  // 2. Intercept and completely bar students from seeing or interacting with the form
  if (profile?.role === "Student Operations") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-md">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 border border-rose-100">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Your account profile is assigned to <strong>Student Operations</strong>. You do not possess the mandatory permissions required to log new medical inventory items.
          </p>
          <button 
            type="button"
            onClick={() => router.push("/drugs")}
            className="mt-5 w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            Return to Registry Management
          </button>
        </div>
      </div>
    );
  }

  // 3. Render page cleanly if user is an authorized Staff member or Admin
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
              <label className="block text-xs font-semibold text-slate-600 mb-1">Minimum Stock Level</label>
              <input
                type="number" min="0" name="minStock" value={formData.minStock} onChange={handleChange}
                placeholder="10"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Expiry Date</label>
              <input
                type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        {/* Section 4: Supplier & Storage */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Supplier & Storage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Supplier Name</label>
              <input
                type="text" name="supplierName" value={formData.supplierName} onChange={handleChange}
                placeholder="Supplier Name"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Storage Location</label>
              <input
                type="text" name="storageLocation" value={formData.storageLocation} onChange={handleChange}
                placeholder="Storage Location"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <div className="border-t border-slate-100 pt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition"
          >
            Add Drug
          </button>
        </div>
</form>
</div>
  )};