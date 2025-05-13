"use client";

import React, { useState, useEffect, useMemo } from 'react';
// Asegúrate de importar los tipos necesarios si aún los necesitas en otro lugar
import { ResponsiveLine } from '@nivo/line';

type Serie = {
  id: string;
  color?: string;
  data: { x: string; y: number }[];
};

import styles from './GraficaEvo.module.css';
import rawData from '@/data/evolucionMensual.json'; // Asegúrate que la ruta sea correcta

// Hook useIsMobile (sin cambios)
const useIsMobile = (breakpointPx = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkScreenSize = () => {
        setIsMobile(window.innerWidth < breakpointPx);
      };
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, [breakpointPx]);
  return isMobile;
};

interface EvolucionItem {
  mes: string;
  sector_norm: string;
  total: number | string;
}

// --- Definiciones de Tema, Meses, Colores, etc. (sin cambios) ---
const nivoTheme = {
  background: 'transparent',
  text: {
    fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
    fontSize: 12,
    fill: '#e0e0e0',
  },
  axis: {
    domain: { line: { stroke: 'var(--Naranja-Tundata, #f39c12)', strokeWidth: 1 } },
    ticks: {
      line: { stroke: '#ffffff33', strokeWidth: 1 },
      text: { fontFamily: 'var(--font-ibm-plex-sans)', fontSize: 11, fill: '#cbd5e1' },
    },
    legend: {
      text: { fontFamily: 'var(--font-ibm-plex-sans)', fontSize: 13, fontWeight: '700', fill: 'var(--Naranja-Tundata, #f39c12)' },
    },
  },
  grid: { line: { stroke: '#ffffff22', strokeDasharray: '3 3' } },
  legends: {
    text: { fontFamily: 'var(--font-ibm-plex-sans)', fontSize: 12, fill: '#ffffff' },
    ticks: { line: {}, text: { fontSize: 10, fill: '#FFF' } },
    title: { text: { fontSize: 12, fill: '#FFF', fontWeight: 'bold' } },
  },
  // La sección 'tooltip' del tema AÚN se aplica al sliceTooltip
  tooltip: {
    container: {
      background: 'var(--Azul-Fondo-Card-Tundata, #1e4b68)',
      color: '#ffffff',
      fontFamily: 'var(--font-ibm-plex-sans)',
      // fontSize: '13px', // Podemos sobreescribir esto abajo si es necesario
      borderRadius: '6px',
      boxShadow: '0 3px 9px rgba(0, 0, 0, 0.3)',
      padding: '8px 12px', // Podemos sobreescribir esto abajo si es necesario
    },
  },
  annotations: {
    text: { fontSize: 13, fill: "#e0e0e0", outlineWidth: 2, outlineColor: "var(--Azul-Tundata, #14344b)", outlineOpacity: 0.8 },
    link: { stroke: "var(--Naranja-Tundata, #f39c12)", strokeWidth: 1, outlineWidth: 2, outlineColor: "var(--Azul-Tundata, #14344b)", outlineOpacity: 0.8 },
    outline: { stroke: "var(--Naranja-Tundata, #f39c12)", strokeWidth: 2, outlineWidth: 2, outlineColor: "var(--Azul-Tundata, #14344b)", outlineOpacity: 0.8 },
    symbol: { fill: "var(--Naranja-Tundata, #f39c12)", outlineWidth: 2, outlineColor: "var(--Azul-Tundata, #14344b)", outlineOpacity: 0.8 }
  }
};
const ALL_MONTH_MAPPINGS = [
  { dataKey: "Jan", displayLabel: "Ene" }, { dataKey: "Feb", displayLabel: "Feb" },
  { dataKey: "Mar", displayLabel: "Mar" }, { dataKey: "Apr", displayLabel: "Abr" },
  { dataKey: "May", displayLabel: "May" }, { dataKey: "Jun", displayLabel: "Jun" },
  { dataKey: "Jul", displayLabel: "Jul" }, { dataKey: "Aug", displayLabel: "Ago" },
  { dataKey: "Sep", displayLabel: "Sep" }, { dataKey: "Oct", displayLabel: "Oct" },
  { dataKey: "Nov", displayLabel: "Nov" }, { dataKey: "Dec", displayLabel: "Dic" },
];

const generateColorForSector = (index: number, totalSectors: number): string => {
    if (index === 0 && totalSectors > 0) return `hsl(39, 89%, 52%)`; // Naranja Tundata para el primero
    const hueStep = totalSectors > 1 ? 360 / (totalSectors) : 0;
    const startHue = 205;
    const effectiveIndex = index >= 0 ? index + 1 : 0;
    const calculatedHue = (startHue + (effectiveIndex * hueStep * 0.8)) % 360;
    if (totalSectors > 1 && Math.abs(calculatedHue - 39) < 30) {
       return `hsl(${(calculatedHue + 30) % 360}, 70%, 60%)`;
    }
    return `hsl(${calculatedHue}, 70%, 60%)`;
};

// --- Función transformarDatosParaNivo (sin cambios) ---
const transformarDatosParaNivo = (dataPlano: EvolucionItem[]): {
  series: Serie[],
  sectorColors: Record<string, string>,
  mesesParaGrafico: { dataKey: string, displayLabel: string }[]
} => {
  const mesesConDatos = new Set(dataPlano.map(d => d.mes?.trim().toLowerCase()).filter(Boolean));
  let ultimoMesConDatosIndexDetectado = -1;
  ALL_MONTH_MAPPINGS.forEach((monthMap, index) => {
    if (mesesConDatos.has(monthMap.dataKey.toLowerCase())) {
      ultimoMesConDatosIndexDetectado = index;
    }
  });
  const indiceMayo = ALL_MONTH_MAPPINGS.findIndex(m => m.dataKey.toLowerCase() === "may");
  let indiceFinalParaSlice = -1;
  if (ultimoMesConDatosIndexDetectado !== -1) {
     indiceFinalParaSlice = ultimoMesConDatosIndexDetectado;
  } else if (indiceMayo !== -1 && dataPlano.length === 0) {
     indiceFinalParaSlice = indiceMayo;
  }

  const mesesParaGrafico = indiceFinalParaSlice !== -1
    ? ALL_MONTH_MAPPINGS.slice(0, indiceFinalParaSlice + 1)
    : ALL_MONTH_MAPPINGS.slice(0, 5);

  const sectoresUnicos = Array.from(new Set(dataPlano.map(d => d.sector_norm?.trim()).filter(Boolean))) as string[];
  const sectorColors: Record<string, string> = {};
  sectoresUnicos.forEach((sector, index) => {
    sectorColors[sector] = generateColorForSector(index, sectoresUnicos.length);
  });

  const series = sectoresUnicos.map(sector => {
    const sectorData = mesesParaGrafico.map(monthMap => {
      const item = dataPlano.find(d =>
        d.sector_norm?.trim() === sector &&
        d.mes?.trim().toLowerCase() === monthMap.dataKey.toLowerCase()
      );
      const totalLimpio = typeof item?.total === 'string' ? item.total.replace(/,/g, '') : item?.total;
      const totalNumerico = item && typeof totalLimpio !== 'undefined' ? parseFloat(String(totalLimpio)) : 0;
      const totalEnMillones = !isNaN(totalNumerico) ? totalNumerico / 1_000_000 : 0;

      return {
        x: monthMap.displayLabel,
        y: parseFloat(totalEnMillones.toFixed(2)),
      };
    });
    return {
      id: sector,
      color: sectorColors[sector],
      data: sectorData,
    };
  });
  return { series, sectorColors, mesesParaGrafico };
};


// --- Componente Principal ---
const GraficaEvolucionNivo: React.FC = () => {
  const { series: todasLasSeries, sectorColors, mesesParaGrafico } = useMemo(() => transformarDatosParaNivo(rawData as EvolucionItem[]), []);

  const [activos, setActivos] = useState<string[]>(() => {
    if (todasLasSeries.length > 0) {
      return [todasLasSeries[0].id as string];
    }
    return [];
  });

  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();

  // ELIMINADO: Estado para el tooltip modal móvil
  // const [mobileTooltipData, setMobileTooltipData] = useState<NivoPointType | null>(null);

  // Mantenemos este estado si aún quieres mostrar/ocultar el mensaje
  const [mostrarMensajePedagogico, setMostrarMensajePedagogico] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSector = (sectorId: string) => {
    setActivos(prev => {
      const nuevos = prev.includes(sectorId)
        ? prev.filter(s => s !== sectorId)
        : [...prev, sectorId];
      // Ocultar mensaje pedagógico al interactuar con botones (opcional)
      if (mostrarMensajePedagogico && nuevos.length > 0) setMostrarMensajePedagogico(false);
      return nuevos;
    });
  };

  const seriesFiltradas = useMemo(
    () => todasLasSeries.filter(serie => activos.includes(serie.id as string)),
    [todasLasSeries, activos]
  );

  // ELIMINADO: Función handlePointOrSliceClick (ya no es necesaria para el tooltip)
  // ELIMINADO: Función closeMobileTooltip

  if (!isClient) {
    return (
      <div className={styles.frameParent} style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white', fontFamily: 'var(--font-ibm-plex-sans)' }}>
          Cargando gráfico de evolución...
        </p>
      </div>
    );
  }

  // --- Cálculos de diseño responsive (sin cambios) ---
  const tickRotation = isMobile ? (mesesParaGrafico.length > 4 ? -45 : 0) : (mesesParaGrafico.length > 7 ? -30 : 0);
  const legendOffsetBottom = isMobile ? (tickRotation !== 0 ? 65 : 55) : (tickRotation !== 0 ? 70 : 60);
  const axisLeftLegendOffset = isMobile ? -40 : -60;
  const pointSize = isMobile ? 6 : 8;
  const lineWidth = isMobile ? 2 : 3;

  const axisBottomLegendText = mesesParaGrafico.length > 0
       ? `Meses (${mesesParaGrafico[0].displayLabel} - ${mesesParaGrafico[mesesParaGrafico.length - 1]?.displayLabel})`
       : "Meses";

  const nivoMargins = {
    top: 20,
    right: isMobile ? 15 : 30,
    bottom: legendOffsetBottom + (isMobile ? 10 : 15),
    left: isMobile ? 50 : 70
  };

  // --- JSX del componente ---
  return (
    <div className={styles.frameParent}>
      {/* Header (sin cambios) */}
      <div className={styles.evolucionHeader}>
         <b className={styles.title}>Distribución Presupuestal Mensual</b>
         <div className={styles.subtitle}>
           <span className={styles.highlight}>Visualiza</span> la variación del <span className={styles.highlight}>gasto por sector</span> a lo largo del año.
         </div>
      </div>

      {/* Contenedor del Gráfico */}
      <div className={styles.rectangleParent}>
        <div className={styles.chartInnerNivo} style={{ height: isMobile ? '400px' : '500px' }}>
          {seriesFiltradas.length > 0 ? (
            <ResponsiveLine
              data={seriesFiltradas}
              theme={nivoTheme}
              colors={(serie) => serie.color || sectorColors[serie.id as string] || '#ccc'}
              margin={nivoMargins}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false, reverse: false }}
              yFormat=" >-,.2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: tickRotation,
                legend: axisBottomLegendText,
                legendOffset: legendOffsetBottom,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: isMobile ? 3 : 5,
                tickRotation: 0,
                legend: isMobile ? 'Mill. COP' : 'Gasto (Millones COP)',
                legendOffset: axisLeftLegendOffset,
                legendPosition: 'middle',
                format: value => `${value.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`,
                tickValues: isMobile ? 4 : 5,
              }}
              lineWidth={lineWidth}
              pointSize={pointSize}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              enablePointLabel={false}
              enableArea={true}
              areaBlendMode="multiply"
              areaOpacity={0.15}
              useMesh={true} // Mantenemos useMesh=true; Nivo suele manejarlo bien en touch o lo deshabilita internamente si es necesario.
              enableSlices="x"

              // ELIMINADO: prop onClick (ya no necesaria para el tooltip)

              // ---- MODIFICADO: sliceTooltip ----
              // Ahora se renderiza tanto en desktop como en móvil
              sliceTooltip={({ slice }) => {
                 // Comprobación básica: si no hay slice o puntos, no mostrar nada
                if (!slice || !slice.points || slice.points.length === 0) {
                  return null;
                }

                // Renderiza el tooltip. Puedes usar 'isMobile' para ajustar estilos.
                return (
                  <div style={{
                    // Usamos los estilos base del tema y podemos añadir ajustes
                    background: 'var(--Azul-Fondo-Card-Tundata, #1e4b68)',
                    padding: isMobile ? '6px 10px' : '10px 14px', // Menos padding en móvil
                    borderRadius: '6px',
                    fontFamily: 'var(--font-ibm-plex-sans)',
                    fontSize: isMobile ? '11px' : '13px', // Fuente más pequeña en móvil
                    color: 'white',
                    boxShadow: '0 3px 9px rgba(0, 0, 0, 0.3)',
                    minWidth: isMobile ? '110px' : '150px', // Ancho mínimo
                  }}>
                    <strong style={{ display: 'block', marginBottom: '6px', fontSize: isMobile ? '1.0em': '1.05em' }}>
                       Mes: {slice.points[0].data.xFormatted}
                    </strong>
                    {slice.points.map(point => (
                      <div key={point.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{
                          display: 'inline-block', width: '10px', height: '10px', // Punto de color más pequeño
                          borderRadius: '3px', backgroundColor: point.seriesColor, marginRight: '6px', // Menos margen
                          flexShrink: 0
                        }} />
                        <span style={{ color: '#e0e0e0', flexShrink: 0, marginRight: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {point.seriesId}: {/* Considera truncar si es muy largo */}
                        </span>
                        <strong style={{ marginLeft: 'auto', paddingLeft: '8px', color: point.seriesColor, whiteSpace: 'nowrap', fontSize: isMobile ? '1.0em': '1.05em' }}>
                          ${point.data.yFormatted} <span style={{ color: '#cbd5e1', fontWeight: 400, fontSize: '0.9em' }}>M</span>
                        </strong>
                      </div>
                    ))}
                  </div>
                );
              }}
              legends={[]}
              animate={true}
              motionConfig="gentle"
            />
          ) : (
            <div className={styles.noDataMessage}>
              {mostrarMensajePedagogico && todasLasSeries.length > 0 // Muestra mensaje pedagógico solo si hay series pero ninguna activa
                ? "Usa los botones para activar sectores y ver su evolución."
                : "No hay datos para mostrar." // Mensaje si no hay datos en origen o ningún sector activo
              }
            </div>
          )}
        </div>
      </div>

      {/* Mensaje pedagógico (si aplica) */}
      {mostrarMensajePedagogico && seriesFiltradas.length > 0 && (
        <p className={styles.mensajePedagogico}>
          ¡Explora los datos! Activa o desactiva sectores con los botones. Toca el gráfico para ver detalles.
        </p>
      )}

      {/* Botones para seleccionar sectores (sin cambios) */}
      <div className={styles.botonParent}>
        {todasLasSeries.map(serie => (
          <button
            key={serie.id as string}
            className={`${styles.boton} ${activos.includes(serie.id as string) ? styles.activo : ''}`}
            onClick={() => toggleSector(serie.id as string)}
            aria-pressed={activos.includes(serie.id as string)}
            style={{
               backgroundColor: activos.includes(serie.id as string)
                 ? (serie.color as string || sectorColors[serie.id as string])
                 : 'color-mix(in srgb, var(--Azul-Tundata, #14344b) 60%, transparent)',
               color: activos.includes(serie.id as string)
                 ? 'var(--Azul-Tundata, #14344b)'
                 : '#e0e0e0',
              border: `2px solid ${activos.includes(serie.id as string)
                  ? (serie.color as string || sectorColors[serie.id as string])
                  : 'transparent'}`,
            }}
          >
            <span
              className={styles.colorDot}
              style={{ backgroundColor: serie.color as string || sectorColors[serie.id as string] }}
            />
            {serie.id}
          </button>
        ))}
      </div>

      {/* ELIMINADO: JSX del tooltip modal móvil */}

    </div>
  );
};

export default GraficaEvolucionNivo;