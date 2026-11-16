import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../app.css';
import { StoreProvider } from '@/lib/store';
import SiteChrome from '@/components/layout/SiteChrome';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Plié — pressing à domicile', template: '%s · Plié' },
  description: 'Collecte et livraison de pressing à domicile à Abomey-Calavi.',
};

export const viewport: Viewport = { themeColor: '#123b43' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" className={sans.variable}><body><StoreProvider><SiteChrome>{children}</SiteChrome></StoreProvider></body></html>;
}
