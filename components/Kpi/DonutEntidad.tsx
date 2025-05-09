// components/DonutEntidad.tsx
'use client'

import { useRef, useEffect } from 'react'
import styles from './GraficaEvo.module.css'
import { PolarArea } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import type { Chart } from 'chart.js'
import entidadData from '@/data/DonutEntidad.json'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

export default function DonutEntidad() {
  const chartRef = useRef<Chart<'polarArea'>>(null)

  useEffect(() => {
    const handleResize = () => chartRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const labels = entidadData.map(d => d.nombre_entidad_norm)
  const values = entidadData.map(d => d.total_millones)
  const colors = [
    '#f39c12', '#3498db', '#1abc9c', '#9b59b6', '#e74c3c'
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
        <b className={styles.title}>Gasto por Entidad</b>
        <div className={styles.subtitle}>
          Distribución del gasto entre las principales entidades contratantes de Duitama en 2025
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
                    font: {
                      family: 'IBM Plex Sans',
                      size: 13
                    }
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
                    font: {
                      family: 'Roboto Mono',
                      size: 12
                    },
                    backdropColor: 'transparent'
                  },
                  grid: { color: '#ffffff22' },
                  angleLines: { color: '#ffffff22' },
                  pointLabels: {
                    color: '#ffffffcc',
                    font: {
                      family: 'IBM Plex Sans',
                      size: 13
                    }
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
