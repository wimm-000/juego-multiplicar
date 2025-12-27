import { getSession } from '@/lib/actions/auth';
import { UsuarioProvider } from '@/components/providers/usuario-provider';
import { JuegoProvider } from '@/components/providers/juego-provider';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <UsuarioProvider usuario={session}>
      <JuegoProvider>
        {children}
      </JuegoProvider>
    </UsuarioProvider>
  );
}
