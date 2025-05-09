'use client'

import React, { useState } from 'react'
import styles from './GraficaEvo.module.css'
import { Line } from 'react-chartjs-2'
import rawData from '@/data/evolucionMensual.json'
import 'chart.js/auto'

type EvolucionItem = {
  mes: string
  sector_norm: string
  total: number | string
}

const transformarDatosPlano = (dataPlano: EvolucionItem[]) => {
  const mesesOrden = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
  const etiquetas = ['Ene', 'Feb', 'Mar', 'Abr', 'May']

  const sectores = Array.from(new Set(dataPlano.map(d => d.sector_norm?.trim())))
  const mapaSectorMes: Record<string, Record<string, number>> = {}

  for (const { mes, sector_norm, total } of dataPlano) {
    const mesKey = mes.trim()
    const sector = sector_norm?.trim()
    const monto = parseInt(total as string) / 1_000_000

    if (!mapaSectorMes[sector]) mapaSectorMes[sector] = {}
    mapaSectorMes[sector][mesKey] = monto
  }

  const datasets = sectores.map((sector, i) => {
    const color = `hsl(${i * 50}, 70%, 55%)`
    return {
      label: sector,
      data: mesesOrden.map(m => Math.round(mapaSectorMes[sector]?.[m] || 0)),
      borderColor: color,
      color,
      backgroundColor: color,
      tension: 0.3,
      pointRadius: 4,
      fill: false,
    }
  })

  return {
    labels: etiquetas,
    datasets
  }
}


const GraficaEvolucion = () => {
  const datos = transformarDatosPlano(rawData)
  const [activos, setActivos] = useState(datos.datasets.map(d => d.label))

  const toggleSector = (sector: string) => {
    const isActive = activos.includes(sector)
    setActivos(prev =>
      isActive
        ? prev.filter(s => s !== sector)
        : [...prev.filter(s => s !== sector), sector]
    )
  }

  const dataFiltrada = {
    labels: datos.labels,
    datasets: datos.datasets.filter(d => activos.includes(d.label))
  }

  return (
    <div className={styles.frameParent}>
      <div className={styles.evolucionHeader}>
        <b className={styles.title}>Evolución Mensual del Gasto (2025)</b>
        <div className={styles.subtitle}>
          Visualiza el comportamiento mensual del gasto por sector
        </div>
      </div>

      <div className={styles.rectangleParent}>
        <div className={styles.chartWrapper}>
          <div className={styles.chartInner}>
            <Line
              data={dataFiltrada}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animations: {
                  tension: {
                    duration: 400,
                    easing: 'easeOutSine',
                    from: 0.2,
                    to: 0.2,
                    loop: false
                  },
                  opacity: {
                    duration: 400,
                    easing: 'easeOutSine',
                    from: 0,
                    to: 1
                  }
                },
                transitions: {
                  show: {
                    animations: {
                      opacity: { from: 0, to: 1 }
                    }
                  },
                  hide: {
                    animations: {
                      opacity: { from: 1, to: 0 }
                    }
                  }
                },
                plugins: {
                    tooltip: {
                        mode: 'nearest',
                        axis: 'xy',
                        intersect: false,
                        position: 'nearest',          // 👈 permite mover el tooltip más inteligentemente
                        padding: 12,                  // 👈 da aire para no chocar bordes
                        displayColors: true,
                        usePointStyle: true,
                        callbacks: {
                          title: (items) => items[0].label ?? '',
                          label: (ctx) => {
                            const sector = ctx.dataset.label ?? ''
                            const valor = `$${ctx.parsed.y.toLocaleString('es-CO')} millones`
                            return `${sector}: ${valor}`
                          },
                          labelPointStyle: () => ({
                            pointStyle: 'rect',
                            rotation: 0
                          })
                        }
                      }
                      ,
                    legend: { display: false }
                  }
                  
                  
                  ,
                  
                scales: {
                  x: {
                    ticks: { color: '#fff' },
                    grid: { color: '#ffffff22' },
                  },
                  y: {
                    ticks: {
                      color: '#fff',
                      callback: value =>
                        `${Number(value).toLocaleString('es-CO')}`,
                    },
                    grid: { color: '#ffffff22' },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className={styles.botonParent}>
          {datos.datasets.map(d => (
            <button
              key={d.label}
              className={`${styles.boton} ${activos.includes(d.label) ? styles.activo : ''}`}
              onClick={() => toggleSector(d.label)}
            >
              <span
                className={styles.colorDot}
                style={{ backgroundColor: d.color }}
              />
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GraficaEvolucion
