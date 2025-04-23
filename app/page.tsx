"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "#14344b" }}
    >
      <Image
        src="/TundataLogo.svg"
        alt="Tundata Logo"
        width={400}
        height={400}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}
