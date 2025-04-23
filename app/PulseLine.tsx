"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PulseLine() {
  const pulse1Ref = useRef<SVGUseElement>(null);
  const pulse2Ref = useRef<SVGUseElement>(null);

  useEffect(() => {
    const pulse1 = pulse1Ref.current;
    const pulse2 = pulse2Ref.current;
    const svgWidth = 6000;

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

  useEffect(() => {
    gsap.to("feGaussianBlur", {
      attr: { stdDeviation: 6 },
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="w-full max-w-[800px] md:max-w-[90%] sm:max-w-full mx-auto overflow-hidden px-4 sm:px-6">
      <svg
        viewBox="0 0 1500 200"
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
            stroke="#F4A207"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <use
            href="/linea2.svg#pulse-path-shape"
            ref={pulse2Ref}
            fill="none"
            stroke="#F4A207"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}