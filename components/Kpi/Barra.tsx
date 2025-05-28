'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Barra.module.css';
import { gsap } from 'gsap';
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrambleTextPlugin);

export default function BarraPresupuesto({
  gastado,
  total,
}: {
  gastado: number;
  total: number;
}) {
  const porcentaje = total > 0 ? Math.min((gastado / total) * 100, 100) : 0;
  const porcentajeTexto = `${porcentaje.toFixed(1)}% ejecutado`;

  const fillRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const valorIzqRef = useRef<HTMLSpanElement>(null);
  const porcentajeRef = useRef<HTMLSpanElement>(null);

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Anima el fill de la barra
          if (fillRef.current) {
            gsap.fromTo(
              fillRef.current,
              { width: '0%' },
              {
                width: `${porcentaje}%`,
                duration: 2,
                ease: 'power2.out',
              },
            );
          }

          // Anima el número gastado
          if (valorIzqRef.current) {
            gsap.to(valorIzqRef.current, {
              duration: 1.5,
              scrambleText: {
                text: `$${gastado.toLocaleString()}M`,
                chars: '0123456789,',
                revealDelay: 0.5,
              },
              ease: 'none',
            });
          }

          // Anima el porcentaje
          if (porcentajeRef.current) {
            gsap.to(porcentajeRef.current, {
              duration: 1.5,
              scrambleText: {
                text: porcentajeTexto,
                chars: '0123456789%',
                revealDelay: 0.5,
              },
              ease: 'none',
            });
          }

          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [porcentaje, gastado, porcentajeTexto, hasAnimated]);

  const gastadoFormateado = gastado.toLocaleString();
  const totalFormateado = total.toLocaleString();
  const valorTexto = `${gastadoFormateado}M de ${totalFormateado}M ejecutados (${porcentaje.toFixed(1)}%)`;

  return (
    <div
      className={styles.wrapper}
      ref={containerRef}
      aria-label="Progreso del presupuesto anual"
    >
      <div className={styles.track}>
        <div
          className={styles.fill}
          ref={fillRef}
          style={{ width: `${hasAnimated ? porcentaje : 0}%` }}
          role="progressbar"
          aria-valuenow={porcentaje}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={valorTexto}
        >
          <div className={styles.shine} />
          <span className={styles.valorIzq} ref={valorIzqRef}>
            ${gastado.toLocaleString()}M
          </span>
        </div>

        <span className={styles.valorDer}>${total.toLocaleString()}M</span>

        <div className={styles.labelCentroWrapper}>
          <span className={styles.labelCentro} ref={porcentajeRef}>
            {porcentajeTexto}
          </span>
        </div>
      </div>

      <div className={styles.subtitulo}>
        % del <span className={styles.highlight}>Presupuesto Anual</span>{' '}
        Ejecutado
      </div>
    </div>
  );
}
