"use client";

import Image from "next/image";

export default function Header() {
  return (
<header className="w-full bg-[#14344B] flex justify-center items-center
                   px-6 py-3 overflow-hidden relative z-10 shadow-lg">
  <Image
    src="/LogoTundata.png"
    alt="Logo de Tundata"
    width={542}
    height={142}
    priority
    className="w-[150px] sm:w-[170px] md:w-[170px] lg:w-[190px] xl:w-[200px] 2xl:w-[200px] h-auto object-contain"
  />
</header>



  );
}
