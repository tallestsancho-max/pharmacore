"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; 
import { Pill, AlertCircle, User, IdCard, ShieldCheck, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

// 1. Move core page logic inside an inner form component
function RegisterForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: "",
    institutionalId: "", 
    role: "Student Operations", 
    email: "",
    password: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const rolesList = ["Student Operations", "Staff Pharmacist", "Pharmacy Admin"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStudent = formData.role === "Student Operations";

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const userProfile = {
        uid: user.uid,
        fullName: formData.fullName,
        role: formData.role,
        email: formData.email,
        createdAt: new Date(),
        status: "active"
      };

      if (isStudent) {
        userProfile.matricNumber = formData.institutionalId;
      } else {
        userProfile.staffId = formData.institutionalId;
      }

      await setDoc(doc(db, "users", user.uid), userProfile);

      console.log("Profile provisioned successfully!");
      router.push("/auth/login");

    } catch (error) {
      console.error("Firebase error details:", error);
      setErrorMessage(error.message || "Could not register credentials. Verify database routing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Pill size={26} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Create PharmaCore Account</h1>
          <p className="text-xs text-slate-500 mt-1">Register institutional credentials for school pharmacy operations.</p>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-3 text-xs font-medium mb-5 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Legal Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" required name="fullName" value={formData.fullName} onChange={handleChange}
                placeholder="Alex Mercer"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Institutional Assignment *</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <select 
                name="role" value={formData.role} onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-white rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              >
                {rolesList.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {isStudent ? "University Matric Number *" : "Staff Identifier Code *"}
            </label>
            <div className="relative">
              <IdCard className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" required name="institutionalId" value={formData.institutionalId} onChange={handleChange}
                placeholder={isStudent ? "MAT/2023/1045" : "PHARMA-2026-XX"}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Coordinates *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="email" required name="email" value={formData.email} onChange={handleChange}
                placeholder={isStudent ? "student@university.edu" : "username@clinic.edu"}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Secure Access Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="password" required name="password" value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Provisioning Credentials...
              </>
            ) : (
              <>
                Register Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500 border-t border-slate-100 pt-4">
          Already have an operational profile?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
            login here
          </Link>
        </div>

      </div>
    </div>
  );
}

// 2. Export main default wrapper wrapped in Suspense for static NextJS compilation
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-xs">Loading structure...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
