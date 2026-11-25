'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import { FiInstagram } from 'react-icons/fi';
import PublicHeader from './PublicHeader';
import { useStore } from '@/lib/store';
import Logo from '@/components/Logo';

const publicPaths = ['/', '/prestations', '/catalogue', '/a-propos', '/faq', '/contact', '/suivi'];

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { notice } = useStore();
  const isPublic = publicPaths.includes(pathname);

  return <div className="app">
    {notice && <div className="toast" role="status"><Check size={16} />{notice}</div>}
    {isPublic && <PublicHeader />}
    {children}
    {isPublic && <Footer />}
  </div>;
}

function Footer() {
  return <footer>
    <div className="footer-top">
      <div>
        <Link className="brand inverse" href="/" aria-label="Impec, retour à l’accueil"><Logo tone="light" sub="pressing à domicile" /></Link>
        <p>Le soin qui vient à vous.<br />Abomey-Calavi, Bénin.</p>
      </div>
      <div className="footer-links">
        <div><b>Découvrir</b><Link href="/prestations">Nos services</Link><Link href="/catalogue">Catalogue</Link><Link href="/a-propos">À propos</Link></div>
        <div><b>Aide</b><Link href="/faq">FAQ</Link><Link href="/contact">Nous contacter</Link><Link href="/suivi">Suivre une commande</Link></div>
        <div><b>Démonstration</b><Link href="/admin">Administration</Link><Link href="/partenaire">Espace partenaire</Link><Link href="/coursier">Espace coursier</Link></div>
      </div>
    </div>
    <div className="footer-bottom"><span>© 2026 Impec. Projet de démonstration.</span><span><FiInstagram size={13} aria-hidden /> @impec.bj · Conditions générales · Confidentialité</span></div>
  </footer>;
}
