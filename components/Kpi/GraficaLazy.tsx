'use client'

import { useEffect, useRef, useState } from 'react'
import GraficaEvolucion from './GraficaEvo' // Asegúrate que la ruta sea correcta
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function GraficaLazy() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const element = wrapperRef.current
    if (!element) return

    // 1. Establecer el estado inicial (similar a RadialPair)
    //    autoAlpha para opacidad y visibilidad, y para el desplazamiento.
    gsap.set(element, { autoAlpha: 0, y: 50 });

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 90%', // Comienza cuando el 80% superior del elemento entra en el viewport
      // markers: true, // Descomenta para depuración visual de ScrollTrigger
      onEnter: () => {
        setShow(true) // Mostrar el componente GraficaEvolucion
        gsap.to(element, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8, // Duración consistente con RadialPair
          ease: 'power3.out', // Ease consistente
        })
      },
      onLeaveBack: () => {
        // Opcional: Revertir la animación si el usuario se desplaza hacia arriba
        // y el elemento sale de la vista.
        gsap.to(element, {
          autoAlpha: 0,
          y: 50,
          duration: 0.5, // Una duración ligeramente más corta para la salida
          ease: 'power3.in',
          onComplete: () => {
            // Opcional: Ocultar el contenido nuevamente si es necesario para optimizar
            // setShow(false); // Descomenta si quieres volver a ocultar GraficaEvolucion
          }
        })
      },
      // Si prefieres no ocultar GraficaEvolucion al salir y solo revertir la animación
      // podrías simplemente usar toggleActions: "play none none reverse"
      // y manejar setShow(true) solo una vez, o bien, no usar onLeaveBack y onComplete.
      // Para consistencia con el onEnter/onLeaveBack de RadialPair, lo dejamos así.
    })

    return () => {
      trigger.kill() // Limpiar la instancia de ScrollTrigger al desmontar
      // Si setShow(false) se usa en onLeaveBack, considera si necesitas resetear `show` aquí.
    }
  }, []) // El array de dependencias vacío asegura que esto se ejecute solo al montar/desmontar

  return (
    <div ref={wrapperRef} style={{ width: '100%', minHeight: show ? 'auto' : '500px' }}>
      {/* El minHeight en el div wrapper puede actuar como placeholder de altura
          antes de que 'show' sea true y GraficaEvolucion se renderice.
          Ajusta el valor de minHeight según sea necesario.
      */}
      {show ? <GraficaEvolucion /> : null}
      {/* También podrías tener un placeholder explícito si lo prefieres:
          {show ? <GraficaEvolucion /> : <div style={{ minHeight: 500, width: '100%' }} />}
          Pero animar el wrapper que ya tiene un minHeight suele ser suficiente.
      */}
    </div>
  )
}