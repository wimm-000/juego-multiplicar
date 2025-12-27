'use server';

import { db, usuarios } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

interface SignInState {
  error?: string;
}

export async function signIn(
  prevState: SignInState | undefined,
  formData: FormData
): Promise<SignInState | undefined> {
  const nombre = formData.get('nombre') as string;
  const password = formData.get('password') as string;
  const recordarme = formData.get('recordarme') === 'on';

  if (!nombre || !password) {
    return { error: 'Nombre y contraseña son requeridos' };
  }

  try {
    // Buscar usuario en la base de datos
    const usuario = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.nombre, nombre))
      .limit(1);

    if (usuario.length === 0) {
      return { error: 'Usuario no encontrado' };
    }

    // Verificar contraseña con bcrypt
    const passwordMatch = await bcrypt.compare(password, usuario[0].password);
    
    if (!passwordMatch) {
      return { error: 'Contraseña incorrecta' };
    }

    // Crear sesión con cookie
    const cookieStore = await cookies();
    const maxAge = recordarme ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 días o 1 día
    
    cookieStore.set('session', JSON.stringify({
      userId: usuario[0].id,
      nombre: usuario[0].nombre,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });

    // Redirigir al home
    redirect('/');
  } catch (error) {
    console.error('Error en signIn:', error);
    
    // Si es un redirect, dejarlo pasar
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    
    return { error: 'Error al iniciar sesión' };
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session) {
    return null;
  }

  try {
    const parsed = JSON.parse(session.value);
    // Normalizar: siempre devolver 'id' en lugar de 'userId'
    return {
      id: parsed.userId,
      nombre: parsed.nombre,
    };
  } catch {
    return null;
  }
}
