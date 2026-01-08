"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AppUser } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { onIdTokenChanged } from "firebase/auth";

interface UserContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        // Renovar cookie HTTP-only
        await fetch("/api/id-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: await firebaseUser.getIdToken() }),
        });

        // Actualizar contexto
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          nombre: "",
          apellido: "",
          userType: "client",
          creado: Date.now(),
          foto: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
