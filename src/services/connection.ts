// Conexión con realtime db en firebase para el chat y su satus

import { realtimeDb } from "@/lib/firebase";
import {
  ref,
  onValue,
  set,
  serverTimestamp,
  onDisconnect,
} from "firebase/database";

export class ConnectionManager {
  private static unsubscribe: (() => void) | null = null;

  static initialize(userId: string) {
    // Limpiar listener anterior si existe
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    const connectedRef = ref(realtimeDb, ".info/connected");

    this.unsubscribe = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        // Usuario conectado
        set(ref(realtimeDb, `users/${userId}/status`), "online");

        // Cuando se desconecte (cierra pestaña, pierde internet, etc)
        onDisconnect(ref(realtimeDb, `users/${userId}/status`)).set("offline");
        onDisconnect(ref(realtimeDb, `users/${userId}/lastOnline`)).set(
          serverTimestamp(),
        );
      }
    });
  }

  // Cleanup manual para logout
  static async disconnect(userId: string) {
    try {
      // Marcar como offline inmediatamente
      await set(ref(realtimeDb, `users/${userId}/status`), "offline");
      await set(
        ref(realtimeDb, `users/${userId}/lastOnline`),
        serverTimestamp(),
      );

      // Limpiar listener
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  }
}
