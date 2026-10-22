"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext({ user: null, profile: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    try {
      if (user) {
        // If this line fails, the catch block triggers
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUser({ id: user.uid, ...userDoc.data() });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Critical error inside authorization tracking:", error);
      
      // 💡 THE BREADCRUMB FIX: Force login state using the base auth credentials 
      // even if the custom metadata database collection fails to fetch
      setUser({ id: user.uid, email: user.email, role: "User" }); 
    } finally {
      setLoading(false); // 👈 Ensure loading states turn false to kill the infinite spinner!
    }
  });
  return () => unsubscribe();
}, []);


  //  THE FIX: Provide the active user context values down to the app wrapper tree
  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
