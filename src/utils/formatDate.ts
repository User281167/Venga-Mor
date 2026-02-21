export function formatMessageDate(timestamp: number | string): string {
  const date = new Date(timestamp);
  const isToday = new Date().toDateString() === date.toDateString();

  if (isToday) {
    return (
      "Hoy: " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }

  return date.toLocaleDateString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
