"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ResponsiveLine, Serie as NivoSerie } from '@nivo/line';
import styles from './GraficaEvo.module.css';
import rawData from '@/data/evolucionMensual.json';

/* ----------------------------- types & helpers ----------------------------- */

type EvolucionItem = {
  mes: string;
  sector_norm: string;
  total: number | string;
};

type Serie = NivoSerie & { id: string };

const useIsMobile = (breakpointPx = 768): boolean => {
  const get = () => (typeof window !== 'undefined' ? window.innerWidth < breakpointPx : false);
  const [isMobile, setIsMobile] = useState(get);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobile(get());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpointPx]);

  return isMobile;
};

const MONTHS = [
  { key: 'Jan', label: 'Ene' },
  { key: 'Feb', label: 'Feb' },
  { key: 'Mar', label: 'Mar' },
  { key: 'Apr', label: 'Abr' },
  { key: 'May', label: 'May' },
  { key: 'Jun', label: 'Jun' },
  { key: 'Jul', label: 'Jul' },
  { key: 'Aug', label: 'Ago' },
  { key: 'Sep', label: 'Sep' },
  { key: 'Oct', label: 'Oct' },
  { key: 'Nov', label: 'Nov' },
  { key: 'Dec', label: 'Dic' },
] as const;

const TUNDATA_HUE = 39;

const colorForSector = (index: number, total: number): string => {
  if (index === 0) return `hsl(${TUNDATA_HUE}, 89%, 52%)`;
  const hueStep = 360 / total;
  const hue = (205 + index * hueStep * 0.8) % 360;
  const safeHue = Math.abs(hue - TUNDATA_HUE) < 30 ? (hue + 30) % 360 : hue;
  return `hsl(${safeHue}, 70%, 60%)`;
};

const transformData = (data: EvolucionItem[]) => {
  const monthsPresent = new Set(data.map(d => d.mes.trim().toLowerCase()));
  const lastMonthIdx = MONTHS.reduce((last, m, idx) => (
    monthsPresent.has(m.key.toLowerCase()) ? idx : last
  ), -1);

  const endIdx = lastMonthIdx !== -1 ? lastMonthIdx : MONTHS.findIndex(m => m.key === 'May');
  const months = MONTHS.slice(0, endIdx + 1);

  const sectors = [...new Set(data.map(d => d.sector_norm.trim()))] as string[];

  const series: Serie[] = sectors.map((sector, idx) => {
    const color = colorForSector(idx, sectors.length);
    return {
      id: sector,
      color,
      data: months.map(({ key, label }) => {
        const item = data.find(
          d =>
            d.sector_norm.trim() === sector &&
            d.mes.trim().toLowerCase() === key.toLowerCase(),
        );
        const rawTotal = item?.total ?? 0;
        const numeric = parseFloat(String(rawTotal).replace(/,/g, '')) || 0;
        return { x: label, y: parseFloat((numeric / 1_000_000).toFixed(2)) };
      }),
    };
  });

  const sectorColors = Object.fromEntries(series.map(s => [s.id, s.color as string]));

  return { series, sectorColors, months } as const;
};

/* --------------------------------- theme ---------------------------------- */

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
      text: {
        fontFamily: 'var(--font-ibm-plex-sans)',
        fontSize: 13,
        fontWeight: '700',
        fill: 'var(--Naranja-Tundata, #f39c12)',
      },
    },
  },
  grid: { line: { stroke: '#ffffff22', strokeDasharray: '3 3' } },
  legends: {
    text: { fontFamily: 'var(--font-ibm-plex-sans)', fontSize: 12, fill: '#ffffff' },
  },
  tooltip: {
    container: {
      background: 'var(--Azul-Fondo-Card-Tundata, #1e4b68)',
      color: '#ffffff',
      fontFamily: 'var(--font-ibm-plex-sans)',
      borderRadius: 6,
      boxShadow: '0 3px 9px rgba(0,0,0,.3)',
      padding: '8px 12px',
    },
  },
} as const;

/* -------------------------------- component ------------------------------- */

const GraficaEvolucionNivo: React.FC = () => {
  const { series: allSeries, sectorColors, months } = useMemo(
    () => transformData(rawData as EvolucionItem[]),
    [],
  );

  const [active, setActive] = useState<string[]>(allSeries.length ? [allSeries[0].id] : []);
  const [showHint, setShowHint] = useState(true);
  const isMobile = useIsMobile();

  const toggleSector = useCallback(
    (id: string) => {
      setActive(prev => {
        const next = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
        if (showHint && next.length) setShowHint(false);
        return next;
      });
    },
    [showHint],
  );

  const displayedSeries = useMemo(
    () => allSeries.filter(s => active.includes(s.id)),
    [allSeries, active],
  );

  /* ---------------------------- layout calculations ---------------------------- */

  const tickRotation = isMobile ? (months.length > 4 ? -45 : 0) : months.length > 7 ? -30 : 0;
  const legendOffsetBottom = isMobile ? (tickRotation ? 65 : 55) : tickRotation ? 70 : 60;
  const axisLeftLegendOffset = isMobile ? -30 : -60;
  const margins = {
    top: 20,
    right: isMobile ? 10 : 30,
    bottom: legendOffsetBottom + (isMobile ? 20 : 10),
    left: isMobile ? 45 : 70,
  } as const;

  const axisBottomLegendText =
    months.length > 0
      ? `Meses (${months[0].label} - ${months[months.length - 1].label})`
      : 'Meses';

  /* -------------------------------- tooltip ------------------------------- */

  const sliceTooltip = ({ slice }: { slice: { points: PointTooltipDatum[] } }) => {
    if (!slice.points.length) return null;
    return (
      <div
        style={{
          background: 'var(--Azul-Fondo-Card-Tundata, #1e4b68)',
          padding: isMobile ? '6px 10px' : '10px 14px',
          borderRadius: 6,
          fontFamily: 'var(--font-ibm-plex-sans)',
          fontSize: isMobile ? 11 : 13,
          color: '#fff',
          boxShadow: '0 3px 9px rgba(0,0,0,.3)',
          minWidth: isMobile ? 110 : 150,
        }}
      >
        <strong style={{ display: 'block', marginBottom: 6 }}>
          Mes: {slice.points[0].data.xFormatted}
        </strong>
        {slice.points.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                backgroundColor: p.seriesColor,
                marginRight: 6,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: '#e0e0e0',
                flexShrink: 0,
                marginRight: 5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {p.seriesId}:
            </span>
            <strong
              style={{
                marginLeft: 'auto',
                paddingLeft: 8,
                color: p.seriesColor,
                whiteSpace: 'nowrap',
              }}
            >
              ${p.data.yFormatted} <span style={{ color: '#cbd5e1', fontWeight: 400 }}>M</span>
            </strong>
          </div>
        ))}
      </div>
    );
  };

  /* ---------------------------------- JSX ---------------------------------- */

  return (
    <div className={styles.frameParent}>
      <header className={styles.evolucionHeader}>
        <b className={styles.title}>Distribución Presupuestal Mensual</b>
        <p className={styles.subtitle}>
          <span className={styles.highlight}>Visualiza</span> la variación del{' '}
          <span className={styles.highlight}>gasto por sector</span> a lo largo del año.
        </p>
      </header>

      <div className={styles.rectangleParent}>
        <div className={styles.chartInnerNivo} style={{ height: isMobile ? 400 : 500 }}>
          {displayedSeries.length ? (
            <ResponsiveLine
              data={displayedSeries}
              theme={nivoTheme}
              colors={({ id }: { id: string }) => sectorColors[id]}
              margin={margins}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false }}
              yFormat=" >-,.2f"
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation,
                legend: axisBottomLegendText,
                legendOffset: legendOffsetBottom,
                legendPosition: 'middle',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: isMobile ? 3 : 5,
                tickRotation: isMobile ? -90 : 0,
                legend: isMobile ? 'En Millones (COP)' : 'Gasto En Millones (COP)',
                legendOffset: axisLeftLegendOffset,
                legendPosition: 'middle',
                format: (v: number) => v.toLocaleString('es-CO', { maximumFractionDigits: 0 }),
                tickValues: isMobile ? 4 : 5,
              }}
              lineWidth={isMobile ? 2 : 3}
              pointSize={isMobile ? 4 : 5}
              pointColor="white"  
              pointBorderWidth={0}
              pointBorderColor="#fff"
              enableArea
              areaBlendMode="multiply"
              areaOpacity={0.15}
              useMesh
              enableSlices="x"
              sliceTooltip={sliceTooltip}
              legends={[]}
              animate
              motionConfig="slow"
            />
          ) : (
            <p className={styles.noDataMessage}>
              {showHint && allSeries.length
                ? 'Usa los botones para activar sectores y ver su evolución.'
                : 'No hay datos para mostrar.'}
            </p>
          )}
        </div>
      </div>

      {showHint && displayedSeries.length > 0 && (
        <p className={styles.mensajePedagogico}>
          ¡Explora los datos! Activa o desactiva sectores con los botones. Toca el gráfico para ver
          detalles.
        </p>
      )}

      <div className={styles.botonParent}>
        {allSeries.map(serie => {
          const activeItem = active.includes(serie.id);
          const color = (serie.color ?? sectorColors[serie.id]) as string;
          return (
            <button
              key={serie.id}
              className={`${styles.boton} ${activeItem ? styles.activo : ''}`}
              onClick={() => toggleSector(serie.id)}
              aria-pressed={activeItem}
              style={{
                backgroundColor: activeItem
                  ? color
                  : 'color-mix(in srgb, var(--Azul-Tundata, #14344b) 60%, transparent)',
                color: activeItem ? 'var(--Azul-Tundata, #14344b)' : '#e0e0e0',
                border: `2px solid ${activeItem ? color : 'transparent'}`,
              }}
            >
              <span className={styles.colorDot} style={{ backgroundColor: color }} />
              {serie.id}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GraficaEvolucionNivo;
