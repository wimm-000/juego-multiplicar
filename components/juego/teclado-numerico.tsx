'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';

interface TecladoNumericoProps {
  onNumberClick: (numero: number) => void;
  onBackspace: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export default function TecladoNumerico({
  onNumberClick,
  onBackspace,
  onConfirm,
  disabled = false,
}: TecladoNumericoProps) {
  const numeros = [7, 8, 9, 4, 5, 6, 1, 2, 3];

  // Animación al hacer click
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, callback: () => void) => {
    if (disabled) return;
    
    const button = e.currentTarget;
    
    // Cancelar cualquier animación previa en este botón
    gsap.killTweensOf(button);
    
    // Asegurar que esté en escala 1 antes de animar
    gsap.set(button, { scale: 1 });
    
    // Animación de "pop"
    gsap.to(button, {
      scale: 0.9,
      duration: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.2,
          ease: 'elastic.out',
        });
      },
    });

    callback();
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Grid 3x3 para números 1-9 */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {numeros.map((num) => (
          <button
            key={num}
            onClick={(e) => handleButtonClick(e, () => onNumberClick(num))}
            disabled={disabled}
            className="brutal-border brutal-shadow bg-blanco hover:bg-papel p-6 font-bold text-3xl hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Fila inferior: Borrar, 0, Confirmar */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={(e) => handleButtonClick(e, onBackspace)}
          disabled={disabled}
          className="brutal-border brutal-shadow bg-rojo text-blanco hover:bg-rojo/90 p-6 font-bold text-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          aria-label="Borrar"
        >
          ←
        </button>

        <button
          onClick={(e) => handleButtonClick(e, () => onNumberClick(0))}
          disabled={disabled}
          className="brutal-border brutal-shadow bg-blanco hover:bg-papel p-6 font-bold text-3xl hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
        >
          0
        </button>

        <button
          onClick={(e) => handleButtonClick(e, onConfirm)}
          disabled={disabled}
          className="brutal-border brutal-shadow bg-amarillo hover:bg-amarillo/90 p-6 font-bold text-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          aria-label="Confirmar"
        >
          ✓
        </button>
      </div>
    </div>
  );
}
