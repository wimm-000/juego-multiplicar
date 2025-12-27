import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Tabla de usuarios
export const usuarios = sqliteTable('usuarios', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull().unique(),
  password: text('password').notNull(),
  creado_en: integer('creado_en', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Tabla de partidas
export const partidas = sqliteTable('partidas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  usuario_id: integer('usuario_id')
    .notNull()
    .references(() => usuarios.id),
  fecha: integer('fecha', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  tablas_seleccionadas: text('tablas_seleccionadas').notNull(), // JSON: [2,3,5]
  total_preguntas: integer('total_preguntas').notNull(),
  aciertos: integer('aciertos').notNull().default(0),
  fallos: integer('fallos').notNull().default(0),
  vidas_configuradas: integer('vidas_configuradas'), // null = ilimitadas
  tiempo_segundos: integer('tiempo_segundos').notNull().default(0),
  completada: integer('completada', { mode: 'boolean' }).notNull().default(false),
  creado_en: integer('creado_en', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Tabla de respuestas
export const respuestas = sqliteTable('respuestas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  partida_id: integer('partida_id')
    .notNull()
    .references(() => partidas.id),
  multiplicando: integer('multiplicando').notNull(), // ej: 6
  multiplicador: integer('multiplicador').notNull(), // ej: 8
  respuesta_correcta: integer('respuesta_correcta').notNull(), // 48
  respuesta_usuario: integer('respuesta_usuario').notNull(), // Lo que introdujo
  es_correcto: integer('es_correcto', { mode: 'boolean' }).notNull(),
  intentos: integer('intentos').notNull().default(1), // Número de intentos hasta acertar o fallar
  orden: integer('orden').notNull(), // Orden en la partida
});

// Tipos inferidos para TypeScript
export type Usuario = typeof usuarios.$inferSelect;
export type NuevoUsuario = typeof usuarios.$inferInsert;

export type Partida = typeof partidas.$inferSelect;
export type NuevaPartida = typeof partidas.$inferInsert;

export type Respuesta = typeof respuestas.$inferSelect;
export type NuevaRespuesta = typeof respuestas.$inferInsert;
