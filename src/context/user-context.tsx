"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AppUser } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { onIdTokenChanged, User as FirebaseUser } from "firebase/auth";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  deleteFirebaseIdToken,
  updateFirabaseIdToken,
} from "@/handlers/postIdToken";

interface UserContextType {
  firebaseUser: FirebaseUser | null; // Usuario de Firebase
  user: AppUser | null; // Información del Usuario en DB
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const queryClient = useQueryClient();

  // Escucha cambios en Firebase Auth
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (fbUser) => {
      setLoadingAuth(true);

      if (fbUser) {
        try {
          // Renovar cookie HTTP-only
          const token = await fbUser.getIdToken();
          await updateFirabaseIdToken(token);

          setFirebaseUser(fbUser);
        } catch (error) {
          console.error("Error al renovar token:", error);
          setFirebaseUser(null);
        }
      } else {
        // Usuario cerró sesión - limpiar todo
        setFirebaseUser(null);

        // Limpiar cookie
        await deleteFirebaseIdToken();

        // Limpiar cache de TanStack Query
        queryClient.clear(); // Limpia TODA la cache
      }

      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [queryClient]);

  // Obtener perfil de usuario usando TanStack Query
  const {
    data: user,
    isLoading: loadingProfile,
    error: profileError,
    refetch: refreshUser,
  } = useUserProfile(firebaseUser?.uid ?? null);

  const logout = async () => {
    try {
      await auth.signOut();
      // El onIdTokenChanged se encarga de limpiar
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const loading = loadingAuth || (!!firebaseUser && loadingProfile);
  const error = profileError ? String(profileError) : null;

  const userApp = {
    ...user,
    uid: firebaseUser?.uid ?? "",
    email: firebaseUser?.email ?? "",
  } as AppUser;

  return (
    <UserContext.Provider
      value={{
        firebaseUser,
        user: firebaseUser ? userApp : null,
        loading,
        error,
        logout,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
