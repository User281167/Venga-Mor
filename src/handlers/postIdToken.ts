export const updateFirabaseIdToken = async (idToken: string): Promise<void> => {
  // Renovar cookie HTTP-only
  await fetch("/api/id-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: idToken }),
  });
};

export const deleteFirebaseIdToken = async (): Promise<void> => {
  // Eliminar cookie HTTP-only
  await fetch("/api/id-token", {
    method: "DELETE",
  });
};
