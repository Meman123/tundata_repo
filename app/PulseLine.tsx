"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PulseLine() {
  const pulse1Ref = useRef<SVGUseElement>(null);
  const pulse2Ref = useRef<SVGUseElement>(null);

  useEffect(() => {
    const pulse1 = pulse1Ref.current;
    const pulse2 = pulse2Ref.current;
    const svgWidth = 2000.58;

    if (pulse1 && pulse2) {
      gsap.set(pulse1, { x: 0 });
      gsap.set(pulse2, { x: -svgWidth });

      gsap.to(pulse1, {
        x: `+=${svgWidth}`,
        duration: 10,
        ease: "none",
        repeat: -1,
      });

      gsap.to(pulse2, {
        x: `+=${svgWidth}`,
        duration: 10,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  return (
    <div className="w-full max-w-[800px] md:max-w-[90%] sm:max-w-full mx-auto overflow-hidden px-4 sm:px-6">
      <svg
        viewBox="0 0 2000.58 100"
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

          <path
            id="pulse-path-shape"
            d="M0,40.93c8.71-7.47,23.51-18.23,44.25-24.54,39.83-12.12,74.77.32,90.38,6.13,28.85,10.73,28.5,19.5,55.91,32.17,16.43,7.59,30.84,11.05,98.81,16.09,75.05,5.56,112.99,8.19,133.28.75,26.8-9.83,21.36-16.73,72.77-42.87,40.43-20.56,71.91-36.13,89.62-23.74,14.75,10.32,4.81,29.44,23.74,49.79,13.93,14.97,38.99,25.76,52.85,17.62,14.05-8.25,5.54-29.44,25.28-48.26,3.89-3.71,12.87-12.27,25.28-13.02,14.83-.89,23.7,10.04,51.32,32.94,20.72,17.18,31.08,25.77,36.77,28.34,34.77,15.72,88.11,4.02,109.53-27.57,11.14-16.43,4.46-24.68,15.32-33.7,23.31-19.36,83.53-5.79,114.13,29.9,13.3,15.52,15.91,29.27,29.11,31.38,14.45,2.31,28.58-11.41,44.43-26.81,25.85-25.11,29-40.78,39.83-40.6,14.12.24,15.52,26.97,35.23,47.49,35.07,36.51,101.72,25.92,120.26,22.98,54.42-8.65,56.68-31.53,130.21-52.85,40.07-11.62,63.75-18.49,94.98-13.79,49.29,7.42,56.07,34.43,117.19,53.62,19.52,6.13,54.86,17.22,96.51,11.49,65.81-9.06,79.3-50.76,136.34-60.51,25.87-4.42,64.58-2.93,116.69,27.6"
            fill="none"
            stroke="#F4A207"
            strokeMiterlimit="10"
          />
        </defs>

        <g mask="url(#fadeMask)">
          <use
            href="#pulse-path-shape"
            ref={pulse1Ref}
            fill="none"
            stroke="#F4A207"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
          <use
            href="#pulse-path-shape"
            ref={pulse2Ref}
            fill="none"
            stroke="#F4A207"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}