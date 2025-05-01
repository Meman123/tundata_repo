import { useEffect, useState, RefObject } from "react";

export function useAvailableViewportHeight<T extends HTMLElement>(
  ref: RefObject<T>
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
