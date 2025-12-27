'use client';

import { signIn } from '@/lib/actions/auth';
import { useActionState } from 'react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, undefined);

  return (
    <div className="brutal-border brutal-shadow bg-blanco p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">MULTIPLICAR</h1>
        <div className="h-1 w-20 bg-negro"></div>
      </div>

      {/* Formulario */}
      <form action={formAction} className="space-y-6">
        {/* Error message */}
        {state?.error && (
          <div className="brutal-border bg-rojo text-blanco p-4">
            <p className="font-bold">ERROR</p>
            <p>{state.error}</p>
          </div>
        )}

        {/* Campo Usuario */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-bold mb-2 uppercase">
            Usuario
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            disabled={isPending}
            className="w-full brutal-border p-3 bg-blanco focus:outline-none focus:ring-4 focus:ring-negro disabled:opacity-50"
            placeholder="Ingresa tu usuario"
          />
        </div>

        {/* Campo Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-bold mb-2 uppercase">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            disabled={isPending}
            className="w-full brutal-border p-3 bg-blanco focus:outline-none focus:ring-4 focus:ring-negro disabled:opacity-50"
            placeholder="Ingresa tu contraseña"
          />
        </div>

        {/* Checkbox Recuérdame */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="recordarme"
            name="recordarme"
            disabled={isPending}
            className="w-5 h-5 brutal-border bg-blanco focus:ring-4 focus:ring-negro cursor-pointer disabled:opacity-50"
          />
          <label htmlFor="recordarme" className="ml-3 text-sm font-bold uppercase cursor-pointer">
            Recuérdame (30 días)
          </label>
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full brutal-border brutal-shadow bg-amarillo p-4 font-bold text-lg uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-sm active:translate-x-2 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
        >
          {isPending ? 'ENTRANDO...' : 'ENTRAR'}
        </button>
      </form>

      {/* Info adicional */}
      <div className="mt-8 p-4 brutal-border bg-papel">
        <p className="text-xs">
          <strong>Usuario de prueba:</strong> sira / sira
        </p>
      </div>
    </div>
  );
}
