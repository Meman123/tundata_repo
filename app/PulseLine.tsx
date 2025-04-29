"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PulseLine() {
  const pulse1Ref = useRef<SVGUseElement>(null);
  const pulse2Ref = useRef<SVGUseElement>(null);
  const [viewBox, setViewBox] = useState("0 0 1000 100"); // Desktop base

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 425) {
        // 📱 Mobile
        setViewBox("0 0 300 100");
      } else if (width < 640 && width >= 425) {
        // 📱 Tablet
        setViewBox("0 0 400 100");
      }
      else if (width < 1024 && width >= 640) {
        // 📱 laptop
        setViewBox("0 0 600 100");
      } else {
        // 💻 Desktop
        setViewBox("0 0 900 100");
      }
    };

    handleResize();
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
        duration: 40,
        ease: "none",
        repeat: -1,
      });

      gsap.to(pulse2, {
        x: `+=${svgWidth}`,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  return (
    <div className="w-full max-w-7xl overflow-hidden mx-auto px-2 md:px-3 lg:px-4 xl:px-5">
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMinYMid slice"
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
            fill="white"
            stroke="#F39C12"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <use
            href="/linea2.svg#pulse-path-shape"
            ref={pulse2Ref}
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
