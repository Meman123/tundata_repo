"use client";

import PulseLine from "@/app/PulseLine";

export default function Hero() {
  return (
    <section
      className="w-full flex-1 min-h-0 px-6 sm:px-12 md:px-24 pt-12 pb-10 bg-[#14344B]
                 flex flex-col justify-start items-center overflow-hidden relative"
    >
      {/* Contenedor de bloque de texto y PulseLine */}
      <div className="w-full flex flex-col items-center gap-20">
        {/* Bloque de texto */}
        <div className="w-full max-w-4xl px-6 sm:px-12 flex flex-col justify-center items-center gap-6 text-center">
        <h1 className="text-h1 text-text text-center max-w-4xl">
          Datos Públicos de <span className="text-primary">Duitama</span> para Todos
        </h1>

        <p className="text-body text-subtle text-center max-w-hero-text">
          Transformamos <span className="text-primary">datos públicos</span> de Duitama y <span className="text-primary">facilitamos</span> su visualización para impulsar una ciudadanía <span className="text-primary">más informada</span> y promover un gobierno <span className="text-primary">más transparente</span>.
        </p>
        </div>


        {/* Línea PulseLine */}
        <div className="w-full">
          <PulseLine />
        </div>
      </div>
    </section>
  );
}
