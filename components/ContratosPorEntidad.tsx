// components/Frame.tsx
"use client"

import type { NextPage } from 'next'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import 'chart.js/auto'
import rawData from '@/data/datos2.json'
import type { ChartData, ChartOptions } from 'chart.js'

type DataItem = {
  nombre_entidad_norm: string
  total_contratos: string
  total_contratado: string
}

const Frame: NextPage = () => {
  // 1) Prepara y ordena tus datos
  const items = (rawData as { sector: string; total_contratado: string }[])
    .map(item => ({
      nombre_entidad_norm: item.sector,
      total_contratos: "0", // Default value or replace with actual logic
      total_contratado: item.total_contratado,
    }))
    .sort((a, b) => parseInt(b.total_contratado) - parseInt(a.total_contratado))

  const labels = items.map(i => i.nombre_entidad_norm)
  const values = items.map(i => parseInt(i.total_contratado, 10))

  // 2) Paleta y configuración del doughnut
  const COLORS = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#8AFF33',
    '#FF33F6',
    '#33FF57',
    '#3357FF',
    '#FF5733',
  ]

  const data: ChartData<'doughnut'> = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS.slice(0, labels.length),
        hoverOffset: 6,
      },
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#FFF',
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#14344b',
        titleColor: '#FFF',
        bodyColor: '#FFF',
        borderColor: '#FFCE56',
        borderWidth: 1,
        callbacks: {
          label: ctx => {
            const v = ctx.parsed as number
            return `${ctx.label}: COP ${new Intl.NumberFormat('es-CO').format(v)}`
          },
        },
      },
    },
  }

  // 3) Estilos inline extraídos de tu Figma
  const frameStyle: React.CSSProperties = {
    width: '100%',
    position: 'relative',
    borderRadius: '45px',
    backgroundColor: '#14344b',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 100px',
    boxSizing: 'border-box',
    gap: '30px',
    textAlign: 'center',
    fontSize: '64px',
    color: '#fff',
    fontFamily: "'IBM Plex Sans'",
  }

  const titleStyle: React.CSSProperties = {
    alignSelf: 'stretch',
    position: 'relative',
    lineHeight: '110%',
    textTransform: 'capitalize',
  }

  const placeholderStyle: React.CSSProperties = {
    alignSelf: 'stretch',
    position: 'relative',
    
    height: '500px',
  }

  return (
    <div style={frameStyle}>
      <b style={titleStyle}>Distribución del Total Contratado</b>
      <div style={placeholderStyle}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  )
}

export default Frame
