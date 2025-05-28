'use client';

import dynamic from 'next/dynamic';

// Dynamically import GraficaEvolucion with SSR disabled and a loading component
const GraficaEvolucion = dynamic(() => import('./GraficaEvo'), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-live="polite"
      style={{
        width: '100%',
        minHeight: '500px', // Same minHeight as the original wrapper
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
        fontSize: '1.2rem',
        color: '#e0e0e0',
        backgroundColor: 'var(--Azul-Fondo-Tundata, #0d2c45)', // Consistent background
        borderRadius: '8px', // Consistent with other cards
      }}
    >
      Cargando gráfico...
    </div>
  ),
});

export default function GraficaLazy() {
  // The wrapper div can be simplified as next/dynamic handles the loading state.
  // We might still want to keep it for consistent layout or styling if needed.
  // For now, we'll just render the dynamic component directly.
  // If specific wrapper styles are needed for layout *around* the loading state,
  // they can be added here.
  return <GraficaEvolucion />;
}
