// components/RadialPair.tsx
import styles from './RadialPair.module.css'
import DonutSector from './DonutSector'
import DonutEntidad from './DonutEntidad'


export default function RadialPair() {
  return (
    <section className={styles.radialGrid}>
      <DonutSector />
        <DonutEntidad />
      
    </section>
  )
}
