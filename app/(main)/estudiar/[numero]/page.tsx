'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';

export default function TablaPage() {
  const params = useParams();
  const numero = parseInt(params.numero as string);

  // Validar que el número esté entre 1 y 10
  if (isNaN(numero) || numero < 1 || numero > 10) {
    redirect('/estudiar');
  }

  // Generar las multiplicaciones
  const multiplicaciones = Array.from({ length: 10 }, (_, i) => {
    const multiplicador = i + 1;
    return {
      multiplicador,
      resultado: numero * multiplicador,
    };
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="brutal-border brutal-shadow bg-blanco p-6 md:p-12 max-w-4xl w-full">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/estudiar"
            className="inline-block brutal-border brutal-shadow-sm bg-papel px-4 py-2 font-bold text-sm uppercase mb-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            ← VOLVER
          </Link>
          <div className="brutal-border brutal-shadow-sm bg-amarillo p-4 mb-6">
            <h1 className="text-3xl md:text-5xl font-bold text-center">
              TABLA DEL {numero}
            </h1>
          </div>
        </div>

        {/* Lista de multiplicaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {multiplicaciones.map(({ multiplicador, resultado }) => (
            <div
              key={multiplicador}
              className="brutal-border bg-papel p-3 flex items-center gap-2 hover:bg-amarillo/20 transition-colors"
            >
              <span className="text-2xl md:text-3xl font-bold font-mono">
                {numero} × {multiplicador} = {resultado}
              </span>
            </div>
          ))}
        </div>

        {/* Botones de navegación */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {numero > 1 && (
            <Link
              href={`/estudiar/${numero - 1}`}
              className="brutal-border brutal-shadow-sm bg-papel px-4 py-3 font-bold text-sm uppercase text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              ← TABLA DEL {numero - 1}
            </Link>
          )}
          {numero < 10 && (
            <Link
              href={`/estudiar/${numero + 1}`}
              className={`brutal-border brutal-shadow-sm bg-papel px-4 py-3 font-bold text-sm uppercase text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all ${
                numero === 1 ? 'col-span-2' : ''
              }`}
            >
              TABLA DEL {numero + 1} →
            </Link>
          )}
        </div>

        {/* Consejo */}
        <div className="mt-6 p-4 bg-amarillo brutal-border">
          <p className="text-xs md:text-sm text-center">
            <strong>💡 CONSEJO:</strong> Repite en voz alta cada multiplicación
          </p>
        </div>
      </div>
    </main>
  );
}
