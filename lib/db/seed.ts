import { db } from './client';
import { usuarios } from './schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../utils/password';

async function seed() {
  console.log('🌱 Iniciando seed de base de datos...');

  try {
    // Verificar si el usuario 'sira' ya existe
    const usuarioExistente = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.nombre, 'sira'))
      .limit(1);

    if (usuarioExistente.length > 0) {
      console.log('ℹ️  El usuario "sira" ya existe en la base de datos.');
      console.log('✅ Seed completado (sin cambios).');
      return;
    }

    // Hash de la contraseña
    console.log('🔒 Hasheando contraseña con bcrypt...');
    const hashedPassword = await hashPassword('sira');

    // Insertar usuario inicial: sira / sira (hasheado)
    const nuevoUsuario = await db
      .insert(usuarios)
      .values({
        nombre: 'sira',
        password: hashedPassword,
      })
      .returning();

    console.log('✅ Usuario inicial creado:');
    console.log(`   - ID: ${nuevoUsuario[0].id}`);
    console.log(`   - Nombre: ${nuevoUsuario[0].nombre}`);
    console.log(`   - Password: [HASHEADO] ${hashedPassword.substring(0, 20)}...`);
    console.log('');
    console.log('🎉 Seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

// Ejecutar el seed
seed()
  .then(() => {
    console.log('👋 Cerrando conexión a la base de datos...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
