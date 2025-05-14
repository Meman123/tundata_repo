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
import rawData from '@/data/DonutSector.json'
import styles from './RadialCard.module.css'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function DonutSector() {
  const chartRef = useRef<Chart<'doughnut', number[], unknown> | null>(null)
  const [visibility, setVisibility] = useState<boolean[]>([])

  useEffect(() => {
    setVisibility(rawData.map(() => true))
  }, [])

  useEffect(() => {
    const onResize = () => chartRef.current?.resize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const labels = rawData.map(d => d.sector_norm)
  const values = rawData.map(d => Number(d.total_millones))
  const total = values.reduce((s, v) => s + v, 0)
  const colors = [
  '#f48e07', // index 0 → hsl(39, 89%, 52%) → Naranja Tundata
  '#3bb1e8', // index 1
  '#56e8e3', // index 2
  '#62e88e', // index 3
  '#b1e83b', // index 4 (desviado para evitar chocar con naranja)
  '#e8dc3b', // index 5
  '#e8a03b', // index 6
  '#e8553b', // index 7
  '#e83bb6', // index 8
  '#993be8'  // index 9
  ]

  

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
          weight: 'bold' as const,
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
        <b className={styles.h1Radial}>Gasto por Sector</b>
        <div className={styles.pRadial}>
          Visualiza cómo se reparte el gasto público <span className={styles.highlight}>entre los distintos sectores</span>
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
