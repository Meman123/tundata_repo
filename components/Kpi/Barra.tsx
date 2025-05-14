'use client'

import styles from './Barra.module.css'

export default function BarraPresupuesto({
  gastado,
  total
}: {
  gastado: number
  total: number
}) {
  // Ensure total is not zero to avoid division by zero, and cap percentage at 100%
  const porcentaje = total > 0 ? Math.min((gastado / total) * 100, 100) : 0;
  const porcentajeTexto = `${porcentaje.toFixed(1)}% ejecutado`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${porcentaje}%` }}
        >
          <div className={styles.shine} />
          {/* Gastado: Positioned within the fill. Will be clipped if fill is too small. */}
          <span className={styles.valorIzq}>
            ${gastado.toLocaleString()}M
          </span>
        </div>

        {/* Presupuesto Total: Positioned on the right side of the track. */}
        <span className={styles.valorDer}>
          ${total.toLocaleString()}M
        </span>

        {/* Porcentaje Ejecutado: Centered on the track. */}
        <div className={styles.labelCentroWrapper}>
          <span className={styles.labelCentro}>
            {porcentajeTexto}
          </span>
        </div>
      </div>

      <div className={styles.subtitulo}>
        % del <span className={styles.highlight}>Presupuesto Anual</span> Ejecutado
      </div>
    </div>
  )
}