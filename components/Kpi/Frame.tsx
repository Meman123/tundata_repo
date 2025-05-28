// components/Frame.tsx
import type { NextPage } from 'next';
import styles from './Frame.module.css';
import Kpicard from './Kpicard';
import GraficaLazy from './GraficaLazy';
// import RadialPair from './RadialPair'; // Removed static import
// import BarraPresupuesto from './Barra'; // Removed static import
import dynamic from 'next/dynamic';

// Dynamically import RadialPair
const RadialPair = dynamic(() => import('./RadialPair'), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: '750px', // Original minHeight from RadialPair's wrapper
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
        fontSize: '1.2rem',
        color: '#e0e0e0',
        backgroundColor: 'var(--Azul-Fondo-Tundata, #0d2c45)',
        borderRadius: '8px',
      }}
    >
      Cargando gráficos radiales...
    </div>
  ),
});

// Dynamically import BarraPresupuesto
const BarraPresupuesto = dynamic(() => import('./Barra'), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-live="polite"
      style={{
        height: '150px', // Approximate height of the BarraPresupuesto component
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
        fontSize: '1.2rem',
        color: '#e0e0e0',
        backgroundColor: 'var(--Azul-Fondo-Tundata, #0d2c45)',
        borderRadius: '8px',
        margin: '20px 0', // To mimic some spacing it might have
      }}
    >
      Cargando barra de presupuesto...
    </div>
  ),
});

function formatMillones(value: number): string {
  const millones: number = value / 1_000_000;
  return millones >= 10
    ? Math.round(millones / 1000).toString() // de mil millones → en miles
    : millones.toFixed(1).replace(/\.0$/, ''); // deja solo un decimal si es <10
}

const Frame: NextPage = () => {
  return (
    <div className={styles.frameParent}>
      <div className={styles.headerSection}>
        <h2 className={styles.title}>
          ¿Cómo se gasta el dinero público en{' '}
          <span className={styles.highlight}>Duitama</span>?
        </h2>
        <div className={styles.subtitle}>
          Estos <span className={styles.highlight}>datos</span> provienen de la
          base oficial de contratación estatal{' '}
          <span className={styles.highlight}>(SECOP)</span> y recogen
          <span className={styles.highlight}>
            {' '}
            todos los contratos firmados
          </span>{' '}
          entre el 1 de enero y el 30 de abril de 2025.
        </div>
      </div>
      <div className={styles.divisionLine}></div>
      <div className={styles.kpiGrid}>
        <Kpicard
          value={formatMillones(47277094723)}
          label={
            <>
              Mil Millones{' '}
              <span style={{ color: 'var(--Naranja-Tundata)' }}>(COP)</span>
            </>
          }
          description={
            <>
              Dinero Público{' '}
              <span style={{ color: 'var(--Naranja-Tundata)' }}>Gastado</span>
            </>
          }
          showSymbol={true}
        />
        <Kpicard
          value={590}
          label={<>Contratos</>}
          description={
            <>
              {' '}
              <span style={{ color: 'var(--Naranja-Tundata)' }}>
                Contratos
              </span>{' '}
              a la fecha{' '}
            </>
          }
          showSymbol={false}
        />
        <Kpicard
          value={formatMillones(3803435028)}
          label={
            <>
              Mil Millones{' '}
              <span style={{ color: 'var(--Naranja-Tundata)' }}>(COP)</span>
            </>
          }
          description={
            <>
              <span style={{ color: 'var(--Naranja-Tundata)' }}>
                Mayor Contrato
              </span>{' '}
              Individual
            </>
          }
          showSymbol={true}
        />
        <Kpicard
          value="242"
          label={
            <>
              <span style={{ color: 'var(--Naranja-Tundata)' }}>Febrero</span>
            </>
          }
          description={
            <>
              Mes con{' '}
              <span style={{ color: 'var(--Naranja-Tundata)' }}>
                más contratos
              </span>
            </>
          }
          showSymbol={false}
        />
      </div>
      <BarraPresupuesto gastado={47000} total={274000} />
      <div className={styles.divisionLine}></div>
      <GraficaLazy />
      <RadialPair />
    </div>
  );
};

export default Frame;
