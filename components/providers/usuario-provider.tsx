'use client';

import { createContext, useContext, ReactNode } from 'react';

interface Usuario {
  id: number;
  nombre: string;
}

const UsuarioContext = createContext<Usuario | null>(null);

export function UsuarioProvider({ 
  children, 
  usuario 
}: { 
  children: ReactNode; 
  usuario: Usuario | null;
}) {
  return (
    <UsuarioContext.Provider value={usuario}>
      {children}
    </UsuarioContext.Provider>
  );
}

export function useUsuario() {
  const context = useContext(UsuarioContext);
  return context;
}
