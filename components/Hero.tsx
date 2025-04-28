"use client";

import PulseLine from "@/app/PulseLine";

export default function Hero() {
  return (
    <section className="w-full min-h-[80vh] px-6 sm:px-12 md:px-24 py-10 bg-[#14344B] flex flex-col justify-center items-center gap-20 overflow-hidden relative">
      {/* Bloque de texto */}
      <div className="w-full max-w-4xl px-6 sm:px-12 flex flex-col justify-center items-center gap-10 text-center">
    <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white capitalize">
      Datos Públicos De <span className="text-[#F39C12]">Duitama</span> Para Todos
    </h1>

    <p className="text-sm md:text-md lg:text-lg xl:text-xl font-normal leading-relaxed text-gray-200">
      Seguimos, organizamos y compartimos <span className="text-[#F39C12]">datos públicos</span> de Duitama para
      impulsar una ciudadanía <span className="text-[#F39C12]">más informada</span> y promover un gobierno
      <span className="text-[#F39C12]"> más transparente</span>.
    </p>
  </div>


      {/* Línea PulseLine */}
      <div className="w-full">
        <PulseLine />
      </div>
    </section>
  );
}
