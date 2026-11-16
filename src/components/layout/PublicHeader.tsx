"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Menu, ShoppingBag, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import './header.css';

const links = [
  { label: 'Prestations', href: '/prestations' },
  { label: 'Tarifs', href: '/catalogue' },
  { label: 'Fonctionnement', href: '/#fonctionnement' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'FAQ', href: '/faq' },
];

function Brand({ onClick }: { onClick?: () => void }) {
  return <Link className="sh-brand" href="/" onClick={onClick} aria-label="soigné, retour à l’accueil">
    <span className="sh-brand__mark" aria-hidden>s</span>
    <span className="sh-brand__name">soigné</span>
  </Link>;
}

export default function PublicHeader() {
  const pathname = usePathname();
  const { cartCount } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => href === pathname;
  const cartLabel = cartCount ? `Ma commande, ${cartCount} article${cartCount > 1 ? 's' : ''}` : 'Ma commande';

  useEffect(() => {
    if (!open) return;
    const opener = openRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const raf = window.requestAnimationFrame(() => closeRef.current?.focus());

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return; }
      if (event.key !== 'Tab' || !menuRef.current) return;
      const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>('button, a[href]'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <>
    <header className={scrolled ? 'sh is-scrolled' : 'sh'}>
      <div className="sh__bar">
        <Brand />

        <nav className="sh__nav" aria-label="Navigation principale">
          {links.map((l) => <Link key={l.label} href={l.href} className={isActive(l.href) ? 'is-active' : ''} aria-current={isActive(l.href) ? 'page' : undefined}>{l.label}</Link>)}
        </nav>

        <div className="sh__actions">
          <Link className="sh__track" href="/suivi">Suivre ma commande</Link>
          <Link className="sh__cart" href="/commander" aria-label={cartLabel}>
            <ShoppingBag size={22} strokeWidth={1.8} aria-hidden />
            {cartCount > 0 && <b aria-hidden>{cartCount}</b>}
          </Link>
          <Link className="sh__cta" href="/commander">Commander</Link>
          <button ref={openRef} className="sh__burger" aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="sh-menu" onClick={() => setOpen(true)}>
            <Menu size={26} aria-hidden />
          </button>
        </div>
      </div>
    </header>

    <AnimatePresence>
      {open && <motion.div ref={menuRef} id="sh-menu" className="sh-menu" role="dialog" aria-modal="true" aria-label="Menu" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .18 }}>
        <div className="sh-menu__top">
          <Brand onClick={() => setOpen(false)} />
          <button ref={closeRef} className="sh__burger" aria-label="Fermer le menu" onClick={() => setOpen(false)}><X size={26} aria-hidden /></button>
        </div>
        <nav className="sh-menu__links" aria-label="Menu principal">
          <Link href="/" className={isActive('/') ? 'is-active' : ''} onClick={() => setOpen(false)}>Accueil</Link>
          {links.map((l) => <Link key={l.label} href={l.href} className={isActive(l.href) ? 'is-active' : ''} onClick={() => setOpen(false)}>{l.label}</Link>)}
          <Link href="/suivi" className={isActive('/suivi') ? 'is-active' : ''} onClick={() => setOpen(false)}>Suivre ma commande</Link>
        </nav>
        <div className="sh-menu__foot">
          <Link className="sh__cta sh__cta--block" href="/commander" onClick={() => setOpen(false)}>Commander <ArrowRight size={18} aria-hidden /></Link>
          <p>Collecte et livraison à Abomey-Calavi<br />Lundi au samedi, 8 h à 18 h</p>
        </div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
