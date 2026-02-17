export function SlideIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  if (total <= 1) return null;

  const MAX_DOTS = 8;
  const visible = Math.min(total, MAX_DOTS);

  return (
    <div className="flex flex-col items-center gap-1.5 pointer-events-none">
      {Array.from({ length: visible }).map((_, i) => {
        const isActive =
          total <= MAX_DOTS
            ? i === current - 1
            : i === Math.floor(((current - 1) / total) * MAX_DOTS);

        return (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: 3,
              height: isActive ? 20 : 6,
              background: isActive
                ? "rgba(255,255,255,0.9)"
                : "rgba(255,255,255,0.25)",
            }}
          />
        );
      })}
    </div>
  );
}
