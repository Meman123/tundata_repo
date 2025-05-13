"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';

// Define Serie type locally (compatible with Nivo's expected data structure)
type Serie = {
  id: string;
  color?: string;
  data: { x: string; y: number }[];
};
import styles from './GraficaEvo.module.css';
import rawData from '@/data/evolucionMensual.json';

// --- INICIO Hook simple para detectar tamaño de pantalla (puedes moverlo a un archivo de hooks) ---
const useIsMobile = (breakpointPx = 768): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpointPx);
    };
    checkScreenSize(); // Comprobar al montar
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpointPx]);

  return isMobile;
};
// --- FIN Hook simple ---


interface EvolucionItem {
  mes: string;
  sector_norm: string;
  total: number | string;
}

const nivoTheme = { /* ... (tu tema Nivo existente ... MANTENER IGUAL) ... */
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
      text: { fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)', fontSize: 11, fill: '#cbd5e1' },
    },
    legend: {
      text: { fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)', fontSize: 13, fontWeight: '700', fill: 'var(--Naranja-Tundata, #f39c12)' },
    },
  },
  grid: { line: { stroke: '#ffffff22', strokeDasharray: '3 3' } },
  legends: {
    text: { fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)', fontSize: 12, fill: '#ffffff' },
    ticks: { line: {}, text: { fontSize: 10, fill: '#FFF' } },
    title: { text: { fontSize: 12, fill: '#FFF', fontWeight: 'bold' } },
  },
  tooltip: {
    container: {
      background: 'var(--Azul-Fondo-Card-Tundata, #1e4b68)',
      color: '#ffffff',
      fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
      fontSize: '13px',
      borderRadius: '6px',
      boxShadow: '0 3px 9px rgba(0, 0, 0, 0.3)',
      padding: '8px 12px',
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
  { dataKey: "Nov", displayLabel: "Nov" }, { dataKey: "Dec", displayLabel: "Dic" }, // Corregido typo 'dataK_HALey' a 'dataKey'
];

const generateColorForSector = (index: number, totalSectors: number): string => { /* ... (tu función existente ... MANTENER IGUAL) ... */
  if (index === 0 && totalSectors > 0) return `hsl(39, 89%, 52%)`;
  const hueStep = totalSectors > 1 ? 360 / (totalSectors) : 0;
  const hue = (39 + ((index + 0.5) * hueStep * 0.75)) % 360;
  return `hsl(${hue}, 70%, 55%)`;
};

const transformarDatosParaNivo = (dataPlano: EvolucionItem[]): { series: Serie[], sectorColors: Record<string, string>, mesesParaGrafico: { dataKey: string, displayLabel: string }[] } => { /* ... (tu función existente ... MANTENER IGUAL, asegurándote que la lógica para limitar a Mayo sea la deseada) ... */
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
    if (indiceMayo !== -1) {
      indiceFinalParaSlice = Math.min(ultimoMesConDatosIndexDetectado, indiceMayo);
    } else {
      indiceFinalParaSlice = ultimoMesConDatosIndexDetectado;
    }
  } else if (indiceMayo !== -1) {
    // Si no hay datos pero quieres mostrar hasta mayo por defecto, puedes forzarlo aquí.
    // Sin embargo, si no hay datos, es mejor un array vacío o un fallback de pocos meses.
    // El fallback actual a Ene-May si no se detectan datos es razonable.
  }
  const mesesParaGrafico = indiceFinalParaSlice !== -1
    ? ALL_MONTH_MAPPINGS.slice(0, indiceFinalParaSlice + 1)
    : ALL_MONTH_MAPPINGS.slice(0, 5); // Fallback: Ene-May
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
      const totalLimpio = typeof item?.total === 'string' ? String(item.total).replace(/,/g, '') : item?.total;
      const totalEnMillones = item && typeof totalLimpio !== 'undefined' ? parseFloat(String(totalLimpio)) / 1_000_000 : 0;
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


const GraficaEvolucionNivo: React.FC = () => {
  const { series: todasLasSeries, sectorColors, mesesParaGrafico } = useMemo(() => transformarDatosParaNivo(rawData as EvolucionItem[]), []);
  const [activos, setActivos] = useState<string[]>(() => todasLasSeries.map(s => s.id as string));
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile(); // Usar el hook

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSector = (sectorId: string) => { /* ... (tu función existente ... MANTENER IGUAL) ... */
    setActivos(prev =>
      prev.includes(sectorId)
        ? prev.filter(s => s !== sectorId)
        : [...prev, sectorId]
    );
  };

  const seriesFiltradas = useMemo(() => todasLasSeries.filter(serie => activos.includes(serie.id as string)), [todasLasSeries, activos]);

  if (!isClient) {
    return ( /* ... (tu placeholder ... MANTENER IGUAL) ... */
      <div className={styles.frameParent} style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{color: 'white', fontFamily: 'var(--font-ibm-plex-sans)'}}>Cargando gráfico de evolución...</p>
      </div>
    );
  }
  
  const tickRotation = isMobile ? (mesesParaGrafico.length > 4 ? -45 : 0) : (mesesParaGrafico.length > 7 ? -45 : 0);
  const legendOffsetBottom = isMobile ? (mesesParaGrafico.length > 4 ? 65 : 50) : (mesesParaGrafico.length > 7 ? 75 : 60);
  const axisBottomLegendText = isMobile && mesesParaGrafico.length > 3 ? "Meses" : 
    (mesesParaGrafico.length > 0 
      ? `Meses (${mesesParaGrafico[0].displayLabel} - ${mesesParaGrafico[mesesParaGrafico.length - 1].displayLabel})`
      : 'Meses');
  
  const nivoMargins = isMobile 
    ? { top: 20, right: 20, bottom: 75, left: 50 } // Márgenes más ajustados para móvil
    : { top: 30, right: 50, bottom: 90, left: 70 }; // Márgenes para desktop

  const nivoPointSize = isMobile ? 6 : 8;
  const nivoLineWidth = isMobile ? 2 : 3;

  return (
    <div className={styles.frameParent}>
      <div className={styles.evolucionHeader}>
        {/* ... (tu título y subtítulo ... MANTENER IGUAL) ... */}
        <b className={styles.title}>Distribución Presupuestal Mensual</b>
        <div className={styles.subtitle}>
          <span className={styles.highlight}>Visualiza</span> la variación del <span className={styles.highlight}>gasto por sector</span> a lo largo del año.
        </div>
      </div>

      <div className={styles.rectangleParent}>
        <div className={styles.chartInnerNivo}>
          {seriesFiltradas.length > 0 ? (
            <ResponsiveLine
              data={seriesFiltradas}
              theme={nivoTheme}
              colors={(serie) => serie.color || sectorColors[serie.id as string] || '#ccc'}
              margin={nivoMargins} // Aplicar márgenes dinámicos
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false, reverse: false }}
              yFormat=" >-,.2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: isMobile ? 8 : 10,
                tickRotation: tickRotation,
                legend: axisBottomLegendText,
                legendOffset: legendOffsetBottom,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: isMobile ? 5 : 10,
                tickRotation: 0,
                legend: isMobile ? '' : 'Gasto (Millones COP)', // Ocultar leyenda del eje Y en móvil
                legendOffset: isMobile ? -40 : -60,
                legendPosition: 'middle',
                format: value => `${value.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`, // Sin decimales en eje Y
                tickValues: isMobile ? 3 : 5, // Menos ticks en el eje Y para móvil
              }}
              lineWidth={nivoLineWidth}
              pointSize={nivoPointSize}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={isMobile ? 1 : 2}
              pointBorderColor={{ from: 'serieColor' }}
              enablePointLabel={false}
              enableArea={!isMobile} // Deshabilitar área en móvil para limpiar
              areaBlendMode="multiply"
              areaOpacity={0.1}
              useMesh={true}
              enableCrosshair={true}
              crosshairType="x"
              legends={[]}
              animate={true}
              motionConfig="gentle"
              tooltip={({ point }) => { /* ... (tu tooltip ... MANTENER IGUAL) ... */
                return (
                  <div
                    style={{
                      background: 'var(--Azul-Fondo-Card-Tundata, #1e4b68)',
                      padding: '9px 12px',
                      border: `1px solid ${point.seriesColor}55`,
                      borderRadius: '6px',
                      fontFamily: 'var(--font-ibm-plex-sans)',
                      fontSize: '13px',
                      color: 'white',
                      boxShadow: '0 3px 9px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        backgroundColor: point.seriesColor,
                        marginRight: '8px',
                        borderRadius: '3px'
                      }}></span>
                      <strong style={{ color: point.seriesColor }}>{point.seriesId}</strong>
                    </div>
                    <div style={{ marginBottom: '3px' }}>Mes: <strong>{typeof point.data.x === 'string' ? point.data.x : String(point.data.xFormatted) }</strong></div>
                    <div>Gasto: <strong style={{ color: 'var(--Naranja-Tundata)' }}>{point.data.yFormatted} Millones COP</strong></div>
                  </div>
                )
              }}
            />
          ) : (
            <div className={styles.noDataMessage}>
              Selecciona al menos un sector para visualizar los datos.
            </div>
          )}
        </div>
      </div>

      <div className={styles.botonParent}>
        {/* ... (tus botones ... MANTENER IGUAL) ... */}
        {todasLasSeries.map(serie => (
          <button
            key={serie.id as string}
            className={`${styles.boton} ${activos.includes(serie.id as string) ? styles.activo : ''}`}
            onClick={() => toggleSector(serie.id as string)}
            style={{ 
                borderColor: activos.includes(serie.id as string) ? (serie.color as string || sectorColors[serie.id as string]) : 'transparent',
                color: activos.includes(serie.id as string) ? 'var(--Azul-Tundata)' : '#e0e0e0',
                backgroundColor: activos.includes(serie.id as string) ? (serie.color as string || sectorColors[serie.id as string]) : 'color-mix(in srgb, var(--Azul-Tundata) 60%, transparent)',
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
    </div>
  );
};

export default GraficaEvolucionNivo;