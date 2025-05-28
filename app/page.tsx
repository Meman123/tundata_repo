'use client';

import { useRef } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { useAvailableViewportHeight } from '../hooks/useAvailableViewportHeight';
import Frame from '@/components/Kpi/Frame';

// GSAP + Plugins
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const headerRef = useRef<HTMLElement | null>(null);
  const heroHeight = useAvailableViewportHeight(headerRef);

  return (
    <main className="w-full min-h-screen flex flex-col bg-Naranja overflow-x-hidden">
      <Header ref={headerRef} />
      <Hero height={heroHeight} />
      <div className="h-1" aria-hidden="true" />
      <section id="datos">
        <Frame />
      </section>
    </main>
  );
}
