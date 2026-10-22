"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; 
import { 
  Pill, 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle,
  LogIn
} from "lucide-react";

// 1. Core structural form component containing your interactive code logic
function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login session error:", error);
      if (
        error.code === "auth/user-not-found" || 
        error.code === "auth/wrong-password" || 
        error.code === "auth/invalid-credential"
      ) {
        setErrorMessage("Invalid email address or password combination.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("Access temporarily blocked due to multiple failed attempts. Please try again later.");
      } else {
        setErrorMessage("Connection failure. Verify system network configuration status.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 sm:py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8">
        
        {/* Logo and Brand Heading */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Pill size={26} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Welcome to PharmaCore</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to manage school pharmacy inventory and distributions.</p>
        </div>

        {/* Dynamic Error Status Banner */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-lg p-3 text-xs font-medium mb-5 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email input field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="email" required name="email" value={formData.email} onChange={handleChange}
                placeholder="username@clinic.edu"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password Entry Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-600">Access Password *</label>
              <button 
                type="button"
                onClick={() => alert("Password reset trigger email sequence (Mock Action).")}
                className="text-[11px] text-blue-600 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="password" required name="password" value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Log In Execution Trigger */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg text-sm shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Verifying Credentials...
              </>
            ) : (
              <>
                <LogIn size={16} /> Secure Sign In
              </>
            )}
          </button>
        </form>

        {/* Toggle Option Footer Navigation Switch using standard next/link anchor */}
        <div className="text-center mt-6 text-xs text-slate-500 border-t border-slate-100 pt-4">
          New to the central clinic administration?{" "}
          <Link href="/auth/signin" className="text-blue-600 hover:underline font-semibold">
            Register account profile
          </Link>
        </div>

      </div>
    </div>
  );
}

// 2. Clear default wrapper shell that handles boundaries gracefully during production bundling
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-xs">Syncing application gateway routing...</div>}>
      <LoginForm />
    </Suspense>
  );
}
