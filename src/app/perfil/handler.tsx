import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { setUser } from "@/context/user-context";

export async function logout() {
  await signOut(auth);
  setUser(null);

  await fetch("/api/id-token", { method: "DELETE" });
}
