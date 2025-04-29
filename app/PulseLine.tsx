"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PulseLine() {
  // Referencias a las dos copias de la línea
  const pulseA = useRef<SVGUseElement>(null);
  const pulseB = useRef<SVGUseElement>(null);

  useEffect(() => {
    if (!pulseA.current || !pulseB.current) return;

    // ➜ Obtener el ancho real del path
    const width = pulseA.current.getBBox().width;

    // Posicionar elementos
    gsap.set(pulseA.current, { x: 0 });
    gsap.set(pulseB.current, { x: -width });

    // Animación infinita
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none", duration: 40 } });
    tl.to(pulseA.current, { x: `+=${width}` }, 0)
      .to(pulseB.current, { x: `+=${width}` }, 0);

    return () => {
      tl.kill();
      return undefined;
    };
  }, []);

  return (
    <div className="w-full max-w-7xl overflow-hidden mx-auto px-2 md:px-3 lg:px-4 xl:px-5">
      <svg
        viewBox="0 0 1200 100"              /* viewBox fijo */
        preserveAspectRatio="none"          /* estira horizontalmente */
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto pointer-events-none" /* no captura toques */
      >
        <defs>
          {/* máscara de desvanecido a la derecha */}
          <linearGradient id="fadeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="95%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#fadeGrad)" />
          </mask>
        </defs>

        <g mask="url(#fadeMask)">
          {/* solo stroked paths, SIN fill */}
          <use
            href="/linea2.svg#pulse-path-shape"
            ref={pulseA}
            fill="none"
            stroke="#F39C12"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <use
            href="/linea2.svg#pulse-path-shape"
            ref={pulseB}
            fill="none"
            stroke="#F39C12"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}
