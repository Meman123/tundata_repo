'use client'

import { useRef, useEffect, useState } from 'react'
import { PolarArea } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip
} from 'chart.js'
import type { Chart, TooltipItem } from 'chart.js'
import rawData from '@/data/DonutSector.json'
import styles from './RadialCard.module.css'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip)

export default function DonutSector() {
  const chartRef = useRef<Chart<'polarArea', number[], unknown> | null>(null)
  const [visibility, setVisibility] = useState<boolean[]>([])

  useEffect(() => {
    // Inicializa el estado de visibilidad según datos
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
    '#f39c12', '#3498db', '#1abc9c', '#9b59b6',
    '#e74c3c', '#27ae60', '#8e44ad', '#2980b9'
  ]

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors.slice(0, labels.length),
      borderWidth: 1
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'polarArea'>) => {
            const val = Number(ctx.raw)
            const pct = ((val / total) * 100).toFixed(1)
            return `${ctx.label}: $${val.toLocaleString()}M (${pct}%)`
          }
        }
      }
    },
    scales: {
      r: {
        grid: { color: '#ffffff22' },
        angleLines: { color: '#ffffff22' },
        pointLabels: { color: '#ffffffcc', font: { size: 12, family: 'IBM Plex Sans' } },
        ticks: { color: '#ffffffcc', font: { size: 12, family: 'IBM Plex Sans' }, backdropColor: 'transparent' }
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
        <PolarArea ref={chartRef} data={data} options={options} />
      </div>

      <div className={styles.buttonsplaceholder}>
        {labels.map((label, i) => (
          <button
            key={i}
            className={`${styles.legendButton} ${!visibility[i] ? styles.disabled : ''}`}
            onClick={() => toggle(i)}
          >
            <span
              className={styles.legendDot}
              style={{ backgroundColor: colors[i] }}
            />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
