'use client';

import Link from 'next/link';
import { useUsuario } from '@/components/providers/usuario-provider';
import { signOut } from '@/lib/actions/auth';
import PageTransition from '@/components/ui/page-transition';

export default function HomePage() {
  const usuario = useUsuario();

  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="brutal-border brutal-shadow bg-blanco p-12 max-w-2xl w-full">
        {/* Header con logout */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-6xl font-bold mb-2">
              MULTIPLICAR
            </h1>
            {usuario && (
              <p className="text-sm uppercase">
                Bienvenido, <strong>{usuario.nombre}</strong>
              </p>
            )}
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="brutal-border brutal-shadow-sm bg-rojo text-blanco px-4 py-2 font-bold text-sm uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-2 active:translate-y-2 transition-all"
            >
              SALIR
            </button>
          </form>
        </div>

        {/* Descripción */}
        <div className="mb-8">
          <p className="text-lg">
            Aprende y practica las tablas de multiplicar
          </p>
        </div>

        {/* Botones de navegación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Link
            href="/estudiar"
            className="brutal-border brutal-shadow bg-amarillo hover:bg-amarillo/90 p-8 font-bold text-2xl uppercase text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
          >
            <span className="block text-4xl mb-2">📚</span>
            ESTUDIAR
            <span className="block text-xs mt-2 font-normal">
              Repasa las tablas del 1 al 10
            </span>
          </Link>
          
          <Link
            href="/jugar"
            className="brutal-border brutal-shadow bg-rojo text-blanco hover:bg-rojo/90 p-8 font-bold text-2xl uppercase text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
          >
            <span className="block text-4xl mb-2">🎮</span>
            JUGAR
            <span className="block text-xs mt-2 font-normal">
              Pon a prueba tus conocimientos
            </span>
          </Link>
        </div>

        {/* Botón Perfil */}
        <Link
          href="/perfil"
          className="block brutal-border brutal-shadow-sm bg-papel p-4 font-bold text-center uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          📊 VER PERFIL Y ESTADÍSTICAS
        </Link>
        </div>
      </main>
    </PageTransition>
  );
}
