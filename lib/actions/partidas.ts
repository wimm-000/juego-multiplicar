'use server';

import { eq, desc, and } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { partidas, respuestas } from '@/lib/db/schema';
import { getSession } from './auth';

/**
 * Tipos para guardar partida
 */
export interface GuardarPartidaData {
  tablasSeleccionadas: number[];
  totalPreguntas: number;
  aciertos: number;
  fallos: number;
  vidasConfiguradas: number;
  tiempoSegundos: number;
  completada: boolean;
}

export interface GuardarRespuestaData {
  multiplicando: number;
  multiplicador: number;
  respuestaCorrecta: number;
  respuestaUsuario: number;
  esCorrecto: boolean;
  intentos: number;
  orden: number;
}

/**
 * Guarda una partida completa en la base de datos
 */
export async function guardarPartida(
  datosPartida: GuardarPartidaData,
  datosRespuestas: GuardarRespuestaData[]
) {
  try {
    // Obtener usuario de la sesión
    const session = await getSession();
    if (!session) {
      throw new Error('Usuario no autenticado');
    }

    // Insertar partida
    const [partidaCreada] = await db
      .insert(partidas)
      .values({
        usuario_id: session.id,
        fecha: new Date(),
        tablas_seleccionadas: JSON.stringify(datosPartida.tablasSeleccionadas),
        total_preguntas: datosPartida.totalPreguntas,
        aciertos: datosPartida.aciertos,
        fallos: datosPartida.fallos,
        vidas_configuradas: datosPartida.vidasConfiguradas,
        tiempo_segundos: datosPartida.tiempoSegundos,
        completada: datosPartida.completada,
      })
      .returning();

    if (!partidaCreada) {
      throw new Error('Error al crear la partida');
    }

    // Insertar todas las respuestas
    if (datosRespuestas.length > 0) {
      const respuestasParaInsertar = datosRespuestas.map((respuesta) => ({
        partida_id: partidaCreada.id,
        multiplicando: respuesta.multiplicando,
        multiplicador: respuesta.multiplicador,
        respuesta_correcta: respuesta.respuestaCorrecta,
        respuesta_usuario: respuesta.respuestaUsuario,
        es_correcto: respuesta.esCorrecto,
        intentos: respuesta.intentos,
        orden: respuesta.orden,
      }));

      await db.insert(respuestas).values(respuestasParaInsertar);
    }

    return {
      success: true,
      partidaId: partidaCreada.id,
    };
  } catch (error) {
    console.error('Error al guardar partida:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene el historial de partidas de un usuario
 */
export async function obtenerHistorialPartidas(limit = 10) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const partidasUsuario = await db
      .select()
      .from(partidas)
      .where(eq(partidas.usuario_id, session.id))
      .orderBy(desc(partidas.fecha))
      .limit(limit);

    return {
      success: true,
      partidas: partidasUsuario,
    };
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Obtiene las respuestas de una partida específica
 */
export async function obtenerRespuestasPartida(partidaId: number) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    // Verificar que la partida pertenece al usuario
    const [partida] = await db
      .select()
      .from(partidas)
      .where(and(eq(partidas.id, partidaId), eq(partidas.usuario_id, session.id)));

    if (!partida) {
      return { success: false, error: 'Partida no encontrada' };
    }

    const respuestasPartida = await db
      .select()
      .from(respuestas)
      .where(eq(respuestas.partida_id, partidaId))
      .orderBy(respuestas.orden);

    return {
      success: true,
      respuestas: respuestasPartida,
    };
  } catch (error) {
    console.error('Error al obtener respuestas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Elimina todas las partidas y respuestas del usuario actual
 */
export async function eliminarTodasLasPartidas() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    // Primero obtener todas las partidas del usuario
    const partidasUsuario = await db
      .select()
      .from(partidas)
      .where(eq(partidas.usuario_id, session.id));

    // Eliminar todas las respuestas asociadas a esas partidas
    for (const partida of partidasUsuario) {
      await db.delete(respuestas).where(eq(respuestas.partida_id, partida.id));
    }

    // Eliminar todas las partidas del usuario
    await db.delete(partidas).where(eq(partidas.usuario_id, session.id));

    return {
      success: true,
      mensaje: 'Todas las estadísticas han sido eliminadas',
    };
  } catch (error) {
    console.error('Error al eliminar estadísticas:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
