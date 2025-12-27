'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  Pregunta,
  RespuestaUsuario,
  generarPreguntas,
  validarRespuesta,
} from '@/lib/utils/preguntas';

/**
 * Configuración inicial del juego
 */
export interface ConfiguracionJuego {
  tablas: number[];
  numeroPreguntas: number;
  vidasActivadas: boolean;
  numeroVidas: number;
}

/**
 * Estado del juego en curso
 */
interface EstadoJuego {
  preguntas: Pregunta[];
  preguntaActualIndex: number;
  respuestas: RespuestaUsuario[];
  respuestaActual: string;
  vidasRestantes: number;
  tiempoInicio: number;
  feedback: 'correcto' | 'incorrecto' | null;
  juegoTerminado: boolean;
}

interface JuegoContextType {
  configuracion: ConfiguracionJuego | null;
  estado: EstadoJuego | null;
  iniciarJuego: (config: ConfiguracionJuego) => void;
  iniciarJuegoConPreguntas: (config: ConfiguracionJuego, preguntas: Pregunta[]) => void;
  agregarDigito: (digito: number) => void;
  borrarDigito: () => void;
  confirmarRespuesta: () => void;
  reiniciarJuego: () => void;
  obtenerPreguntaActual: () => Pregunta | null;
  obtenerPreguntasIncorrectas: () => Pregunta[];
  obtenerEstadisticas: () => {
    aciertos: number;
    fallos: number;
    tiempoSegundos: number;
    progreso: string;
  };
}

const JuegoContext = createContext<JuegoContextType | undefined>(undefined);

export function JuegoProvider({ children }: { children: ReactNode }) {
  const [configuracion, setConfiguracion] = useState<ConfiguracionJuego | null>(null);
  const [estado, setEstado] = useState<EstadoJuego | null>(null);

  // Iniciar nuevo juego
  const iniciarJuego = useCallback((config: ConfiguracionJuego) => {
    const preguntas = generarPreguntas(config.tablas, config.numeroPreguntas);
    
    setConfiguracion(config);
    setEstado({
      preguntas,
      preguntaActualIndex: 0,
      respuestas: [],
      respuestaActual: '',
      vidasRestantes: config.vidasActivadas ? config.numeroVidas : 0,
      tiempoInicio: Date.now(),
      feedback: null,
      juegoTerminado: false,
    });
  }, []);

  // Iniciar juego con preguntas específicas (para repetir errores)
  const iniciarJuegoConPreguntas = useCallback((config: ConfiguracionJuego, preguntas: Pregunta[]) => {
    console.log('🎮 iniciarJuegoConPreguntas llamado');
    console.log('  - Config:', config);
    console.log('  - Preguntas:', preguntas.length);
    
    setConfiguracion(config);
    setEstado({
      preguntas,
      preguntaActualIndex: 0,
      respuestas: [],
      respuestaActual: '',
      vidasRestantes: config.vidasActivadas ? config.numeroVidas : 0,
      tiempoInicio: Date.now(),
      feedback: null,
      juegoTerminado: false,
    });
    
    console.log('✅ Estado y configuración actualizados');
  }, []);

  // Agregar dígito a la respuesta actual
  const agregarDigito = useCallback((digito: number) => {
    if (!estado || estado.juegoTerminado || estado.feedback) return;

    setEstado((prev) => {
      if (!prev) return prev;
      
      // Limitar a 3 dígitos (máximo resultado posible: 10×10=100)
      if (prev.respuestaActual.length >= 3) return prev;
      
      return {
        ...prev,
        respuestaActual: prev.respuestaActual + digito.toString(),
      };
    });
  }, [estado]);

  // Borrar último dígito
  const borrarDigito = useCallback(() => {
    if (!estado || estado.juegoTerminado || estado.feedback) return;

    setEstado((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        respuestaActual: prev.respuestaActual.slice(0, -1),
      };
    });
  }, [estado]);

  // Confirmar respuesta
  const confirmarRespuesta = useCallback(() => {
    if (!estado || !configuracion || estado.juegoTerminado || estado.feedback) return;
    if (estado.respuestaActual === '') return;

    const preguntaActual = estado.preguntas[estado.preguntaActualIndex];
    const respuestaNumero = parseInt(estado.respuestaActual);
    const esCorrecto = validarRespuesta(preguntaActual, respuestaNumero);

    // Buscar cuántas veces ya se intentó esta pregunta
    const respuestasPrevias = estado.respuestas.filter(
      (r) => r.preguntaId === preguntaActual.id
    );
    const intentos = respuestasPrevias.length + 1;

    // Crear registro de respuesta (siempre agregar, nunca actualizar)
    const nuevaRespuesta: RespuestaUsuario = {
      preguntaId: preguntaActual.id,
      respuesta: respuestaNumero,
      esCorrecto,
      intentos,
    };

    // SIEMPRE agregar la nueva respuesta (nunca actualizar)
    const respuestasActualizadas = [...estado.respuestas, nuevaRespuesta];

    // Calcular nuevas vidas si aplica
    let nuevasVidas = estado.vidasRestantes;
    if (configuracion.vidasActivadas && !esCorrecto) {
      nuevasVidas = Math.max(0, estado.vidasRestantes - 1);
    }

    // Determinar si el juego terminó
    const esUltimaPregunta = estado.preguntaActualIndex === estado.preguntas.length - 1;
    const sinVidas = configuracion.vidasActivadas && nuevasVidas === 0;
    const juegoTerminado = esUltimaPregunta || sinVidas;

    setEstado({
      ...estado,
      respuestas: respuestasActualizadas,
      vidasRestantes: nuevasVidas,
      feedback: esCorrecto ? 'correcto' : 'incorrecto',
      juegoTerminado,
    });

    // Avanzar a la siguiente pregunta después de mostrar feedback
    if (!juegoTerminado && esCorrecto) {
      setTimeout(() => {
        setEstado((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            preguntaActualIndex: prev.preguntaActualIndex + 1,
            respuestaActual: '',
            feedback: null,
          };
        });
      }, 1500); // 1.5 segundos para ver el feedback
    } else if (juegoTerminado) {
      // Si terminó el juego, mantener feedback visible
      // El usuario verá la página de resultados
    } else {
      // Respuesta incorrecta pero aún hay vidas
      setTimeout(() => {
        setEstado((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            respuestaActual: '',
            feedback: null,
          };
        });
      }, 1500);
    }
  }, [estado, configuracion]);

  // Reiniciar juego con la misma configuración
  const reiniciarJuego = useCallback(() => {
    if (!configuracion) return;
    iniciarJuego(configuracion);
  }, [configuracion, iniciarJuego]);

  // Obtener pregunta actual
  const obtenerPreguntaActual = useCallback((): Pregunta | null => {
    if (!estado) return null;
    return estado.preguntas[estado.preguntaActualIndex] || null;
  }, [estado]);

  // Obtener estadísticas
  const obtenerEstadisticas = useCallback(() => {
    if (!estado) {
      return { aciertos: 0, fallos: 0, tiempoSegundos: 0, progreso: '0/0' };
    }

    const aciertos = estado.respuestas.filter((r) => r.esCorrecto).length;
    const fallos = estado.respuestas.filter((r) => !r.esCorrecto).length;
    const tiempoSegundos = Math.floor((Date.now() - estado.tiempoInicio) / 1000);
    const progreso = `${estado.preguntaActualIndex + 1}/${estado.preguntas.length}`;

    return { aciertos, fallos, tiempoSegundos, progreso };
  }, [estado]);

  // Obtener preguntas incorrectas del juego actual
  const obtenerPreguntasIncorrectas = useCallback((): Pregunta[] => {
    if (!estado) return [];
    
    return estado.preguntas.filter((pregunta) => {
      // Buscar todas las respuestas para esta pregunta
      const respuestas = estado.respuestas.filter((r) => r.preguntaId === pregunta.id);
      
      // Si no hay respuestas, no es incorrecta
      if (respuestas.length === 0) return false;
      
      // Es incorrecta si tiene al menos UNA respuesta incorrecta
      return respuestas.some((r) => !r.esCorrecto);
    });
  }, [estado]);

  const value: JuegoContextType = {
    configuracion,
    estado,
    iniciarJuego,
    iniciarJuegoConPreguntas,
    agregarDigito,
    borrarDigito,
    confirmarRespuesta,
    reiniciarJuego,
    obtenerPreguntaActual,
    obtenerPreguntasIncorrectas,
    obtenerEstadisticas,
  };

  return <JuegoContext.Provider value={value}>{children}</JuegoContext.Provider>;
}

export function useJuego() {
  const context = useContext(JuegoContext);
  if (context === undefined) {
    throw new Error('useJuego debe usarse dentro de JuegoProvider');
  }
  return context;
}
