"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PulseLine() {
  const pulse1Ref = useRef<SVGUseElement>(null);
  const pulse2Ref = useRef<SVGUseElement>(null);
  const [viewBox, setViewBox] = useState("0 0 1500 200");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setViewBox("0 0 500 400"); // más altura en móviles
      } else {
        setViewBox("0 0 1500 200");
      }
    };

    handleResize(); // Ejecutar una vez al montar
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const svgWidth = 6000;
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
    <div className="w-full overflow-hidden px-0 sm:px-4 md:px-12 lg:px-24">
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
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
            stroke="#F39C12" // color actualizado
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <use
            href="/linea2.svg#pulse-path-shape"
            ref={pulse2Ref}
            fill="none"
            stroke="#F39C12" // color actualizado
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}
