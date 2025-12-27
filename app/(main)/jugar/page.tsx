'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useJuego } from '@/components/providers/juego-provider';

export default function JugarPage() {
  const router = useRouter();
  const { iniciarJuego } = useJuego();
  const [tablasSeleccionadas, setTablasSeleccionadas] = useState<number[]>([]);
  const [numeroPreguntas, setNumeroPreguntas] = useState<number>(10);
  const [vidasActivadas, setVidasActivadas] = useState<boolean>(false);
  const [numeroVidas, setNumeroVidas] = useState<number>(3);

  const tablas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Toggle selección de tabla
  const toggleTabla = (numero: number) => {
    setTablasSeleccionadas((prev) =>
      prev.includes(numero)
        ? prev.filter((t) => t !== numero)
        : [...prev, numero].sort((a, b) => a - b)
    );
  };

  // Calcular máximo de preguntas posibles
  const maxPreguntas = tablasSeleccionadas.length * 10;

  // Validar configuración antes de iniciar
  const puedeIniciar = tablasSeleccionadas.length > 0 && numeroPreguntas > 0;

  const handleIniciar = () => {
    if (!puedeIniciar) return;

    // Iniciar juego con la configuración
    iniciarJuego({
      tablas: tablasSeleccionadas,
      numeroPreguntas,
      vidasActivadas,
      numeroVidas,
    });

    // Redirigir a la página de partida
    router.push('/jugar/partida');
  };

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
            JUGAR
          </h1>
          <p className="text-sm md:text-base">
            Configura tu partida
          </p>
        </div>

        {/* Sección 1: Selector de tablas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 uppercase">
            1. Selecciona las tablas
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {tablas.map((numero) => {
              const seleccionada = tablasSeleccionadas.includes(numero);
              return (
                <button
                  key={numero}
                  onClick={() => toggleTabla(numero)}
                  className={`brutal-border p-4 font-bold text-2xl transition-all ${
                    seleccionada
                      ? 'bg-amarillo brutal-shadow-sm'
                      : 'bg-papel hover:bg-papel/70'
                  }`}
                >
                  {numero}
                </button>
              );
            })}
          </div>
          {tablasSeleccionadas.length > 0 && (
            <p className="text-sm mt-3 p-3 bg-papel brutal-border">
              <strong>Seleccionadas:</strong> {tablasSeleccionadas.join(', ')}
            </p>
          )}
        </div>

        {/* Sección 2: Número de preguntas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 uppercase">
            2. Número de preguntas
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max={maxPreguntas || 100}
              value={numeroPreguntas}
              onChange={(e) => setNumeroPreguntas(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={tablasSeleccionadas.length === 0}
              className="brutal-border bg-blanco px-4 py-3 font-bold text-2xl w-32 text-center disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-sm">
              {tablasSeleccionadas.length > 0 ? (
                <>Máximo: {maxPreguntas} preguntas</>
              ) : (
                <>Selecciona al menos una tabla</>
              )}
            </span>
          </div>
        </div>

        {/* Sección 3: Vidas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 uppercase">
            3. Vidas
          </h2>
          <div className="space-y-4">
            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={vidasActivadas}
                onChange={(e) => setVidasActivadas(e.target.checked)}
                className="w-6 h-6 brutal-border cursor-pointer"
              />
              <span className="font-bold">Activar sistema de vidas</span>
            </label>

            {vidasActivadas && (
              <div className="flex items-center gap-4 ml-10">
                <label className="font-bold">Número de vidas:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numeroVidas}
                  onChange={(e) => setNumeroVidas(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  className="brutal-border bg-blanco px-4 py-2 font-bold text-xl w-20 text-center"
                />
                <span className="text-2xl">
                  {Array.from({ length: numeroVidas }).map((_, i) => (
                    <span key={i}>❤️</span>
                  ))}
                </span>
              </div>
            )}

            {!vidasActivadas && (
              <p className="text-sm p-3 bg-papel brutal-border ml-10">
                Sin vidas activadas podrás responder todas las preguntas sin límite de errores
              </p>
            )}
          </div>
        </div>

        {/* Botón iniciar */}
        <button
          onClick={handleIniciar}
          disabled={!puedeIniciar}
          className={`w-full brutal-border brutal-shadow bg-rojo text-blanco p-6 font-bold text-2xl uppercase transition-all ${
            puedeIniciar
              ? 'hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          COMENZAR JUEGO
        </button>

        {!puedeIniciar && (
          <p className="text-sm text-center mt-4 text-rojo font-bold">
            Selecciona al menos una tabla para comenzar
          </p>
        )}
      </div>
    </main>
  );
}
