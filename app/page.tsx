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
        width={400} // Default width for desktop
        height={400} // Default height for desktop
        style={{ objectFit: "contain" }}
      />
      <style jsx>{`
        .logo {
          width: 30vw;
          max-width: 400px;
          height: auto;
        }

        @media (min-width: 1024px) {
          .logo {
            width: 20vw;
            max-width: 400px;
          }
        }

        @media (max-width: 768px) {
          .logo {
            width: 50vw;
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  );
}
