"use client";

import { FC } from "react";
import PulseLine from "@/app/PulseLine";
import styles from "./Hero.module.css";

interface HeroProps {
  height: string;   // viene del hook useAvailableViewportHeight
}

const Hero: FC<HeroProps> = ({ height }) => (
<section style={{ minHeight: height }} className={styles.hero}>
  <div className={styles.layout}>
    <div className={styles.text}>
      <h1 className={styles.title}>
        Datos Públicos de{" "}
        <span className={styles.highlight}>Duitama</span> para Todos
      </h1>

      <p className={styles.subtitle}>
        Transformamos <span className={styles.highlight}>datos públicos</span> de
        Duitama y <span className={styles.highlight}>facilitamos</span> su
        visualización para impulsar una ciudadanía{" "}
        <span className={styles.highlight}>más informada</span> y promover un
        gobierno <span className={styles.highlight}>más transparente</span>.
      </p>
    </div>

    <PulseLine />
  </div>
</section>

);

export default Hero;
