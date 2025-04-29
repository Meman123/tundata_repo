"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PulseLine() {
  const pulseA = useRef<SVGUseElement>(null);
  const pulseB = useRef<SVGUseElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [viewBox, setViewBox] = useState("0 0 900 100");

  useEffect(() => {
    const updateViewBox = () => {
      const w = window.innerWidth;
      if (w < 425) setViewBox("0 0 300 100");
      else if (w < 640) setViewBox("0 0 400 100");
      else if (w < 1024) setViewBox("0 0 600 100");
      else setViewBox("0 0 900 100");
    };

    updateViewBox();
    const ro = new ResizeObserver(updateViewBox);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!pulseA.current || !pulseB.current) return;

    let raf: number;

    const init = () => {
      const width = pulseA.current!.getBBox().width;

      if (width === 0) {
        raf = requestAnimationFrame(init); // esperamos el siguiente tic
        return;
      }

      gsap.set([pulseA.current, pulseB.current], { x: 0 });
      gsap.set(pulseB.current, { x: -width });

      const tl = gsap.timeline({ repeat: -1, defaults: { duration: 40, ease: "none" } });
      tl.to(pulseA.current, { x: `+=${width}` }, 0)
        .to(pulseB.current, { x: `+=${width}` }, 0);
    };

    init();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="w-full max-w-7xl overflow-hidden mx-auto px-2 md:px-3 lg:px-4 xl:px-5">
      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="xMinYMid slice"
        className="w-full h-auto pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
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
          <use
            href="/linea2.svg#pulse-path-shape"
            ref={pulseA}
            fill="none"
            stroke="#F39C12"  /* Cambiar a #F48E07 si quieres estandarizar */
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
