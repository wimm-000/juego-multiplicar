'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface VidasDisplayProps {
  vidasRestantes: number;
  vidasTotales: number;
}

export default function VidasDisplay({ vidasRestantes, vidasTotales }: VidasDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevVidasRef = useRef(vidasRestantes);

  // Animar cuando se pierde una vida
  useEffect(() => {
    if (vidasRestantes < prevVidasRef.current && containerRef.current) {
      // Buscar el último corazón roto
      const corazones = containerRef.current.querySelectorAll('.corazon');
      const corazonPerdido = corazones[vidasRestantes];

      if (corazonPerdido) {
        // Animación de pérdida: scale out + rotate + fade
        gsap.fromTo(
          corazonPerdido,
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
          },
          {
            scale: 0,
            rotation: 360,
            opacity: 0.3,
            duration: 0.6,
            ease: 'back.in',
          }
        );

        // Shake del contenedor
        gsap.to(containerRef.current, {
          x: -5,
          yoyo: true,
          repeat: 3,
          duration: 0.1,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.set(containerRef.current, { x: 0 });
          },
        });
      }

      prevVidasRef.current = vidasRestantes;
    }
  }, [vidasRestantes]);

  return (
    <div ref={containerRef} className="flex items-center gap-2">
      <span className="font-bold text-sm uppercase">Vidas:</span>
      <span className="text-2xl flex gap-1">
        {Array.from({ length: vidasTotales }).map((_, i) => (
          <span
            key={i}
            className="corazon inline-block transition-opacity"
          >
            {i < vidasRestantes ? '❤️' : '💔'}
          </span>
        ))}
      </span>
    </div>
  );
}
