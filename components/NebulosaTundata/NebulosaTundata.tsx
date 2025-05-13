"use client";

import React from 'react';
import { ResponsiveLine } from '@nivo/line';

// Define the Serie type for TypeScript
type Serie = {
  id: string;
  data: { x: string; y: number }[];
};
import styles from './NebulosaTundata.module.css';

// Datos de ejemplo para la gráfica de línea
// Puedes reemplazar esto con tus propios datos dinámicos o de un JSON
const lineChartData: Serie[] = [
  {
    id: 'Gasto Público (Millones COP)',
    // color: 'hsl(39, 89%, 52%)', // Naranja Tundata (Nivo puede tomarlo de la prop 'colors' o de aquí)
    data: [
      { x: 'Ene 2024', y: 1250 },
      { x: 'Feb 2024', y: 1870 },
      { x: 'Mar 2024', y: 1550 },
      { x: 'Abr 2024', y: 2100 },
      { x: 'May 2024', y: 1950 },
      { x: 'Jun 2024', y: 2300 },
      { x: 'Jul 2024', y: 2050 },
      { x: 'Ago 2024', y: 2450 },
      { x: 'Sep 2024', y: 2600 },
      { x: 'Oct 2024', y: 2250 },
      { x: 'Nov 2024', y: 2750 },
      { x: 'Dic 2024', y: 3100 },
    ],
  },
  {
    id: 'Número de Contratos',
    // color: 'hsl(200, 70%, 60%)', // Un azul claro
    data: [
      { x: 'Ene 2024', y: 45 },
      { x: 'Feb 2024', y: 58 },
      { x: 'Mar 2024', y: 52 },
      { x: 'Abr 2024', y: 67 },
      { x: 'May 2024', y: 61 },
      { x: 'Jun 2024', y: 75 },
      { x: 'Jul 2024', y: 70 },
      { x: 'Ago 2024', y: 82 },
      { x: 'Sep 2024', y: 90 },
      { x: 'Oct 2024', y: 78 },
      { x: 'Nov 2024', y: 95 },
      { x: 'Dic 2024', y: 110 },
    ],
  },
  // Puedes añadir más series de datos aquí
];

// Tema personalizado para Nivo para que coincida con el estilo de Tundata
const nivoTheme = {
  background: 'transparent', // El fondo lo da el contenedor
  text: {
    fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
    fontSize: 12,
    fill: '#e0e0e0', // Texto general claro
  },
  axis: {
    domain: {
      line: {
        stroke: 'var(--Naranja-Tundata, #f39c12)', // Línea del eje naranja
        strokeWidth: 1,
      },
    },
    ticks: {
      line: {
        stroke: '#ffffff33', // Línea de los ticks
        strokeWidth: 1,
      },
      text: {
        fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
        fontSize: 11,
        fill: '#cbd5e1', // Texto de los ticks (gris claro)
      },
    },
    legend: {
      text: {
        fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
        fontSize: 13,
        fontWeight: '700',
        fill: 'var(--Naranja-Tundata, #f39c12)', // Leyenda del eje naranja
      },
    },
  },
  grid: {
    line: {
      stroke: '#ffffff22', // Líneas de la cuadrícula
      strokeDasharray: '3 3', // Líneas punteadas
    },
  },
  legends: {
    text: {
      fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
      fontSize: 12,
      fill: '#ffffff', // Texto de la leyenda de series
    },
    ticks: {
        line: {},
        text: {
            fontSize: 10,
            fill: '#FFF'
        }
    },
    title: {
        text: {
            fontSize: 12,
            fill: '#FFF',
            fontWeight: 'bold'
        }
    },
  },
  tooltip: {
    container: {
      background: 'var(--Azul-Fondo-Card-Tundata, #1e4b68)', // Fondo del tooltip
      color: '#ffffff',
      fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
      fontSize: '13px',
      borderRadius: '6px',
      boxShadow: '0 3px 9px rgba(0, 0, 0, 0.3)',
      padding: '8px 12px',
    },
    basic: {},
    chip: {}, // Estilo del "chip" de color en el tooltip
    table: {},
    tableCell: {},
    tableCellValue: {},
  },
  annotations: {
    text: {
        fontSize: 13,
        fill: "#e0e0e0",
        outlineWidth: 2,
        outlineColor: "#14344b", // Azul Tundata
        outlineOpacity: 0.8
    },
    link: {
        stroke: "#f39c12", // Naranja Tundata
        strokeWidth: 1,
        outlineWidth: 2,
        outlineColor: "#14344b",
        outlineOpacity: 0.8
    },
    outline: {
        stroke: "#f39c12",
        strokeWidth: 2,
        outlineWidth: 2,
        outlineColor: "#14344b",
        outlineOpacity: 0.8
    },
    symbol: {
        fill: "#f39c12",
        outlineWidth: 2,
        outlineColor: "#14344b",
        outlineOpacity: 0.8
    }
  }
};


const NebulosaTundataNivoLine: React.FC = () => {
  // Asegúrate de que el componente solo se renderice en el cliente
  // ya que Nivo usa mediciones del DOM para la responsividad.
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // O un placeholder/spinner
  }

  return (
    <section className={styles.nebulosaSection}>
      <h2 className={styles.sectionTitle}>
        Análisis de <span className={styles.highlight}>Tendencias Clave</span>
      </h2>
      <div className={styles.chartContainer}>
        <ResponsiveLine
          data={lineChartData}
          theme={nivoTheme}
          colors={['var(--Naranja-Tundata)', '#34AAE0', '#50C878', '#A076F9']} // Paleta de colores para las series
          margin={{ top: 50, right: 110, bottom: 70, left: 80 }} // Márgenes ajustados para leyendas y ejes
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto', // O un valor fijo como 0
            max: 'auto',
            stacked: false, // O true si quieres apilar las líneas
            reverse: false,
          }}
          yFormat=" >-.2f" // Formato para los valores del eje Y y tooltips
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -30, // Rotar etiquetas si son largas
            legend: 'Meses (2024)',
            legendOffset: 60,
            legendPosition: 'middle',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 0,
            legend: 'Valores',
            legendOffset: -70,
            legendPosition: 'middle',
            format: e => Math.floor(e) === e && e // Solo muestra ticks para enteros en el eje Y si los números son pequeños
          }}
          enableGridX={false} // Deshabilitar cuadrícula vertical si se prefiere
          gridYValues={5} // Número de líneas de la cuadrícula horizontal
          lineWidth={3} // Grosor de la línea
          pointSize={8} // Tamaño de los puntos
          pointColor={{ theme: 'background' }} // Color del punto (fondo para que el borde resalte)
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }} // Borde del punto con el color de la serie
          pointLabelYOffset={-12}
          enableArea={true} // Rellenar área debajo de la línea
          areaOpacity={0.15} // Opacidad del área
          useMesh={true} // Malla para interacción (mejora rendimiento de tooltips)
          crosshairType="x" // Tipo de crosshair al hacer hover
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 2,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.85,
              symbolSize: 14,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={true} // Habilitar animación de entrada
          motionConfig="gentle" // Configuración de la animación (ej. "default", "gentle", "wobbly", "stiff", "slow", "molasses")
        />
      </div>
    </section>
  );
};

export default NebulosaTundataNivoLine;