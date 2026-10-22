// app/layout.js
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const instant = false; 
export const metadata = {
  title: "PharmaCore | Medical Inventory",
  description: "Unified pharmaceutical enterprise infrastructure layer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex flex-col pt-16">
        {/* 1. START PROVIDER FIRST */}
        <AuthProvider>
          
          {/* 2. Wrap the dynamic client UI components in Suspense for static build safety */}
          <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-xs">Initializing gateway layout...</div>}>
            
            {/* NAVBAR MUST SIT INSIDE HERE TO SEE THE LOGIN STATE */}
            <Navbar />
            
            {/* Dynamic page content */}
            <main className="flex-1 w-full">
              {children}
            </main>
            
          </Suspense>
          
          {/* Static Base Footer */}
          <Footer />
          
        </AuthProvider>
      </body>
    </html>
  );
}
