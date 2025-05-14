'use client'

import { useRef, useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import type { Chart, TooltipItem } from 'chart.js'
import rawData from '@/data/DonutEntidad.json'
import styles from './RadialCard.module.css'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function DonutEntidad() {
  const INITIAL_VISIBLE_IDX = new Set([0, 1, 2])

const chartRef = useRef<Chart<'doughnut', number[], unknown> | null>(null)

const [visibility, setVisibility] = useState<boolean[]>(
  rawData.map((_, i) => INITIAL_VISIBLE_IDX.has(i))
)

// sincronizar visibilidad inicial en Chart.js
useEffect(() => {
  const chart = chartRef.current
  if (!chart) return

  visibility.forEach((shouldBeVisible, i) => {
    const isCurrentlyVisible = chart.getDataVisibility(i)
    if (shouldBeVisible !== isCurrentlyVisible) {
      chart.toggleDataVisibility(i)
    }
  })

  chart.update()
}, [])




  useEffect(() => {
    const onResize = () => chartRef.current?.resize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const labels = rawData.map(d => d.nombre_entidad_norm)
  const values = rawData.map(d => Number(d.total_millones))
  const total = values.reduce((s, v) => s + v, 0)
function generateNiceColor(index: number, total: number): string {
  const hueStart = 37;
  const hueRange = 300;
  const hue = (hueStart + index * (hueRange / total)) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}

  const colors = labels.map((_, i) => generateNiceColor(i, labels.length))
  
  const data = {
    labels,
    datasets: [{
      data: values.map((v, i) => visibility[i] ? v : 0),
      backgroundColor: colors.slice(0, labels.length),
      borderWidth: 1
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e4b68',
        titleFont: {
          family: 'IBM Plex Sans',
          size: 13,
          weight: "bold" as const,
        },
        bodyFont: {
          family: 'IBM Plex Sans',
          size: 13,
        },
        borderColor: '#f48e07',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (ctx: TooltipItem<'doughnut'>) => {
            const val = Number(ctx.raw)
            const pct = ((val / total) * 100).toFixed(1)
            return `${ctx.label}: $${val.toLocaleString()}M (${pct}%)`
          }
        }
      }
    }
  }

  function toggle(i: number) {
    const chart = chartRef.current
    if (!chart) return
    chart.toggleDataVisibility(i)
    chart.update()
    setVisibility(vis => {
      const next = [...vis]
      next[i] = !next[i]
      return next
    })
  }

  return (
    <div className={styles.radial}>
      <div className={styles.radialtextoframe}>
        <b className={styles.h1Radial}>Gasto por Entidad</b>
        <div className={styles.pRadial}>
          Visualiza cómo se reparte el gasto público <span className={styles.highlight}>entre las distintas entidades</span>
        </div>
      </div>

      <div className={styles.radialplaceholder}>
        <Doughnut ref={chartRef} data={data} options={options} />
      </div>

      <div className={styles.botonParent}>
        {labels.map((label, i) => (
          <button
            key={i}
            className={`${styles.boton} ${visibility[i] ? styles.activo : ''}`}
            onClick={() => toggle(i)}
            style={{
              backgroundColor: visibility[i] ? colors[i] : 'var(--Azul-Tundata)',
              color: visibility[i] ? 'var(--Azul-Tundata)' : 'white'
            }}
          >
            <span className={styles.colorDot} style={{ backgroundColor: colors[i] }} />
            {label.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
