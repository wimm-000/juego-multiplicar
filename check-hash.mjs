import {db} from './lib/db/client.ts';
import {usuarios} from './lib/db/schema.ts';

const u = await db.select().from(usuarios);
console.log('');
console.log('🔍 Verificación de Contraseña Hasheada:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Usuario:', u[0].nombre);
console.log('Hash:', u[0].password);
console.log('Longitud:', u[0].password.length, 'caracteres');
console.log('Es bcrypt válido:', u[0].password.startsWith('$2b$') ? '✅ Sí' : '❌ No');
console.log('');
