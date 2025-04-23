"use client";

import Image from "next/image";
import { useEffect } from "react";
import { gsap } from "gsap";

export default function Home() {
  useEffect(() => {
    // Eliminar animaciones, todo estático
  }, []);

  return (
    <div
      id="background"
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(20, 52, 75, 0.5) 10%, transparent 10%)",
        backgroundSize: "20px 20px",
        backgroundColor: "#14344b", // Color de fondo base
      }}
    >
      <Image
        id="logo"
        src="/TundataLogo.svg"
        alt="Tundata Logo"
        width={400}
        height={400}
      />
    </div>
  );
}
