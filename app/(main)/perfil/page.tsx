'use client';

import Link from 'next/link';
import { useUsuario } from '@/components/providers/usuario-provider';
import { useEffect, useState } from 'react';
import { obtenerHistorialPartidas, eliminarTodasLasPartidas } from '@/lib/actions/partidas';
import PageTransition from '@/components/ui/page-transition';

interface Partida {
  id: number;
  fecha: Date;
  tablas_seleccionadas: string;
  total_preguntas: number;
  aciertos: number;
  fallos: number;
  vidas_configuradas: number | null;
  tiempo_segundos: number;
  completada: boolean;
}

export default function PerfilPage() {
  const usuario = useUsuario();
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const cargarHistorial = async () => {
      const resultado = await obtenerHistorialPartidas(10);
      
      if (resultado.success && resultado.partidas) {
        setPartidas(resultado.partidas as Partida[]);
      } else {
        setError(resultado.error || 'Error al cargar historial');
      }
      
      setLoading(false);
    };

    cargarHistorial();
  }, []);

  // Calcular estadísticas globales
  const estadisticas = partidas.reduce(
    (acc, p) => ({
      totalPartidas: acc.totalPartidas + 1,
      totalPreguntas: acc.totalPreguntas + p.total_preguntas,
      totalAciertos: acc.totalAciertos + p.aciertos,
      totalFallos: acc.totalFallos + p.fallos,
      tiempoTotal: acc.tiempoTotal + p.tiempo_segundos,
    }),
    { totalPartidas: 0, totalPreguntas: 0, totalAciertos: 0, totalFallos: 0, tiempoTotal: 0 }
  );

  const porcentajeGlobal = estadisticas.totalPreguntas > 0
    ? Math.round((estadisticas.totalAciertos / estadisticas.totalPreguntas) * 100)
    : 0;

  // Formatear tiempo
  const formatearTiempo = (segundos: number): string => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular tabla más difícil
  const tablaMasDificil = () => {
    if (partidas.length === 0) return null;

    const errorPorTabla: { [key: number]: number } = {};
    
    partidas.forEach((partida) => {
      const tablas = JSON.parse(partida.tablas_seleccionadas) as number[];
      const errorPromedio = partida.total_preguntas > 0 
        ? partida.fallos / tablas.length 
        : 0;
      
      tablas.forEach((tabla) => {
        errorPorTabla[tabla] = (errorPorTabla[tabla] || 0) + errorPromedio;
      });
    });

    const tablasOrdenadas = Object.entries(errorPorTabla).sort((a, b) => b[1] - a[1]);
    return tablasOrdenadas.length > 0 ? parseInt(tablasOrdenadas[0][0]) : null;
  };

  const tablaDificil = tablaMasDificil();

  // Handler para eliminar estadísticas
  const handleEliminarEstadisticas = async () => {
    setEliminando(true);
    const resultado = await eliminarTodasLasPartidas();
    
    if (resultado.success) {
      // Limpiar estado local
      setPartidas([]);
      setMostrarDialogo(false);
    } else {
      setError(resultado.error || 'Error al eliminar estadísticas');
    }
    
    setEliminando(false);
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <div className="brutal-border brutal-shadow bg-blanco p-6 md:p-12 max-w-5xl w-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-2">
                PERFIL
              </h1>
              {usuario && (
                <p className="text-lg uppercase">
                  Usuario: <strong>{usuario.nombre}</strong>
                </p>
              )}
            </div>
            <Link
              href="/"
              className="brutal-border brutal-shadow-sm bg-papel px-4 py-2 font-bold text-sm uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              ← VOLVER
            </Link>
          </div>

          {loading ? (
            <div className="text-center p-8">
              <p className="text-xl font-bold">Cargando estadísticas...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-rojo text-blanco brutal-border">
              <p className="text-xl font-bold">Error: {error}</p>
            </div>
          ) : partidas.length === 0 ? (
            <div className="text-center p-8 bg-papel brutal-border">
              <p className="text-xl font-bold mb-4">¡Aún no has jugado ninguna partida!</p>
              <Link
                href="/jugar"
                className="inline-block brutal-border brutal-shadow bg-amarillo px-6 py-3 font-bold uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm transition-all"
              >
                🎮 JUGAR AHORA
              </Link>
            </div>
          ) : (
            <>
              {/* Estadísticas Globales */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold uppercase">Estadísticas Globales</h2>
                  <button
                    onClick={() => setMostrarDialogo(true)}
                    className="brutal-border brutal-shadow-sm bg-rojo text-blanco px-4 py-2 font-bold text-sm uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    🗑️ RESETEAR
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="brutal-border bg-amarillo p-4 text-center">
                    <div className="text-3xl font-bold">{estadisticas.totalPartidas}</div>
                    <div className="text-xs uppercase font-bold mt-1">Partidas</div>
                  </div>
                  <div className="brutal-border bg-papel p-4 text-center">
                    <div className="text-3xl font-bold">{porcentajeGlobal}%</div>
                    <div className="text-xs uppercase font-bold mt-1">Aciertos</div>
                  </div>
                  <div className="brutal-border bg-papel p-4 text-center">
                    <div className="text-3xl font-bold font-mono">{formatearTiempo(estadisticas.tiempoTotal)}</div>
                    <div className="text-xs uppercase font-bold mt-1">Tiempo Total</div>
                  </div>
                  <div className="brutal-border bg-rojo text-blanco p-4 text-center">
                    <div className="text-3xl font-bold">{tablaDificil || '-'}</div>
                    <div className="text-xs uppercase font-bold mt-1">Tabla + Difícil</div>
                  </div>
                </div>
              </div>

              {/* Historial de Partidas */}
              <div>
                <h2 className="text-2xl font-bold mb-4 uppercase">Últimas 10 Partidas</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {partidas.map((partida) => {
                    const porcentaje = Math.round((partida.aciertos / partida.total_preguntas) * 100);
                    const tablas = JSON.parse(partida.tablas_seleccionadas) as number[];
                    const fecha = new Date(partida.fecha);
                    
                    return (
                      <div
                        key={partida.id}
                        className="brutal-border bg-papel p-4 hover:bg-amarillo/20 transition-colors"
                      >
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div className="flex-1">
                            <div className="font-bold text-lg">
                              {porcentaje}% - {partida.aciertos}/{partida.total_preguntas} correctas
                            </div>
                            <div className="text-sm mt-1">
                              <strong>Tablas:</strong> {tablas.join(', ')} • 
                              <strong> Tiempo:</strong> {formatearTiempo(partida.tiempo_segundos)} •
                              <strong> Vidas:</strong> {partida.vidas_configuradas || 'Sin límite'}
                            </div>
                            <div className="text-xs mt-1 opacity-70">
                              {fecha.toLocaleDateString()} {fecha.toLocaleTimeString()}
                            </div>
                          </div>
                          <div className={`px-3 py-1 brutal-border text-xs font-bold ${
                            porcentaje >= 80 ? 'bg-amarillo' : porcentaje >= 60 ? 'bg-papel' : 'bg-rojo text-blanco'
                          }`}>
                            {porcentaje >= 80 ? 'EXCELENTE' : porcentaje >= 60 ? 'BIEN' : 'PRACTICA'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Diálogo de confirmación */}
        {mostrarDialogo && (
          <div className="fixed inset-0 bg-negro/50 flex items-center justify-center p-4 z-50">
            <div className="brutal-border brutal-shadow bg-blanco p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 uppercase text-center">
                ⚠️ CONFIRMAR ACCIÓN
              </h2>
              <p className="text-lg mb-6 text-center">
                ¿Estás seguro de que quieres <strong className="text-rojo">ELIMINAR TODAS</strong> tus estadísticas y partidas?
              </p>
              <p className="text-sm mb-6 text-center opacity-70">
                Esta acción no se puede deshacer.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleEliminarEstadisticas}
                  disabled={eliminando}
                  className="w-full brutal-border brutal-shadow bg-rojo text-blanco p-4 font-bold text-lg uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                >
                  {eliminando ? 'ELIMINANDO...' : 'SÍ, ELIMINAR TODO'}
                </button>
                <button
                  onClick={() => setMostrarDialogo(false)}
                  disabled={eliminando}
                  className="w-full brutal-border brutal-shadow bg-papel p-4 font-bold text-lg uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </PageTransition>
  );
}
