import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export async function logout(setUser: (user: any) => void) {
  await signOut(auth);
  setUser(null);

  await fetch("/api/id-token", { method: "DELETE" });
}
