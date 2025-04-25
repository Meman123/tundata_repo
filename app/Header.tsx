// src/components/Header.tsx
"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import * as flubber from "flubber";

export default function Header() {
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    // 1) Define tu línea recta y tu onda
    const flatD = "M0,10 C250,10 250,10 500,10 C750,10 750,10 1000,10";
    const waveD = "M0,10 C125,0 375,20 500,10 C625,0 875,20 1000,10";

    // 2) Crea el interpolador
    const interpolator = flubber.interpolate(flatD, waveD);

    // 3) Función que actualiza el 'd' según el scroll
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const t = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      pathRef.current!.setAttribute("d", interpolator(t));
    };

    // 4) Escucha el scroll
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // inicializa al cargar

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#14323B] flex justify-center items-center px-4 sm:px-8 md:px-16 lg:px-24 py-3 overflow-visible">
      {/* Logo */}
      <div className="w-[4.8rem] sm:w-[6.4rem] md:w-[8rem] lg:w-[9.6rem] xl:w-[11.2rem]">
        <Image
          src="/LogoTundata2.png"
          alt="Tundata Logo"
          width={300}
          height={300}
          priority
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Línea SVG animada */}
      <div className="absolute bottom-0 left-0 w-full overflow-visible">
        <svg
          className="w-full h-8"
          viewBox="0 0 1000 20"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={pathRef}
            stroke="#F48E07"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>
    </header>
  );
}
