"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveLine, Point, SliceData } from '@nivo/line';
type Serie = {
  id: string;
  color?: string;
  data: { x: string; y: number }[];
};
import styles from './GraficaEvo.module.css';
import rawData from '@/data/evolucionMensual.json';

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
  tooltip: { // Tooltip Nivo para DESKTOP
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
  { dataKey: "Nov", displayLabel: "Nov" }, { dataKey: "Dec", displayLabel: "Dic" },
];

const generateColorForSector = (index: number, totalSectors: number): string => {
  if (index === 0 && totalSectors > 0) return `hsl(39, 89%, 52%)`;
  const hueStep = totalSectors > 1 ? 360 / (totalSectors) : 0;
  const hue = (39 + ((index + 0.5) * hueStep * 0.75)) % 360;
  return `hsl(${hue}, 70%, 55%)`;
};

const transformarDatosParaNivo = (dataPlano: EvolucionItem[]): { series: Serie[], sectorColors: Record<string, string>, mesesParaGrafico: { dataKey: string, displayLabel: string }[] } => {
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
     // Si no hay datos, pero se quiere mostrar hasta mayo por defecto:
     // indiceFinalParaSlice = indiceMayo; // Puedes habilitar esto si es el comportamiento deseado
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
  
  const [activos, setActivos] = useState<string[]>(() => {
    if (todasLasSeries.length > 0) {
      // Mostrar solo el primer sector por defecto
      return [todasLasSeries[0].id as string];
      // O si quieres mostrar los dos primeros (asegúrate que existan al menos dos)
      // return todasLasSeries.slice(0, Math.min(2, todasLasSeries.length)).map(s => s.id as string);
    }
    return [];
  });

  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();
  const [mobileTooltipData, setMobileTooltipData] = useState<Point<Serie> | null>(null);
  const [mostrarMensajePedagogico, setMostrarMensajePedagogico] = useState(true);


  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSector = (sectorId: string) => {
    setActivos(prev => {
        const newActivos = prev.includes(sectorId)
            ? prev.filter(s => s !== sectorId)
            : [...prev, sectorId];
        
        // Ocultar mensaje pedagógico después de la primera interacción con los botones
        // que cambie el estado inicial.
        if (mostrarMensajePedagogico) {
           setMostrarMensajePedagogico(false);
        }
        return newActivos;
    });
  };

  const seriesFiltradas = useMemo(() => todasLasSeries.filter(serie => activos.includes(serie.id as string)), [todasLasSeries, activos]);

  if (!isClient) {
    return (
      <div className={styles.frameParent} style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{color: 'white', fontFamily: 'var(--font-ibm-plex-sans)'}}>Cargando gráfico de evolución...</p>
      </div>
    );
  }
  
  const tickRotation = isMobile ? (mesesParaGrafico.length > 4 ? -30 : 0) : (mesesParaGrafico.length > 7 ? -30 : 0);
  const legendOffsetBottom = isMobile ? (mesesParaGrafico.length > 4 ? 80 : 70) : (mesesParaGrafico.length > 7 ? 75 : 60); // Aumentado padding "Meses"
  
  const axisBottomLegendText = isMobile && mesesParaGrafico.length > 3 ? "Meses" : 
    (mesesParaGrafico.length > 0 
      ? `Meses (${mesesParaGrafico[0].displayLabel} - ${mesesParaGrafico[mesesParaGrafico.length - 1].displayLabel})`
      : 'Meses');
  
  const nivoMargins = isMobile 
    ? { top: 20, right: 15, bottom: legendOffsetBottom + 5, left: 45 }
    : { top: 30, right: 50, bottom: legendOffsetBottom + 15 , left: 70 }; // Ajustado bottom para desktop también por el offset

  const nivoPointSize = isMobile ? 7 : 8; // Puntos un poco más grandes en móvil para facilitar tap
  const nivoLineWidth = isMobile ? 2.5 : 3; // Líneas un poco más gruesas en móvil


  const handlePointOrSliceClick = (
    datum: Point<Serie> | SliceData<Serie>,
    event: React.MouseEvent
  ) => {
    if (isMobile) {
      // If it's a slice, show the first point in the slice
      if ('points' in datum && Array.isArray(datum.points) && datum.points.length > 0) {
        setMobileTooltipData(datum.points[0]);
      } else if ('serieId' in datum) {
        setMobileTooltipData(datum as Point<Serie>);
      }
      if (mostrarMensajePedagogico) {
        setMostrarMensajePedagogico(false);
      }
    }
  };

  const closeMobileTooltip = () => {
    setMobileTooltipData(null);
  };

  return (
    <div className={styles.frameParent}>
      <div className={styles.evolucionHeader}>
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
              margin={nivoMargins}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false, reverse: false }}
              yFormat=" >-,.2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: isMobile ? 6 : 10,
                tickRotation: tickRotation,
                legend: axisBottomLegendText,
                legendOffset: legendOffsetBottom,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: isMobile ? 5 : 10,
                tickRotation: 0,
                legend: isMobile ? '' : 'Gasto (Millones COP)',
                legendOffset: isMobile ? -35 : -60,
                legendPosition: 'middle',
                format: value => `${value.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`,
                tickValues: isMobile ? 4 : 5,
              }}
              lineWidth={nivoLineWidth}
              onClick={handlePointOrSliceClick} // onClick siempre, pero tooltip modal solo para isMobile
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              enablePointLabel={false}
              enableArea={!isMobile}
              areaBlendMode="multiply"
              areaOpacity={0.1}
              useMesh={!isMobile}
              enableSlices={isMobile ? 'x' : false} 
              tooltip={(input) => {
                  const { point } = input;
                  if (!point || isMobile) return <div style={{ display: 'none' }} />; // Ocultar en móvil o si no hay punto
                  
                  return ( // Tooltip para Desktop
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
                                  display: 'inline-block', width: '12px', height: '12px',
                                  backgroundColor: point.seriesColor, marginRight: '8px', borderRadius: '3px'
                              }}></span>
                              <strong style={{ color: point.seriesColor }}>{point.seriesId}</strong>
                          </div>
                          <div style={{ marginBottom: '3px' }}>Mes: <strong>{String(point.data.xFormatted || point.data.x)}</strong></div>
                          <div>Gasto: <strong style={{ color: 'var(--Naranja-Tundata)' }}>${point.data.yFormatted} Millones COP</strong></div>
                      </div>
                  );
              }}
              legends={[]}
              animate={true}
              motionConfig="gentle"
            />
          ) : (
            <div className={styles.noDataMessage}>
              { mostrarMensajePedagogico 
                ? "Usa los botones para activar sectores y ver su evolución." 
                : "No hay datos para los sectores seleccionados." 
              }
            </div>
          )}
        </div>
      </div>

      {mostrarMensajePedagogico && seriesFiltradas.length > 0 && ( // Mostrar solo si hay alguna serie visible
        <p className={styles.mensajePedagogico}>
          ¡Explora los datos! Activa o desactiva más sectores usando los botones.
        </p>
      )}

      <div className={styles.botonParent}>
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

      {isMobile && mobileTooltipData && (
        <>
          <div className={styles.mobileTooltipOverlay} onClick={closeMobileTooltip} />
          <div className={styles.mobileTooltip}>
            <button className={styles.mobileTooltipCloseButton} onClick={closeMobileTooltip}>
              &times;
            </button>
            <div className={styles.mobileTooltipTitle} style={{ color: mobileTooltipData.seriesColor }}>
              <span style={{ backgroundColor: mobileTooltipData.seriesColor }}></span>
              <strong>{mobileTooltipData.seriesId}</strong>
            </div>
            <p className={styles.mobileTooltipUnits}>Valores en millones de pesos (COP)</p>
            <div className={styles.mobileTooltipInfo}>Mes: <strong>{String(mobileTooltipData.data.xFormatted || mobileTooltipData.data.x)}</strong></div>
            <div className={styles.mobileTooltipInfo}>
              Gasto: <strong style={{ color: 'var(--Naranja-Tundata)' }}>${String(mobileTooltipData.data.yFormatted)}</strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GraficaEvolucionNivo;