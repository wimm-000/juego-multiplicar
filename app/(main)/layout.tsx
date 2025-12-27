import { getSession } from '@/lib/actions/auth';
import { UsuarioProvider } from '@/components/providers/usuario-provider';
import { JuegoProvider } from '@/components/providers/juego-provider';
import OnlineStatus from '@/components/ui/online-status';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <UsuarioProvider usuario={session}>
      <JuegoProvider>
        <OnlineStatus />
        {children}
      </JuegoProvider>
    </UsuarioProvider>
  );
}
