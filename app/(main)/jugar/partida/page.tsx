'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useJuego } from '@/components/providers/juego-provider';
import PreguntaMultiplicacion from '@/components/juego/pregunta-multiplicacion';
import TecladoNumerico from '@/components/juego/teclado-numerico';
import VidasDisplay from '@/components/juego/vidas-display';
import { guardarPartida, type GuardarRespuestaData } from '@/lib/actions/partidas';

export default function PartidaPage() {
  const router = useRouter();
  const partidaGuardadaRef = useRef(false);
  const {
    configuracion,
    estado,
    agregarDigito,
    borrarDigito,
    confirmarRespuesta,
    obtenerPreguntaActual,
    obtenerEstadisticas,
  } = useJuego();

  // Redirigir si no hay juego iniciado (con pequeño delay para evitar race conditions)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!configuracion || !estado) {
        router.push('/jugar');
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [configuracion, estado, router]);

  // Guardar partida y redirigir a resultados si el juego terminó
  useEffect(() => {
    if (estado?.juegoTerminado && !partidaGuardadaRef.current && configuracion) {
      partidaGuardadaRef.current = true;

      const guardarYRedirigir = async () => {
        const { aciertos, fallos, tiempoSegundos } = obtenerEstadisticas();

        // Preparar datos de respuestas - GUARDAR TODAS LAS RESPUESTAS (incluye múltiples intentos)
        const respuestasParaGuardar: GuardarRespuestaData[] = [];
        estado.preguntas.forEach((pregunta, index) => {
          const respuestas = estado.respuestas.filter((r) => r.preguntaId === pregunta.id);
          respuestas.forEach((respuesta, intentoIndex) => {
            respuestasParaGuardar.push({
              multiplicando: pregunta.multiplicando,
              multiplicador: pregunta.multiplicador,
              respuestaCorrecta: pregunta.respuestaCorrecta,
              respuestaUsuario: respuesta.respuesta,
              esCorrecto: respuesta.esCorrecto,
              intentos: intentoIndex + 1,
              orden: index + 1,
            });
          });
        });

        // Guardar en base de datos
        const resultado = await guardarPartida(
          {
            tablasSeleccionadas: configuracion.tablas,
            totalPreguntas: estado.preguntas.length,
            aciertos,
            fallos,
            vidasConfiguradas: configuracion.vidasActivadas ? configuracion.numeroVidas : 0,
            tiempoSegundos,
            completada: estado.preguntaActualIndex >= estado.preguntas.length - 1,
          },
          respuestasParaGuardar
        );

        if (!resultado.success) {
          console.error('Error al guardar partida:', resultado.error);
        }

        // Redirigir después de guardar (o después de error)
        setTimeout(() => {
          router.push('/jugar/resultado');
        }, 2000);
      };

      guardarYRedirigir();
    }
  }, [estado?.juegoTerminado, configuracion, estado, obtenerEstadisticas, router]);

  // Formatear tiempo MM:SS
  const formatearTiempo = (segundos: number): string => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer en tiempo real
  const [tiempoActual, setTiempoActual] = useState(0);
  useEffect(() => {
    if (!estado || estado.juegoTerminado) return;

    const interval = setInterval(() => {
      const { tiempoSegundos } = obtenerEstadisticas();
      setTiempoActual(tiempoSegundos);
    }, 1000);

    return () => clearInterval(interval);
  }, [estado, obtenerEstadisticas]);

  // Soporte de teclado físico
  useEffect(() => {
    if (!estado || estado.juegoTerminado || estado.feedback) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevenir comportamiento por defecto para teclas que vamos a usar
      if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }

      // Números 0-9
      if (e.key >= '0' && e.key <= '9') {
        agregarDigito(parseInt(e.key));
      }
      // Backspace para borrar
      else if (e.key === 'Backspace') {
        borrarDigito();
      }
      // Enter para confirmar
      else if (e.key === 'Enter') {
        confirmarRespuesta();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [estado, agregarDigito, borrarDigito, confirmarRespuesta]);

  if (!configuracion || !estado) {
    return null; // O un loader
  }

  const preguntaActual = obtenerPreguntaActual();
  const { progreso, aciertos, fallos } = obtenerEstadisticas();

  if (!preguntaActual) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8 bg-papel">
      {/* Header con progreso, vidas y tiempo */}
      <div className="brutal-border brutal-shadow bg-blanco p-4 mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* Back button */}
          <button
            onClick={() => router.push('/jugar')}
            className="brutal-border bg-papel px-4 py-2 font-bold hover:bg-negro hover:text-blanco transition-colors flex gap-2"
          >
            VOLVER
          </button>

          {/* Progreso */}
          <div className="font-bold text-lg">
            PREGUNTA {progreso}
          </div>

          {/* Vidas */}
          {configuracion.vidasActivadas && (
            <VidasDisplay 
              vidasRestantes={estado.vidasRestantes}
              vidasTotales={configuracion.numeroVidas}
            />
          )}

          {/* Timer */}
          <div className="font-bold text-lg font-mono">
            ⏱️ {formatearTiempo(tiempoActual)}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-3 pt-3 border-t-4 border-negro flex gap-6 text-sm">
          <span className="font-bold">
            ✓ Aciertos: <span className="text-amarillo">{aciertos}</span>
          </span>
          <span className="font-bold">
            ✗ Fallos: <span className="text-rojo">{fallos}</span>
          </span>
        </div>
      </div>

      {/* Contenedor principal del juego */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Pregunta */}
        <PreguntaMultiplicacion
          multiplicando={preguntaActual.multiplicando}
          multiplicador={preguntaActual.multiplicador}
          respuestaActual={estado.respuestaActual}
          feedback={estado.feedback}
        />

        {/* Teclado numérico */}
        <TecladoNumerico
          onNumberClick={agregarDigito}
          onBackspace={borrarDigito}
          onConfirm={confirmarRespuesta}
          disabled={estado.feedback !== null}
        />
        
        {/* Hint de teclado físico */}
        <div className="text-sm opacity-50 text-center font-mono">
          💡 Usa el teclado: 0-9 • Backspace • Enter
        </div>
      </div>

      {/* Mensaje de fin de juego */}
      {estado.juegoTerminado && (
        <div className="fixed inset-0 bg-negro/50 flex items-center justify-center p-4">
          <div className="brutal-border brutal-shadow bg-blanco p-8 max-w-md text-center">
            <h2 className="text-3xl font-bold mb-4">
              {configuracion.vidasActivadas && estado.vidasRestantes === 0
                ? '¡GAME OVER!'
                : '¡COMPLETADO!'}
            </h2>
            <p className="text-lg">Redirigiendo a resultados...</p>
          </div>
        </div>
      )}
    </main>
  );
}
