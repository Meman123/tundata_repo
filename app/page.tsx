"use client";

import { useRef } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import CandidatesSection from "../components/CandidatesSection";
import { useAvailableViewportHeight } from "../hooks/useAvailableViewportHeight";

export default function Home() {
  const headerRef = useRef<HTMLElement | null>(null); // 👈 esto es clave
  const heroHeight = useAvailableViewportHeight(headerRef);

  return (
    <main className="w-full min-h-screen flex flex-col bg-primary overflow-x-hidden">
      <Header ref={headerRef} />
      <Hero height={heroHeight} />
      <div className="h-1" aria-hidden="true" />
      <CandidatesSection />
    </main>
  );
}
