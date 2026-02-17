"use client";

// Wrapper ligero sobre IntersectionObserver.
// Avisa cuando un elemento entra en el viewport, usado para:
//   1. Disparar fetchNextPage al acercarse al final del feed.
//   2. Pausar/reanudar video al entrar o salir del viewport.

import { useEffect, useRef, useCallback } from "react";

interface UsePostObserverOptions {
  onVisible?: () => void;
  onHidden?: () => void;
  // Porcentaje del elemento que debe ser visible para disparar (0-1)
  threshold?: number;
  // Margin extra alrededor del viewport
  rootMargin?: string;
}

export function usePostObserver({
  onVisible,
  onHidden,
  threshold = 0.6,
  rootMargin = "0px",
}: UsePostObserverOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onVisible, onHidden });

  // Mantener callbacks actualizados sin recrear el observer
  callbacksRef.current = { onVisible, onHidden };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbacksRef.current.onVisible?.();
        } else {
          callbacksRef.current.onHidden?.();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]); // Solo recrear si cambian las opciones

  return ref;
}

// ─── Sentinel hook ────────────────────────────────────────────────────────────
// Para el elemento "centinela" al final de la lista que dispara fetchNextPage.

export function useFeedSentinel(callback: () => void, enabled = true) {
  const ref = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current();
        }
      },
      {
        // Activa antes de que el sentinela llegue al viewport
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return ref;
}
