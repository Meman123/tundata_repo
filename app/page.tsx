'use client';

import { useRef, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import { useAvailableViewportHeight } from '../hooks/useAvailableViewportHeight';
import Frame from '@/components/Kpi/Frame';

// GSAP + Plugins
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Home() {
  const headerRef = useRef<HTMLElement | null>(null);
  const heroHeight = useAvailableViewportHeight(headerRef);

  useEffect(() => {
    const smoother = ScrollSmoother.create({
      smooth: 1.5,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
      content: '#smooth-content',
      wrapper: '#smooth-wrapper',
    });

    return () => {
      if (smoother) smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <main
        id="smooth-content"
        className="w-full min-h-screen flex flex-col bg-Naranja overflow-x-hidden"
      >
        <Header ref={headerRef} />
        <Hero height={heroHeight} />
        <div className="h-1" aria-hidden="true" />
        <section id="datos">
          <Frame />
        </section>
      </main>
    </div>
  );
}
