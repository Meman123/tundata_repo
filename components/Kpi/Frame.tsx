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
          ¿Cómo se gasta el dinero público en <span className={styles.highlight}>Duitama</span>?
        </b>
        <div className={styles.subtitle}>
        Estos <span className={styles.highlight}>datos</span> provienen de la base oficial 
        de contratación estatal <span className={styles.highlight}>(SECOP)</span> y recogen
        <span className={styles.highlight}> todos los contratos firmados</span> entre el 1 de
        enero y el 30 de abril de 2025.
        </div>
      </div>
      <div className={styles.divisionLine}></div>
      <div className={styles.kpiGrid}>
        <Kpicard
          value={formatMillones(47277094723)}
          label={<>Mil Millones <span style={{ color: 'var(--Naranja-Tundata)' }}>(COP))</span></>}
          description={<>Dinero Público <span style={{ color: 'var(--Naranja-Tundata)' }}>Gastado</span></>}
          showSymbol={true}
        />
        <Kpicard
          value={590}
          label={<>Contratos</>}
          description={<> <span style={{ color: 'var(--Naranja-Tundata)' }}>Contratos</span> a la fecha </>}
          showSymbol={false}
        />
        <Kpicard
          value={formatMillones(3803435028)}
          label={<>Mil Millones <span style={{ color: 'var(--Naranja-Tundata)' }}>(COP)</span></>}
          description={<><span style={{ color: 'var(--Naranja-Tundata)' }}>Mayor Contrato</span> Individual</>}
          showSymbol={true}
        />
        <Kpicard
        value="242"
        label={<><span style={{ color: 'var(--Naranja-Tundata)' }}>Febrero</span></>}
        description={<>Mes con <span style={{ color: 'var(--Naranja-Tundata)' }}>más contratos</span></>}
        showSymbol={false}
        />

      </div>
      <div className={styles.divisionLine}></div>
      <GraficaEvolucion />
      <RadialPair />
    </div>
  )
}

export default Frame
