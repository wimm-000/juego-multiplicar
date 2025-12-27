'use client';

import Link from 'next/link';
import { useJuego, type ConfiguracionJuego } from '@/components/providers/juego-provider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultadoPage() {
  const router = useRouter();
  const { 
    configuracion, 
    estado, 
    obtenerEstadisticas,
    obtenerPreguntasIncorrectas,
    iniciarJuegoConPreguntas,
  } = useJuego();

  // Redirigir si no hay juego completado
  useEffect(() => {
    if (!configuracion || !estado || !estado.juegoTerminado) {
      router.push('/jugar');
    }
  }, [configuracion, estado, router]);

  if (!configuracion || !estado || !estado.juegoTerminado) {
    return null;
  }

  const { aciertos, fallos, tiempoSegundos } = obtenerEstadisticas();
  const totalPreguntas = estado.preguntas.length;
  const porcentaje = Math.round((aciertos / totalPreguntas) * 100);

  // Formatear tiempo
  const formatearTiempo = (segundos: number): string => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Obtener preguntas falladas (para el botón de repetir)
  const preguntasFalladas = obtenerPreguntasIncorrectas();
  
  // Obtener TODAS las respuestas incorrectas (para mostrar en la lista)
  const respuestasIncorrectas = estado.respuestas.filter((r) => !r.esCorrecto);

  // Handler para repetir errores
  const handleRepetirErrores = () => {
    if (preguntasFalladas.length === 0 || !configuracion) return;

    // Crear nueva configuración manteniendo TODAS las propiedades originales
    const nuevaConfig: ConfiguracionJuego = {
      tablas: configuracion.tablas,
      numeroPreguntas: preguntasFalladas.length,
      vidasActivadas: configuracion.vidasActivadas,
      numeroVidas: configuracion.numeroVidas,
    };

    console.log('🔄 Repetir errores - Config original:', configuracion);
    console.log('🔄 Repetir errores - Nueva config:', nuevaConfig);
    console.log('🔄 Preguntas a repetir:', preguntasFalladas.length);

    // Iniciar juego con solo las preguntas incorrectas
    iniciarJuegoConPreguntas(nuevaConfig, preguntasFalladas);

    // Pequeño delay para asegurar que el estado se actualice antes de la navegación
    setTimeout(() => {
      router.push('/jugar/partida');
    }, 100);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="brutal-border brutal-shadow bg-blanco p-6 md:p-12 max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`brutal-border brutal-shadow p-6 mb-6 ${porcentaje >= 80 ? 'bg-amarillo' : porcentaje >= 60 ? 'bg-papel' : 'bg-rojo text-blanco'}`}>
            <h1 className="text-4xl md:text-6xl font-bold">
              {porcentaje >= 80 ? '¡EXCELENTE!' : porcentaje >= 60 ? '¡BIEN HECHO!' : '¡SIGUE PRACTICANDO!'}
            </h1>
          </div>
          <p className="text-xl font-bold">
            {aciertos} de {totalPreguntas} respuestas correctas ({porcentaje}%)
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="brutal-border bg-amarillo p-4 text-center">
            <div className="text-4xl font-bold">{aciertos}</div>
            <div className="text-sm uppercase font-bold mt-1">Aciertos</div>
          </div>
          <div className="brutal-border bg-rojo text-blanco p-4 text-center">
            <div className="text-4xl font-bold">{fallos}</div>
            <div className="text-sm uppercase font-bold mt-1">Fallos</div>
          </div>
          <div className="brutal-border bg-papel p-4 text-center col-span-2">
            <div className="text-4xl font-bold font-mono">{formatearTiempo(tiempoSegundos)}</div>
            <div className="text-sm uppercase font-bold mt-1">Tiempo</div>
          </div>
        </div>

        {/* Errores (si hay) */}
        {respuestasIncorrectas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 uppercase">Errores cometidos ({respuestasIncorrectas.length}):</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {respuestasIncorrectas.map((respuesta, index) => {
                const pregunta = estado.preguntas.find((p) => p.id === respuesta.preguntaId);
                if (!pregunta) return null;
                
                return (
                  <div key={`${respuesta.preguntaId}-${index}`} className="brutal-border bg-papel p-3 flex justify-between items-center">
                    <span className="font-bold font-mono">
                      {pregunta.multiplicando} × {pregunta.multiplicador} = {pregunta.respuestaCorrecta}
                    </span>
                    <span className="text-sm text-rojo font-bold">
                      Tu respuesta: {respuesta.respuesta}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-3">
          <button
            onClick={handleRepetirErrores}
            disabled={preguntasFalladas.length === 0}
            className="w-full brutal-border brutal-shadow bg-rojo text-blanco p-4 font-bold text-lg uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          >
            🔄 REPETIR ERRORES ({preguntasFalladas.length} {preguntasFalladas.length === 1 ? 'PREGUNTA' : 'PREGUNTAS'})
          </button>

          <Link
            href="/jugar"
            className="block w-full brutal-border brutal-shadow bg-amarillo p-4 font-bold text-lg uppercase text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
          >
            🎮 NUEVA PARTIDA
          </Link>

          <Link
            href="/"
            className="block w-full brutal-border brutal-shadow-sm bg-papel p-4 font-bold text-lg uppercase text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            🏠 VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </main>
  );
}
