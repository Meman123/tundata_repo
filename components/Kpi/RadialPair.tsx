'use client'

import { useEffect, useRef, useState } from 'react'
import DonutSector from './DonutSector'
import DonutEntidad from './DonutEntidad'
import styles from './RadialPair.module.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function RadialPairLazy() {
  const wrapperRef = useRef<HTMLElement | null>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const element = wrapperRef.current
    if (!element) return

    gsap.set(element, { autoAlpha: 0, y: 50 })

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 65%',
      onEnter: () => {
        setShow(true)
        gsap.to(element, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
      },
      onLeaveBack: () => {
        gsap.to(element, {
          autoAlpha: 0,
          y: 50,
          duration: 0.5,
          ease: 'power3.in',
        })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section
      ref={wrapperRef}
      className={styles.radialGrid}
      style={{ minHeight: show ? 'auto' : '750px', width: '100%' }}
    >
      {show && (
        <>
          <DonutSector />
          <DonutEntidad />
        </>
      )}
    </section>
  )
}
