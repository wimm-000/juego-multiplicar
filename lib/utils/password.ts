import bcrypt from 'bcryptjs';

/**
 * Hashea una contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Hash de la contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verifica si una contraseña coincide con un hash
 * @param password - Contraseña en texto plano
 * @param hash - Hash almacenado
 * @returns true si coincide, false si no
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
