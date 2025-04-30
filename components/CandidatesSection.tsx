"use client";

import Image from "next/image";
import clsx from "clsx";

/**
 * CandidatesSection – Versión 2
 * --------------------------------------------------
 * • Añade gradiente inferior + sombra interior tal como en Figma.
 * • Borde dorado => ring-primary (custom #FF9305) con opacidad.
 * • Text‑shadow aplicado vía tailwind‑plugin (ver globals.css => .text-shadow).
 */

interface Candidate {
  name: string;
  party: string;
  img: string;
}

const candidates: Candidate[] = [
  {
    name: "Rocío Bernal Mejía",
    party: "Duitama Nuestra Prioridad",
    img: "/candidatos/rocio.png",
  },
  {
    name: "Miguel Alberto Vergara",
    party: "Nuevas Ideas Por Duitama",
    img: "/candidatos/Vergara.png",
  },
  {
    name: "Roberto Mayorga Mayorga",
    party: "Alianza Democrática Amplia",
    img: "/candidatos/Mayorga.png",
  },
  {
    name: "Rafael Antonio Pirajon",
    party: "Centro Democrático",
    img: "/candidatos/Pirajon.png",
  },
  {
    name: "Alexander Serrato Fonseca",
    party: "Duitama Una Sola Familia",
    img: "/candidatos/Serrato.png",
  },
  {
    name: "Wilfredy Bonilla Lagos",
    party: "Wilfredy Alcalde",
    img: "/candidatos/wilfredy.png",
  },
  {
    name: "Diego Sandoval Cepeda",
    party: "Fuerza Duitama",
    img: "/candidatos/Sandoval.png",
  },
];

function CandidateCard({ name, party, img }: Candidate) {
  return (
    <div
      className={clsx(
        "relative w-[280px] h-[420px] overflow-hidden rounded-[36px]",
        "shadow-lg ring-1 ring-[#FF9305]"
      )}
    >
      {/* Foto */}
      <Image
        src={img}
        alt={name}
        fill
        priority
        className="object-cover"
      />

      {/* Gradiente + texto */}
      <div
        className={clsx(
          "absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-6 pb-4 pt-8",
          "bg-gradient-to-b from-transparent via-[#14344B]/70 to-[#14344B]"
        )}
      >
        <h3 className="text-white text-[24px] font-semibold text-center leading-tight tracking-[0.01em] text-shadow">
          {name}
        </h3>
        <span className="inline-block px-4 py-[2px] bg-primary rounded-full text-white text-xs text-center">
          {party}
        </span>
      </div>
    </div>
  );
}

export default function CandidatesSection() {
  return (
    <section className="w-full bg-[#14344B] py-20 rounded-[45px] flex flex-col items-center gap-16">
      {/* Headline */}
      <header className="w-full max-w-6xl px-8 flex flex-col items-center gap-8 text-center">
        <span className="uppercase text-sm md:text-base font-bold tracking-[0.25em] text-white">
          Elecciones Atípicas Duitama 2025
        </span>
        <h2 className="text-white text-4xl md:text-6xl font-bold leading-none">
          ¿Quién Quiere <span className="text-primary">Gobernar Duitama</span>?
        </h2>
        <p className="text-white text-xl max-w-3xl">
          Conoce a cada candidato, su trayectoria y propuestas. Decide con datos
          reales.
        </p>
        <p className="text-white text-base md:text-lg max-w-4xl">
          Duitama volverá a las urnas este 4 de mayo para elegir a la persona
          que asumirá la Alcaldía hasta 2027, en un momento clave para
          recuperar la estabilidad institucional.
        </p>
      </header>

      {/* Grid */}
      <div className="flex flex-wrap justify-center gap-8 px-8 max-w-7xl">
        {candidates.map((c) => (
          <CandidateCard key={c.name} {...c} />
        ))}
      </div>
    </section>
  );
}
