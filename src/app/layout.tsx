import type { Metadata } from 'next';
import '../app.css';
import { StoreProvider } from '@/lib/store';
import SiteChrome from '@/components/layout/SiteChrome';

export const metadata: Metadata = {
  title: { default: 'soigné — pressing à domicile', template: '%s · soigné' },
  description: 'Collecte et livraison de pressing à domicile à Abomey-Calavi.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><StoreProvider><SiteChrome>{children}</SiteChrome></StoreProvider></body></html>;
}
