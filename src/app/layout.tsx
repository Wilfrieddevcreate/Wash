import type { Metadata } from 'next';
import '../app.css';

export const metadata: Metadata = {
  title: 'soigné — pressing à domicile',
  description: 'Collecte et livraison de pressing à domicile à Abomey-Calavi.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
