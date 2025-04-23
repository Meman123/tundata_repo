"use client";

import Image from "next/image";
import PulseLine from "./PulseLine";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#14344b] px-6 py-12 space-y-10">
      <Image
        src="/TundataLogo.svg"
        alt="Tundata Logo"
        width={200}
        height={200}
        className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[240px] h-auto"
      />
      <PulseLine />
    </div>
  );
}
