'use client';

import Link from 'next/link';

export default function EstudiarPage() {
  const tablas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="brutal-border brutal-shadow bg-blanco p-6 md:p-12 max-w-4xl w-full">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-block brutal-border brutal-shadow-sm bg-papel px-4 py-2 font-bold text-sm uppercase mb-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            ← VOLVER
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            ESTUDIAR
          </h1>
          <p className="text-sm md:text-base">
            Selecciona una tabla para repasar
          </p>
        </div>

        {/* Grid de botones de tablas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {tablas.map((numero) => (
            <Link
              key={numero}
              href={`/estudiar/${numero}`}
              className="brutal-border brutal-shadow bg-amarillo hover:bg-amarillo/90 p-8 font-bold text-4xl text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
            >
              {numero}
              <span className="block text-xs mt-2 font-normal uppercase">
                Tabla del {numero}
              </span>
            </Link>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-papel brutal-border">
          <p className="text-xs md:text-sm">
            <strong>💡 TIP:</strong> Repasa cada tabla varias veces para memorizarla mejor
          </p>
        </div>
      </div>
    </main>
  );
}
