// components/Kpicard.tsx
import type { FC, ReactNode } from 'react'
import styles from './Kpicard.module.css'

interface KpiCardProps {
  value: number | string
  label: string | ReactNode
  description: string | ReactNode
  showSymbol?: boolean
}

const Kpicard: FC<KpiCardProps> = ({ value, label, description, showSymbol = true }) => {
  return (
    <div className={styles.kpicard}>
      <div className={styles.parent}>
        <b className={styles.b}>
          {showSymbol && <span className={styles.symbol}>$</span>}
          <span className={styles.span}>{value}</span>
        </b>
        <b className={styles.label}>{label}</b>
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  )
}

export default Kpicard
