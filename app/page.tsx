"use client";

import Header from "../components/Header";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Header />
      <Hero />
    </main>
  );
}
