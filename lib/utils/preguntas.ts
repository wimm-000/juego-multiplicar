/**
 * Tipos para el sistema de preguntas
 */

export interface Pregunta {
  id: string;
  multiplicando: number;
  multiplicador: number;
  respuestaCorrecta: number;
}

export interface RespuestaUsuario {
  preguntaId: string;
  respuesta: number;
  esCorrecto: boolean;
  intentos: number;
}

/**
 * Genera una pregunta aleatoria basada en las tablas seleccionadas
 */
export function generarPregunta(tablas: number[]): Pregunta {
  // Seleccionar tabla aleatoria
  const multiplicando = tablas[Math.floor(Math.random() * tablas.length)];
  
  // Seleccionar multiplicador aleatorio (1-10)
  const multiplicador = Math.floor(Math.random() * 10) + 1;
  
  return {
    id: `${multiplicando}x${multiplicador}-${Date.now()}`,
    multiplicando,
    multiplicador,
    respuestaCorrecta: multiplicando * multiplicador,
  };
}

/**
 * Genera un conjunto de preguntas únicas
 */
export function generarPreguntas(
  tablas: number[],
  cantidad: number
): Pregunta[] {
  const preguntas: Pregunta[] = [];
  const preguntasGeneradas = new Set<string>();

  // Calcular máximo de preguntas únicas posibles
  const maxPreguntas = tablas.length * 10;

  // Si se piden más preguntas de las únicas posibles, permitir repeticiones
  const permitirRepeticiones = cantidad > maxPreguntas;

  while (preguntas.length < cantidad) {
    const pregunta = generarPregunta(tablas);
    const clave = `${pregunta.multiplicando}x${pregunta.multiplicador}`;

    // Si no permitimos repeticiones, verificar que no exista
    if (!permitirRepeticiones && preguntasGeneradas.has(clave)) {
      continue;
    }

    preguntasGeneradas.add(clave);
    preguntas.push(pregunta);
  }

  // Mezclar las preguntas para orden aleatorio
  return mezclarArray(preguntas);
}

/**
 * Mezcla un array usando el algoritmo Fisher-Yates
 */
function mezclarArray<T>(array: T[]): T[] {
  const resultado = [...array];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

/**
 * Valida si una respuesta es correcta
 */
export function validarRespuesta(
  pregunta: Pregunta,
  respuesta: number
): boolean {
  return pregunta.respuestaCorrecta === respuesta;
}

/**
 * Filtra preguntas incorrectas de un conjunto de respuestas
 */
export function obtenerPreguntasIncorrectas(
  preguntas: Pregunta[],
  respuestas: RespuestaUsuario[]
): Pregunta[] {
  return preguntas.filter((pregunta) => {
    const respuesta = respuestas.find((r) => r.preguntaId === pregunta.id);
    return respuesta && !respuesta.esCorrecto;
  });
}
