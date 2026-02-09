// Actulizar el estado del usuario en el chat

import { realtimeDb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export class PresenceService {
  static subscribeToUserStatus(
    userId: string,
    callback: (status: "online" | "offline") => void,
  ) {
    const statusRef = ref(realtimeDb, `users/${userId}/status`);

    return onValue(statusRef, (snapshot) => {
      callback(snapshot.val() ?? "offline");
    });
  }
}
