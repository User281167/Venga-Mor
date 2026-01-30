"use client";
import { useUser } from "@/context/user-context";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PerfilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: loadingUser, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loadingUser) {
      router.push("/iniciar-sesion");
    }

    if (loadingUser && error) {
      toast.error("Error al cargar el perfil");
    }
  }, [user, loadingUser, router]);

  return <>{children}</>;
}
