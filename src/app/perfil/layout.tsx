"use client";
import { useUser } from "@/context/user-context";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseUser, loading: loadingUser, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!firebaseUser && !loadingUser) {
      router.push("/iniciar-sesion");
    }

    if (loadingUser && error) {
      toast.error("Error al cargar el perfil");
    }
  }, [firebaseUser, loadingUser, router]);

  return <>{children}</>;
}
