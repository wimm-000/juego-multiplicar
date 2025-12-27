'use client';

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-papel">
      <div className="brutal-border brutal-shadow bg-blanco p-8 md:p-12 max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="text-8xl mb-4">📡</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            SIN CONEXIÓN
          </h1>
          <p className="text-lg mb-6">
            No tienes conexión a internet en este momento.
          </p>
        </div>

        <div className="brutal-border bg-papel p-6 mb-6 text-left">
          <h2 className="text-xl font-bold mb-4 uppercase">Funcionalidades Disponibles Offline:</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span>Modo Estudiar - Ver todas las tablas de multiplicar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">✓</span>
              <span>Modo Jugar - Practicar con preguntas aleatorias</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">✗</span>
              <span>Guardar estadísticas (se guardarán al reconectar)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">✗</span>
              <span>Ver perfil y estadísticas guardadas</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full brutal-border brutal-shadow bg-amarillo p-4 font-bold text-lg uppercase text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
          >
            🏠 IR AL INICIO
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full brutal-border brutal-shadow bg-papel p-4 font-bold text-lg uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
          >
            🔄 REINTENTAR CONEXIÓN
          </button>
        </div>

        <p className="text-sm mt-6 opacity-70">
          La aplicación se reconectará automáticamente cuando recuperes la conexión a internet.
        </p>
      </div>
    </main>
  );
}
