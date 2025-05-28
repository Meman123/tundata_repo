'use client';

import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './Kpicard.module.css';
import { gsap } from 'gsap';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

interface KpiCardProps {
  value: number | string;
  label: string | ReactNode;
  description: string | ReactNode;
  showSymbol?: boolean;
}

const Kpicard: FC<KpiCardProps> = ({
  value,
  label,
  description,
  showSymbol = true,
}) => {
  const valueRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          if (valueRef.current) {
            gsap.fromTo(
              valueRef.current,
              { scrambleText: { text: '', chars: '0123456789', speed: 0.4 } },
              {
                scrambleText: {
                  text: value.toString(),
                  delimiter: '',
                  revealDelay: 0.1,
                },
                duration: 2,
                ease: 'power2.out',
              },
            );
          }

          observer.disconnect(); // solo se anima una vez
        }
      },
      { threshold: 0.6 }, // 60% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div className={styles.kpicard} ref={containerRef}>
      <div className={styles.parent}>
        <b className={styles.b}>
          {showSymbol && <span className={styles.symbol}>$</span>}
          <span ref={valueRef} className={styles.span} />
        </b>
        <b className={styles.label}>{label}</b>
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default Kpicard;
