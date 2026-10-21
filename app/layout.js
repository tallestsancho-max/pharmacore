// app/layout.js
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
          
          {/* 2. NAVBAR MUST SIT INSIDE HERE TO SEE THE LOGIN STATE */}
          <Navbar />
          
          {/* Dynamic page content */}
          <main className="flex-1 w-full">
            {children}
          </main>
          
          {/* Static Base Footer */}
          <Footer />
          
        </AuthProvider>
      </body>
    </html>
  );
}
