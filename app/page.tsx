"use client";

import Header from "../components/Header";
import Hero from "../components/Hero";
import CandidatesSection from "../components/CandidatesSection";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Header />
      <Hero />
      <CandidatesSection />
    </main>
  );
}
