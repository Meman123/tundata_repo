// components/DonutSector.tsx
'use client'

import { useRef, useEffect } from 'react'
import styles from './GraficaEvo.module.css'
import { PolarArea } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js'
import type { Chart } from 'chart.js'
import sectorData from '@/data/DonutSector.json'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

export default function DonutSector() {
    const chartRef = useRef<Chart<'polarArea', number[], unknown> | null>(null)


  useEffect(() => {
    const handleResize = () => chartRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const labels = sectorData.map(d => d.sector_norm)
  const values = sectorData.map(d => d.total_millones)
  const colors = [
    '#f39c12', '#3498db', '#1abc9c', '#9b59b6', '#e74c3c',
    '#8e44ad', '#16a085', '#c0392b', '#2980b9', '#27ae60'
  ]

  const data = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors.slice(0, labels.length),
      borderWidth: 1
    }]
  }

  return (
    <div className={styles.frameParent}>
      <div className={styles.evolucionHeader}>
        <b className={styles.title}>Gasto por Sector</b>
        <div className={styles.subtitle}>
          Participación de cada sector en el gasto total del 2025
        </div>
      </div>
      <div className={styles.rectangleParent}>
        <div className={styles.chartContainerRadial}>
          <PolarArea
            ref={chartRef as any}
            data={data}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: '#fff',
                    font: { family: 'IBM Plex Sans', size: 13 }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => {
                      const valor = ctx.raw as number
                      const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0)
                      const porcentaje = ((valor / total) * 100).toFixed(1)
                      return `${ctx.label}: $${valor.toLocaleString('es-CO')} millones (${porcentaje}%)`
                    }
                  }
                }
              },
              scales: {
                r: {
                  ticks: {
                    color: '#ffffffcc',
                    font: { family: 'Roboto Mono', size: 12 },
                    backdropColor: 'transparent'
                  },
                  grid: { color: '#ffffff22' },
                  angleLines: { color: '#ffffff22' },
                  pointLabels: {
                    color: '#ffffffcc',
                    font: { family: 'IBM Plex Sans', size: 13 }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
