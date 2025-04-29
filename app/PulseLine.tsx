"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PulseLine() {
  const pulseA = useRef<SVGUseElement>(null);
  const pulseB = useRef<SVGUseElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  /* 1️⃣  ViewBox responsivo — mantiene tu escala visual */
  const [viewBox, setViewBox] = useState("0 0 900 100"); // desktop por defecto

  useEffect(() => {
    const updateViewBox = () => {
      const w = window.innerWidth;
      if (w < 425) setViewBox("0 0 300 100");          // móvil XS
      else if (w < 640) setViewBox("0 0 400 100");     // móvil-tablet
      else if (w < 1024) setViewBox("0 0 600 100");    // laptop
      else setViewBox("0 0 900 100");                  // desktop
    };

    updateViewBox(); // primera vez
    // Usamos ResizeObserver para evitar muchos listeners
    const ro = new ResizeObserver(updateViewBox);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  /* 2️⃣  Animación GSAP usando la longitud real del path */
  useEffect(() => {
    if (!pulseA.current || !pulseB.current) return;

    // Longitud real del path dentro del SVG importado
    const width = pulseA.current.getBBox().width;

    gsap.set([pulseA.current, pulseB.current], { x: 0 });
    gsap.set(pulseB.current, { x: -width });

    const tl = gsap.timeline({ repeat: -1, defaults: { duration: 40, ease: "none" } });
    tl.to(pulseA.current, { x: `+=${width}` }, 0)
      .to(pulseB.current, { x: `+=${width}` }, 0);

    // Limpieza
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="w-full max-w-7xl overflow-hidden mx-auto px-2 md:px-3 lg:px-4 xl:px-5">
      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="xMinYMid slice" /* conserva tu framing lateral */
        className="w-full h-auto pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente para desvanecer a la derecha (opcional ajustar %) */}
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
          {/* ⚠️  sin fill para que no aparezca el parche blanco */}
          <use
            href="/linea2.svg#pulse-path-shape"
            ref={pulseA}
            fill="none"
            stroke="#F39C12"          /* cambia a #F48E07 cuando unifiques paleta */
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
