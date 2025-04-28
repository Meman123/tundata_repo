"use client";

import Image from "next/image";

export default function Header() {
  return (
<header className="w-full bg-[#14344B] flex justify-center items-center px-6 py-3 shadow-lg overflow-hidden relative z-10">
  <div className="w-full max-w-7xl flex justify-center items-center">
    <div className="w-[150px] sm:w-[170px] md:w-[170px] lg:w-[190px] xl:w-[200px] 2xl:w-[200px]">
      <Image
        src="/LogoTundata.png"
        alt="Tundata Logo"
        width={542}
        height={142}
        className="w-full h-auto object-contain"
        priority
      />
    </div>
  </div>
</header>


  );
}
