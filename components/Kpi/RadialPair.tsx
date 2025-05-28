'use client';

import DonutSector from './DonutSector';
import DonutEntidad from './DonutEntidad';
import styles from './RadialPair.module.css';

// Removed useState, useEffect, useRef, gsap, ScrollTrigger
// The component is now a simple presentational component.
export default function RadialPair() {
  return (
    <section
      // The wrapperRef and dynamic style for minHeight are removed
      // as the parent will handle the loading state and placeholder.
      className={styles.radialGrid}
    >
      {/* The conditional rendering based on 'show' is removed.
          DonutSector and DonutEntidad are now always rendered if RadialPair is rendered. */}
      <DonutSector />
      <DonutEntidad />
    </section>
  );
}
