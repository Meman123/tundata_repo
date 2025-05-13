"use client";

import { useState, useEffect, FC } from 'react';
import styles from './RinconcitoTundama.module.css';

interface Fact {
  id: number;
  text: string;
  source?: string; // Opcional, por si quieres añadir una fuente
}

const duitamaFacts: Fact[] = [
  { id: 1, text: "Duitama es conocida como <span class='" + styles.highlight + "'>'La Perla de Boyacá'</span>." },
  { id: 2, text: "Es la orgullosa capital de la Provincia del <span class='" + styles.highlight + "'>Tundama</span>." },
  { id: 3, text: "Situada a una altitud promedio de <span class='" + styles.highlight + "'>2,530 msnm</span>." },
  { id: 4, text: "Corazón cívico y comercial del <span class='" + styles.highlight + "'>Valle de Tundama</span>." },
  { id: 5, text: "Reconocida por su activa vida cultural y <span class='" + styles.highlight + "'>eventos tradicionales</span>." }
];

const RinconcitoTundama: FC = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); // Comienza el fade-out
      setTimeout(() => {
        setCurrentFactIndex((prevIndex) => (prevIndex + 1) % duitamaFacts.length);
        setIsVisible(true); // Comienza el fade-in con el nuevo dato
      }, 500); // Tiempo para la animación de fade-out (debe coincidir con la duración de la transición CSS)
    }, 7000); // Cambia el dato cada 7 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.rinconcitoContainer}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          Rinconcito <span className={styles.highlight}>Tundama</span>
        </h2>
        <div className={styles.factDisplay}>
          <p
            className={`${styles.factText} ${isVisible ? styles.visible : styles.hidden}`}
            dangerouslySetInnerHTML={{ __html: duitamaFacts[currentFactIndex].text }}
          />
        </div>
        {duitamaFacts[currentFactIndex].source && (
          <p className={styles.factSource}>
            Fuente: {duitamaFacts[currentFactIndex].source}
          </p>
        )}
      </div>
    </section>
  );
};

export default RinconcitoTundama;