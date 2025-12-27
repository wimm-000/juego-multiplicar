'use client';

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
    
    // Resetear transformaciones antes de animar
    gsap.set(button, { 
      scale: 1,
      x: 0,
      y: 0
    });
    
    // Animación de "pop" mejorada
    const tl = gsap.timeline();
    
    tl.to(button, {
      scale: 0.85,
      duration: 0.08,
      ease: 'power2.in',
    })
    .to(button, {
      scale: 1,
      duration: 0.3,
      ease: 'elastic.out(1, 0.5)',
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
            className="brutal-border brutal-shadow bg-blanco hover:bg-papel p-6 font-bold text-3xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="brutal-border brutal-shadow bg-rojo text-blanco hover:bg-rojo/90 p-6 font-bold text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Borrar"
        >
          ←
        </button>

        <button
          onClick={(e) => handleButtonClick(e, () => onNumberClick(0))}
          disabled={disabled}
          className="brutal-border brutal-shadow bg-blanco hover:bg-papel p-6 font-bold text-3xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          0
        </button>

        <button
          onClick={(e) => handleButtonClick(e, onConfirm)}
          disabled={disabled}
          className="brutal-border brutal-shadow bg-amarillo hover:bg-amarillo/90 p-6 font-bold text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Confirmar"
        >
          ✓
        </button>
      </div>
    </div>
  );
}
