"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full bg-[#14344B] flex justify-center items-center px-6 sm:px-12 md:px-24 py-4 sm:py-6 shadow-lg overflow-hidden relative z-10">
      <div className="w-full max-w-7xl flex justify-center items-center">
      <div className="w-[180px] sm:w-[220px] md:w-[250px] lg:w-[280px] xl:w-[320px]">
          <Image
            src="/LogoTundata.png"
            alt="Tundata Logo"
            width={542} // El tamaño real del asset (mejor calidad)
            height={142}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </header>
  );
}
