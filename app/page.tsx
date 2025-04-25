"use client";

import Image from "next/image";
import PulseLine from "./PulseLine";
import Header from "./Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-[200vh] bg-[#14344b] flex flex-col justify-center items-center px-6 py-12 space-y-20">
        {/* Logo centrado */}
        <div className="flex justify-center items-center">
          <Image
            src="/TundataLogo.svg"
            alt="Tundata Logo"
            width={200}
            height={200}
            className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[240px] h-auto"
          />
        </div>

        {/* Línea más abajo */}
        <div className="mt-12 w-full flex justify-center">
          <PulseLine />
        </div>
      </div>
    </>
  );
}
