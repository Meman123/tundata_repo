// components/Frame.tsx
import type { NextPage } from 'next'
import styles from './Frame.module.css'
import Kpicard from './Kpicard'
import GraficaEvolucion from './GraficaEvo'
import RadialPair from './RadialPair'

function formatMillones(value: number): string {
    const millones = value / 1_000_000
    return millones >= 10
      ? Math.round(millones / 1000).toString() // de mil millones → en miles
      : millones.toFixed(1).replace(/\.0$/, '') // deja solo un decimal si es <10
  }
  

const Frame: NextPage = () => {
  return (
    <div className={styles.frameParent}>
      <div className={styles.headerSection}>
        <b className={styles.title}>
          ¿En qué se gasta el dinero público en Duitama?
        </b>
        <div className={styles.subtitle}>
          Análisis de contratos firmados en 2025 (Datos SECOP)
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <Kpicard
          value={formatMillones(47277094723)}
          label={<>Mil Millones <span style={{ color: 'var(--Naranja-Tundata)' }}>(COP))</span></>}
          description={<>Dinero Público <span style={{ color: 'var(--Naranja-Tundata)' }}>Gastado</span></>}
          showSymbol={true}
        />
        <Kpicard
          value={590}
          label={<>Contratos en  <span style={{ color: 'var(--Naranja-Tundata)' }}>2025</span></>}
          description={<> <span style={{ color: 'var(--Naranja-Tundata)' }}>Contratos firmados </span>en el año </>}
          showSymbol={false}
        />
        <Kpicard
          value={formatMillones(3803435028)}
          label={<>Mil Millones <span style={{ color: 'var(--Naranja-Tundata)' }}>(COP)</span></>}
          description={<>Mayor <span style={{ color: 'var(--Naranja-Tundata)' }}>Contrato</span> Individual</>}
          showSymbol={true}
        />
        <Kpicard
        value="Feb"
        label={<>242 <span style={{ color: 'var(--Naranja-Tundata)' }}>contratos</span></>}
        description={<>Mes con más <span style={{ color: 'var(--Naranja-Tundata)' }}>contratos</span></>}
        showSymbol={false}
        />

      </div>
      <GraficaEvolucion />
      <RadialPair />
    </div>
  )
}

export default Frame
