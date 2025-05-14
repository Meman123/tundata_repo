"use client";

import { FC, useCallback } from "react";
import PulseLine from "@/app/PulseLine";
import styles from "./Hero.module.css";
import { gsap } from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

interface HeroProps {
  height: string; // viene de useAvailableViewportHeight
}

const Hero: FC<HeroProps> = ({ height }) => {
  /** Scroll suave hacia la sección de datos */
  const handleClick = useCallback(() => {
    gsap.to(window, {
  duration: 1.5,
  scrollTo: { y: "#datos", offsetY: 0 },
  ease: "power4.inOut",
    });
  }, []);

  return (
    <section style={{ minHeight: height }} className={styles.hero}>
      <div className={styles.layout}>
        <div className={styles.text}>
          <h1 className={styles.title}>
            Datos Públicos de <span className={styles.highlight}>Duitama</span>{" "}
            para Todos
          </h1>

          <p className={styles.subtitle}>
            Transformamos <span className={styles.highlight}>datos públicos</span>{" "}
            de Duitama y <span className={styles.highlight}>facilitamos</span> su
            visualización para impulsar una ciudadanía{" "}
            <span className={styles.highlight}>más informada</span> y promover un
            gobierno <span className={styles.highlight}>más transparente</span>.
          </p>

          {/* CTA */}
          <button className={styles.cta} onClick={handleClick}>
            Explora los datos
          </button>
        </div>

        <PulseLine />
      </div>
    </section>
  );
};

export default Hero;
