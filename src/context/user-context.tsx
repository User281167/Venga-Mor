"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AppUser } from "@/types/user";
import { auth } from "@/lib/firebase";
import { onIdTokenChanged } from "firebase/auth";
import { ApiResponse } from "@/lib/api-response";
import { UserDto } from "@/dtos/user.dto";
import { useQueryClient } from "@tanstack/react-query";

interface UserContextType {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

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

        const resUser = await fetch(`/api/usuarios`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const user = (await resUser.json()) as ApiResponse<UserDto>;

        if (user.success) {
          setUser({
            ...user.data,
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
          } as AppUser);

          setError(null);
        } else {
          setError(user.message);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Cuando el usuario cambia, limpia cache del usuario anterior
  useEffect(() => {
    if (!user) {
      // Usuario cerró sesión o no hay usuario
      queryClient.removeQueries({
        queryKey: ["personal-posts"],
      });
    }
  }, [user, queryClient]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
