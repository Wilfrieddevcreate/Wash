import type { Metadata, Viewport } from 'next';
import '../app.css';
import { StoreProvider } from '@/lib/store';
import SiteChrome from '@/components/layout/SiteChrome';

export const metadata: Metadata = {
  title: { default: 'Plié — pressing à domicile', template: '%s · Plié' },
  description: 'Collecte et livraison de pressing à domicile à Abomey-Calavi.',
};

export const viewport: Viewport = { themeColor: '#123b43' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><StoreProvider><SiteChrome>{children}</SiteChrome></StoreProvider></body></html>;
}
