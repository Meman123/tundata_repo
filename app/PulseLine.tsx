"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PulseLine() {
  const pulse1Ref = useRef<SVGUseElement>(null);
  const pulse2Ref = useRef<SVGUseElement>(null);
  const [viewBox, setViewBox] = useState("0 0 1000 250"); // Valor inicial (Desktop)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        // 📏 Breakpoint Mobile
        setViewBox("0 0 500 300"); 
        // ← Ajusta estos números:
        //    500 = ancho virtual
        //    300 = alto virtual (más alto si quieres que se vea más "grande" en mobile)
      } else if (width < 1024) {
        // 📏 Breakpoint Tablet
        setViewBox("0 0 750 225"); 
        // ← Ajusta para tablet: más ancho, altura intermedia.
      } else {
        // 📏 Breakpoint Desktop
        setViewBox("0 0 1000 250"); 
        // ← Para desktop grande: más ancho, menos alto.
      }
    };

    handleResize(); // Ejecutar al montar
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const svgWidth = 6000; // 📏 Ancho total de la línea que animas
    const pulse1 = pulse1Ref.current;
    const pulse2 = pulse2Ref.current;

    if (pulse1 && pulse2) {
      gsap.set(pulse1, { x: 0 });
      gsap.set(pulse2, { x: -svgWidth });

      gsap.to(pulse1, {
        x: `+=${svgWidth}`,
        duration: 30, 
        ease: "none",
        repeat: -1,
      });

      gsap.to(pulse2, {
        x: `+=${svgWidth}`,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  return (
    <div className="w-full overflow-hidden px-2 sm:px-4 md:px-8 lg:px-12">
      {/* Puedes ajustar px para controlar el aire lateral en cada breakpoint */}

      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40"
        // ← Ajusta las alturas con clases Tailwind:
        //    h-24: altura pequeña (mobile)
        //    h-28: altura un poquito más alta (sm)
        //    h-32: altura tablet
        //    h-36: altura laptop
        //    h-40: altura desktop grande
      >
        <defs>
          <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="95%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#fadeGradient)" />
          </mask>
        </defs>

        <g mask="url(#fadeMask)">
          <use
            href="/linea2.svg#pulse-path-shape"
            ref={pulse1Ref}
            fill="none"
            stroke="#F39C12" 
            strokeWidth="2" 
            vectorEffect="non-scaling-stroke"
          />
          <use
            href="/linea2.svg#pulse-path-shape"
            ref={pulse2Ref}
            fill="none"
            stroke="#F39C12" 
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}
