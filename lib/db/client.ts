import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Crear instancia de SQLite
const sqlite = new Database('./sqlite.db');

// Crear cliente de Drizzle
export const db = drizzle(sqlite, { schema });

// Exportar también la instancia de SQLite por si se necesita
export { sqlite };
