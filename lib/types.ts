// Tipos para el usuario
export interface Usuario {
  id: number;
  nombre: string;
  password: string;
  creado_en: Date;
}

// Tipos para configuración del juego
export interface ConfiguracionJuego {
  tablas: number[];
  totalPreguntas: number;
  vidas: number | null;
}

// Tipos para pregunta
export interface Pregunta {
  multiplicando: number;
  multiplicador: number;
  respuestaCorrecta: number;
}

// Tipos para respuesta del usuario
export interface RespuestaUsuario {
  multiplicando: number;
  multiplicador: number;
  respuestaCorrecta: number;
  respuestaUsuario: number;
  esCorrecto: boolean;
  intentos: number;
}

// Tipos para partida
export interface Partida {
  id?: number;
  usuario_id: number;
  fecha: Date;
  tablas_seleccionadas: string;
  total_preguntas: number;
  aciertos: number;
  fallos: number;
  vidas_configuradas: number | null;
  tiempo_segundos: number;
  completada: boolean;
}

// Tipos para estado del juego
export interface EstadoJuego {
  configuracion: ConfiguracionJuego;
  preguntas: Pregunta[];
  preguntaActual: number;
  vidasRestantes: number;
  respuestas: RespuestaUsuario[];
  tiempoInicio: number;
}
