"use client";

import Header from "../components/Header";
import Hero from "../components/Hero";
import CandidatesSection from "../components/CandidatesSection";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col bg-primary overflow-x-hidden">
      <Header />
      <Hero />
      <div className="h-1" aria-hidden="true" />
      <CandidatesSection />
    </main>
  );
}
