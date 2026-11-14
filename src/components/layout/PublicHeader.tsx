"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Menu, Package, UserRound, X } from 'lucide-react';
import { useStore } from '@/lib/store';

const primaryLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos prestations', href: '/prestations' },
  { label: 'Notre fonctionnement', href: '/#fonctionnement' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'FAQ', href: '/faq' },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const { cartCount } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => href === pathname;

  useEffect(() => {
    if (!open) return;
    const button = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const raf = window.requestAnimationFrame(() => firstLinkRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !menuRef.current) return;
      const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>('button, a[href]'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      button?.focus();
    };
  }, [open]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartLabel = `Commande${cartCount ? `, ${cartCount} article${cartCount > 1 ? 's' : ''}` : ''}`;

  return <>
    <header className={scrolled ? 'public-header is-scrolled' : 'public-header'}>
      <div className="public-header__location"><span className="live-dot" /> Service disponible à Abomey-Calavi</div>
      <div className="public-header__inner">
        <Link className="brand brand--public" href="/" aria-label="soigné, accueil">
          <span className="brand-mark">s</span>
          <span>soigné<small>pressing à domicile</small></span>
        </Link>

        <nav className="public-header__nav" aria-label="Navigation principale">
          {primaryLinks.map((link) => <Link key={link.label} href={link.href} className={isActive(link.href) ? 'is-active' : ''} aria-current={isActive(link.href) ? 'page' : undefined}>{link.label}</Link>)}
        </nav>

        <div className="public-header__actions">
          <Link className="public-header__secondary" href="/suivi"><UserRound size={15} strokeWidth={1.8} /> <span>Espace client</span></Link>
          <Link className="public-header__cart" href="/commander" aria-label={cartLabel}>
            <Package size={17} strokeWidth={1.7} />
            {cartCount > 0 && <b>{cartCount}</b>}
          </Link>
          <Link className="public-header__cta" href="/commander">Commander <ArrowRight size={14} /></Link>
          <button ref={menuButtonRef} className="public-header__menu-button" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((current) => !current)}>
            <span className="menu-icon"><Menu size={21} /><X size={21} /></span>
          </button>
        </div>
      </div>
    </header>

    <AnimatePresence>
      {open && <motion.div ref={menuRef} id="mobile-navigation" className="mobile-navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}>
        <div className="mobile-navigation__top"><span>Navigation</span><span>soigné / 2026</span></div>
        <div className="mobile-navigation__links">
          {primaryLinks.map((link, index) => <motion.span key={link.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }} style={{ display: 'contents' }}>
            <Link ref={index === 0 ? firstLinkRef : undefined} href={link.href} className={isActive(link.href) ? 'is-active' : ''} onClick={() => setOpen(false)}>{link.label}<ArrowRight size={18} /></Link>
          </motion.span>)}
        </div>
        <div className="mobile-navigation__footer"><Link href="/suivi" onClick={() => setOpen(false)}>Suivre une commande <ArrowRight size={15} /></Link><p>Collecte et livraison à domicile<br />à Abomey-Calavi</p></div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
