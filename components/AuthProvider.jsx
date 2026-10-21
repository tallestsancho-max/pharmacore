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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // 1. Assign the authenticated user base instance
          setUser(currentUser);
          
          // 2. Fetch the student/staff metadata array map from Firestore
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            console.warn("No extra user profile document discovered in Firestore matrix.");
            setProfile(null);
          }
        } else {
          // 3. Purge states cleanly if session is dropped or logged out
          setUser(null);
          profile && setProfile(null);
        }
      } catch (error) {
        console.error("Critical error inside authorization tracking thread:", error);
      } finally {
        // 4. Kill the initial global loading barrier layout flag
        setLoading(false);
      }
    });

    // Cleanly cancel subscription thread on layout dismount
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
