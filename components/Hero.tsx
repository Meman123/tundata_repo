"use client";

import PulseLine from "@/app/PulseLine";

export default function Hero() {
  return (
    <section className="w-full min-h-[80vh] px-6 sm:px-12 md:px-24 py-10 bg-[#14344B] flex flex-col justify-center items-center gap-50 overflow-hidden relative">
      {/* Bloque de texto */}
      <div className="w-full max-w-5xl px-6 sm:px-12 flex flex-col justify-center items-center gap-12 text-center mt-16">
        <h1 className="text-6xl md:text-7xl font-bold leading-tight text-white capitalize">
          Datos Públicos De{" "}
          <span className="text-[#F39C12]">Duitama</span> Para Todos
        </h1>

        <p className="text-2xl md:text-3xl font-normal leading-relaxed text-gray-200">
          Tundata Sigue, organiza y comparte{" "}
          <span className="text-[#F39C12]">datos públicos</span> de Duitama para
          una ciudadanía <span className="text-[#F39C12]">más informada</span> y
          un gobierno <span className="text-[#F39C12]">más transparente</span>.
        </p>
      </div>

      {/* Línea PulseLine */}
      <div className="w-full">
        <PulseLine />
      </div>
    </section>
  );
}
