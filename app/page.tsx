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
        className="logo"
        style={{ objectFit: "contain" }}
      />
      <style jsx>{`
        .logo {
          width: 50%;
          height: auto;
        }

        @media (min-width: 1024px) {
          .logo {
            width: 400px;
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .logo {
            width: 200px;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}
