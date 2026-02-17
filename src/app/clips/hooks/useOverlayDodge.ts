import { useEffect, useRef, useCallback, useState } from "react";

// ─── useOverlayDodge ──────────────────────────────────────────────────────────
// Detecta si el cursor/touch está en la zona baja del slide (zona de controles).
// Devuelve `true` cuando el overlay debe bajarse para dejar paso a los controles.
//
// Threshold: cuando el puntero está en el 20% inferior del contenedor.
//
// PC:     mousemove sobre el contenedor padre
// Mobile: touchstart / touchend — al tocar la zona baja, baja el overlay;
//         cuando levanta el dedo, vuelve después de un pequeño delay para
//         que el tap en el control nativo tenga tiempo de registrarse.

const CONTROL_ZONE = 0.7; // 70% desde arriba = 20% inferior

export function useOverlayDodge(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dodging, setDodging] = useState(false);
  const restoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRestore = () => {
    if (restoreTimer.current) clearTimeout(restoreTimer.current);
  };

  const scheduleRestore = useCallback((delay = 800) => {
    clearRestore();
    restoreTimer.current = setTimeout(() => setDodging(false), delay);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setDodging(false);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    // ── PC: mousemove ────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relY = (e.clientY - rect.top) / rect.height;
      const inZone = relY >= CONTROL_ZONE;
      setDodging(inZone);
      clearRestore();
    };

    const onMouseLeave = () => {
      clearRestore();
      setDodging(false);
    };

    // ── Mobile: touch ────────────────────────────────────────────────────────
    const onTouchStart = (e: TouchEvent) => {
      const rect = el.getBoundingClientRect();
      const touch = e.touches[0];
      const relY = (touch.clientY - rect.top) / rect.height;
      if (relY >= CONTROL_ZONE) {
        clearRestore();
        setDodging(true);
      }
    };

    const onTouchEnd = () => {
      // Delay generoso: los controles nativos necesitan ~600 ms para registrar el tap
      scheduleRestore(900);
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      clearRestore();
    };
  }, [enabled, scheduleRestore]);

  return { containerRef, dodging };
}
