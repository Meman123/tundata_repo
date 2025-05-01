import { useEffect, useState, RefObject } from "react";

/**
 * Devuelve la altura disponible en viewport menos la altura del ref actual.
 * El ref puede ser null y se maneja de forma segura.
 */
export function useAvailableViewportHeight(
  ref: RefObject<HTMLElement | null>
) {
  const [height, setHeight] = useState("100vh");

  useEffect(() => {
    const update = () => {
      if (ref.current) {
        const h = ref.current.getBoundingClientRect().height;
        setHeight(`calc(100vh - ${h}px)`);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);

  return height;
}
