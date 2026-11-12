"use client";

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Menu, Package, UserRound, X } from 'lucide-react';

type HeaderRoute = 'home' | 'services' | 'about' | 'faq' | 'tracking' | 'order';

type PublicHeaderProps = {
  view: string;
  cartCount: number;
  go: (view: HeaderRoute) => void;
};

const primaryLinks: Array<{ label: string; route: HeaderRoute; activeOn?: string }> = [
  { label: 'Accueil', route: 'home', activeOn: 'home' },
  { label: 'Nos prestations', route: 'services', activeOn: 'services' },
  { label: 'Notre fonctionnement', route: 'home' },
  { label: 'À propos', route: 'about', activeOn: 'about' },
  { label: 'FAQ', route: 'faq', activeOn: 'faq' },
];

export default function PublicHeader({ view, cartCount, go }: PublicHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => menuButtonRef.current?.focus(), 180);
  };

  const navigate = (route: HeaderRoute) => {
    close();
    go(route);
  };

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => firstLinkRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
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
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <>
    <header className={scrolled ? 'public-header is-scrolled' : 'public-header'}>
      <div className="public-header__location"><span className="live-dot" /> Service disponible à Abomey-Calavi</div>
      <div className="public-header__inner">
        <button className="brand brand--public" onClick={() => navigate('home')} aria-label="soigné, accueil">
          <span className="brand-mark">s</span>
          <span>soigné<small>pressing à domicile</small></span>
        </button>

        <nav className="public-header__nav" aria-label="Navigation principale">
          {primaryLinks.map((link) => <button key={link.label} className={view === link.activeOn ? 'is-active' : ''} onClick={() => navigate(link.route)}>{link.label}</button>)}
        </nav>

        <div className="public-header__actions">
          <button className="public-header__secondary" onClick={() => navigate('tracking')}><UserRound size={15} strokeWidth={1.8}/> <span>Espace client</span></button>
          <button className="public-header__cart" onClick={() => navigate('order')} aria-label={`Commande${cartCount ? `, ${cartCount} article${cartCount > 1 ? 's' : ''}` : ''}`}>
            <Package size={17} strokeWidth={1.7} />
            {cartCount > 0 && <b>{cartCount}</b>}
          </button>
          <button className="public-header__cta" onClick={() => navigate('order')}>Commander <ArrowRight size={14} /></button>
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
          {primaryLinks.map((link, index) => <motion.button ref={index === 0 ? firstLinkRef : undefined} key={link.label} className={view === link.activeOn ? 'is-active' : ''} onClick={() => navigate(link.route)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .035 }}>{link.label}<ArrowRight size={18} /></motion.button>)}
        </div>
        <div className="mobile-navigation__footer"><button onClick={() => navigate('tracking')}>Suivre une commande <ArrowRight size={15}/></button><p>Collecte et livraison à domicile<br/>à Abomey-Calavi</p></div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
