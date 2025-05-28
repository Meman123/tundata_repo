'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ResponsiveLine, SliceTooltipProps } from '@nivo/line'; // Asegúrate que @nivo/line esté bien instalado

import styles from './GraficaEvo.module.css';
import rawData from '@/data/evolucionMensual.json'; // Verifica la configuración del alias '@'

/* ----------------------------- types & helpers ----------------------------- */

type EvolucionItem = {
  mes: string;
  sector_norm: string;
  total: number | string;
};

// Tipo para los puntos de datos originales en tus series
type NivoDatum = {
  x: string | number;
  y: number;
};

// Tipo para una serie completa que Nivo espera
type Serie = {
  id: string;
  color?: string;
  data: NivoDatum[];
};

// Tipo auxiliar para el objeto 'data' aumentado dentro del tooltip
type AugmentedNivoDatum = NivoDatum & {
  xFormatted: string;
  yFormatted: string;
};

const useIsMobile = (breakpointPx = 768): boolean => {
  const getIsMobile = useCallback(
    () =>
      typeof window !== 'undefined' ? window.innerWidth < breakpointPx : false,
    [breakpointPx],
  );
  const [isMobile, setIsMobile] = useState(getIsMobile());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setIsMobile(getIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getIsMobile]); // breakpointPx está cubierto por getIsMobile

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

const colorForSector = (index: number, totalSectors: number): string => {
  if (totalSectors <= 0) return `hsl(${TUNDATA_HUE}, 70%, 60%)`; // Fallback
  if (index === 0) return `hsl(${TUNDATA_HUE}, 89%, 52%)`;

  const otherSectorsCount = totalSectors - 1;
  if (otherSectorsCount <= 0)
    return `hsl(${(TUNDATA_HUE + 60) % 360}, 70%, 60%)`; // Si solo hay un "otro" sector

  const hueStep = 360 / otherSectorsCount;
  const baseHue = (TUNDATA_HUE + 60) % 360; // Empezar desde un ángulo diferente al principal
  let hue = (baseHue + (index - 1) * hueStep * 0.8) % 360;

  if (Math.abs(hue - TUNDATA_HUE) < 30) {
    hue = (hue + 30) % 360;
  }
  if (Math.abs(hue - TUNDATA_HUE) < 30) {
    hue = (TUNDATA_HUE + 180 + 30) % 360;
  }

  return `hsl(${hue}, 70%, 60%)`;
};

const transformData = (data: EvolucionItem[]) => {
  const monthsPresent = new Set(data.map((d) => d.mes.trim().toLowerCase()));
  const lastMonthIdx = MONTHS.reduce(
    (last, m, idx) => (monthsPresent.has(m.key.toLowerCase()) ? idx : last),
    -1,
  );

  const defaultEndIdx = MONTHS.findIndex((m) => m.key === 'May');
  const endIdx =
    lastMonthIdx !== -1
      ? lastMonthIdx
      : defaultEndIdx !== -1
        ? defaultEndIdx
        : MONTHS.length - 1;
  const currentMonths = MONTHS.slice(0, endIdx + 1);

  const sectors = [
    ...new Set(data.map((d) => d.sector_norm.trim())),
  ] as string[];

  const series: Serie[] = sectors.map((sector, idx) => {
    const color = colorForSector(idx, sectors.length);
    return {
      id: sector,
      color,
      data: currentMonths.map(({ key, label }): NivoDatum => {
        // Tipar el retorno aquí
        const item = data.find(
          (d) =>
            d.sector_norm.trim() === sector &&
            d.mes.trim().toLowerCase() === key.toLowerCase(),
        );
        const rawTotal = item?.total ?? 0;
        const numericTotal = parseFloat(String(rawTotal).replace(/,/g, ''));
        const yValue = isNaN(numericTotal)
          ? 0
          : parseFloat((numericTotal / 1_000_000).toFixed(2));
        return { x: label, y: yValue };
      }),
    };
  });

  const sectorColors = Object.fromEntries(
    series.map((s) => [s.id, s.color as string]),
  );

  return { series, sectorColors, months: currentMonths } as const;
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
    domain: {
      line: { stroke: 'var(--Naranja-Tundata, #f39c12)', strokeWidth: 1 },
    },
    ticks: {
      line: { stroke: '#ffffff33', strokeWidth: 1 },
      text: {
        fontFamily: 'var(--font-ibm-plex-sans)',
        fontSize: 11,
        fill: '#cbd5e1',
      },
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
    text: {
      fontFamily: 'var(--font-ibm-plex-sans)',
      fontSize: 12,
      fill: '#ffffff',
    },
  },
  tooltip: {
    // Estilos base del tooltip, puedes sobreescribir con `sliceTooltip`
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
  const {
    series: allSeries,
    sectorColors,
    months,
  } = useMemo(() => transformData(rawData as EvolucionItem[]), []);

  const [activeSectors, setActiveSectors] = useState<string[]>(() =>
    allSeries.length > 0 ? [allSeries[0].id] : [],
  );
  const [showHint, setShowHint] = useState(true);
  const isMobile = useIsMobile();

  const toggleSector = useCallback(
    (sectorId: string) => {
      setActiveSectors((prevActive) => {
        const nextActive = prevActive.includes(sectorId)
          ? prevActive.filter((s) => s !== sectorId)
          : [...prevActive, sectorId];
        if (showHint && nextActive.length > 0) {
          setShowHint(false);
        }
        return nextActive;
      });
    },
    [showHint], // setShowHint no es necesario si solo se llama
  );

  const displayedSeries = useMemo(
    () => allSeries.filter((s) => activeSectors.includes(s.id)),
    [allSeries, activeSectors],
  );

  const tickRotation = isMobile
    ? months.length > 4
      ? -45
      : 0
    : months.length > 7
      ? -30
      : 0;
  const legendOffsetBottom = isMobile
    ? tickRotation !== 0
      ? 65
      : 55
    : tickRotation !== 0
      ? 70
      : 60;
  const axisLeftLegendOffset = isMobile ? -30 : -60;

  const margins = useMemo(
    () => ({
      top: 20,
      right: isMobile ? 10 : 30,
      bottom: legendOffsetBottom + (isMobile ? 20 : 10),
      left: isMobile ? 45 : 70,
    }),
    [isMobile, legendOffsetBottom],
  );

  const axisBottomLegendText = useMemo(
    () =>
      months.length > 0
        ? `Meses (${months[0].label} - ${months[months.length - 1].label})`
        : 'Meses',
    [months],
  );

  const getSeriesColor = useCallback(
    (serie: { id: string | number }) =>
      sectorColors[serie.id as string] || '#ccc',
    [sectorColors],
  );

  /* -------------------------------- tooltip ------------------------------- */
  const sliceTooltip = useCallback(
    // Corrected: Use NivoDatum (type of individual data points) as the generic argument
    ({ slice }: SliceTooltipProps<Serie>) => {
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
            {/* Nivo adds xFormatted to point.data; cast to AugmentedNivoDatum for type safety */}
            Mes: {(slice.points[0].data as AugmentedNivoDatum).xFormatted}
          </strong>

          {slice.points.map((p) => (
            <div
              key={p.id} // p.id is composite, e.g., "SectorName.MonthName"
              style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  backgroundColor: p.seriesColor, // from point object
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
                {p.seriesId}: {/* from point object */}
              </span>
              <strong
                style={{
                  marginLeft: 'auto',
                  paddingLeft: 8,
                  color: p.seriesColor, // from point object
                  whiteSpace: 'nowrap',
                }}
              >
                {/* Nivo adds yFormatted to point.data; cast for type safety */}
                ${(p.data as AugmentedNivoDatum).yFormatted}{' '}
                <span style={{ color: '#cbd5e1', fontWeight: 400 }}>M</span>
              </strong>
            </div>
          ))}
        </div>
      );
    },
    [isMobile], // isMobile is a dependency for styling
  );

  /* ---------------------------------- JSX ---------------------------------- */

  return (
    <div className={styles.frameParent}>
      <header className={styles.evolucionHeader}>
        <h3 className={styles.title}>Distribución Presupuestal Mensual</h3>
        <p className={styles.subtitle}>
          <span className={styles.highlight}>Visualiza</span> la variación del{' '}
          <span className={styles.highlight}>gasto por sector</span> en lo que
          va del 2025
        </p>
      </header>

      <div className={styles.rectangleParent}>
        <div
          className={styles.chartInnerNivo}
          style={{ height: isMobile ? 400 : 500 }}
        >
          {displayedSeries.length > 0 ? (
            <ResponsiveLine
              data={displayedSeries}
              theme={nivoTheme}
              colors={getSeriesColor}
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
                legend: isMobile
                  ? 'En Millones (COP)'
                  : 'Gasto En Millones (COP)',
                legendOffset: axisLeftLegendOffset,
                legendPosition: 'middle',
                format: (v: number) =>
                  v.toLocaleString('es-CO', { maximumFractionDigits: 0 }),
                tickValues: isMobile ? 4 : 5,
              }}
              lineWidth={isMobile ? 2 : 3}
              pointSize={isMobile ? 4 : 5}
              pointColor="white"
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              enableArea
              areaBlendMode="multiply"
              areaOpacity={0.15}
              useMesh
              enableSlices="x"
              sliceTooltip={sliceTooltip}
              legends={[]}
              motionConfig="slow"
              role="img"
              aria-label="Gráfico de líneas: Evolución mensual del gasto por sector"
            />
          ) : (
            <p className={styles.noDataMessage}>
              {allSeries.length > 0 && activeSectors.length === 0
                ? 'Usa los botones para activar sectores y ver su evolución.'
                : 'No hay datos para mostrar o ningún sector seleccionado.'}
            </p>
          )}
        </div>
      </div>

      {showHint && displayedSeries.length > 0 && (
        <p className={styles.mensajePedagogico}>
          ¡Explora los datos! Activa o desactiva sectores con los botones. Toca
          el gráfico para ver detalles.
        </p>
      )}

      {allSeries.length > 0 && (
        <div className={styles.botonParent}>
          {allSeries.map((serie) => {
            const isActive = activeSectors.includes(serie.id);
            const color = serie.color || sectorColors[serie.id] || '#ccc';
            return (
              <button
                key={serie.id}
                className={`${styles.boton} ${isActive ? styles.activo : ''}`}
                onClick={() => toggleSector(serie.id)}
                aria-pressed={isActive}
                style={{
                  backgroundColor: isActive
                    ? color
                    : 'color-mix(in srgb, var(--Azul-Tundata, #14344b) 60%, transparent)',
                  color: isActive ? 'var(--Azul-Tundata, #14344b)' : '#e0e0e0',
                  border: `2px solid ${isActive ? color : 'transparent'}`,
                }}
              >
                <span
                  className={styles.colorDot}
                  style={{ backgroundColor: color }}
                />
                {serie.id}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GraficaEvolucionNivo;
