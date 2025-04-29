"use client";

import Header from "../components/Header";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col bg-[#14344B] overflow-x-hidden">
      <Header />
      <Hero />
    </main>
  );
}
