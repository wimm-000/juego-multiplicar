'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface PreguntaMultiplicacionProps {
  multiplicando: number;
  multiplicador: number;
  respuestaActual: string;
  feedback?: 'correcto' | 'incorrecto' | null;
}

export default function PreguntaMultiplicacion({
  multiplicando,
  multiplicador,
  respuestaActual,
  feedback,
}: PreguntaMultiplicacionProps) {
  const preguntaRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLSpanElement>(null);
  const prevPreguntaRef = useRef(`${multiplicando}x${multiplicador}`);

  // Determinar color de fondo según feedback
  const getBgColor = () => {
    if (feedback === 'correcto') return 'bg-amarillo';
    if (feedback === 'incorrecto') return 'bg-rojo';
    return 'bg-blanco';
  };

  const getTextColor = () => {
    if (feedback === 'incorrecto') return 'text-blanco';
    return 'text-negro';
  };

  // Animación de entrada cuando cambia la pregunta
  useGSAP(() => {
    const preguntaActual = `${multiplicando}x${multiplicador}`;
    
    if (preguntaActual !== prevPreguntaRef.current && preguntaRef.current) {
      // Animación de slide desde la derecha + fade in
      gsap.fromTo(
        preguntaRef.current,
        {
          x: 100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        }
      );
      
      prevPreguntaRef.current = preguntaActual;
    }
  }, [multiplicando, multiplicador]);

  // Animación de feedback correcto/incorrecto
  useEffect(() => {
    if (!feedback || !feedbackRef.current || !preguntaRef.current) return;

    if (feedback === 'correcto') {
      // Animación correcto: scale up + rotate + flash amarillo
      const tl = gsap.timeline();
      
      tl.to(feedbackRef.current, {
        scale: 1.3,
        rotation: 10,
        duration: 0.2,
        ease: 'back.out',
      })
      .to(feedbackRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: 'elastic.out',
      });

      // Flash amarillo en el fondo
      gsap.fromTo(
        preguntaRef.current,
        { backgroundColor: '#FFD700' },
        { 
          backgroundColor: '#FFFEF2',
          duration: 0.6,
          ease: 'power2.out',
        }
      );
    } else if (feedback === 'incorrecto') {
      // Animación incorrecto: shake más pronunciado
      gsap.to(preguntaRef.current, {
        x: -10,
        yoyo: true,
        repeat: 5,
        duration: 0.08,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.set(preguntaRef.current, { x: 0 });
        },
      });

      // Shake del icono X
      gsap.to(feedbackRef.current, {
        rotation: 10,
        yoyo: true,
        repeat: 3,
        duration: 0.1,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.set(feedbackRef.current, { rotation: 0 });
        },
      });
    }
  }, [feedback]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Pregunta */}
      <div 
        ref={preguntaRef}
        className={`brutal-border brutal-shadow p-8 transition-colors ${getBgColor()} ${getTextColor()}`}
      >
        <div className="flex items-center justify-center gap-4 text-5xl md:text-7xl font-bold font-mono">
          <span>{multiplicando}</span>
          <span>×</span>
          <span>{multiplicador}</span>
          <span>=</span>
          <span className="min-w-[120px] md:min-w-[200px] text-center">
            {respuestaActual || '_'}
          </span>
          
          {/* Feedback visual al lado - siempre ocupa espacio */}
          <span 
            ref={feedbackRef}
            className="ml-4 inline-block w-16 text-center"
          >
            {feedback === 'correcto' && (
              <span className="text-6xl">✓</span>
            )}
            {feedback === 'incorrecto' && (
              <span className="text-6xl text-rojo">✗</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
