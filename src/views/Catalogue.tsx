'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ArrowRight, Minus, Plus, Search, ShoppingBag } from 'lucide-react';
import Photo from '@/components/Photo';
import { EASE, group, rise } from '@/components/motion';
import { items, LOGISTICS_FEE, money } from '@/lib/data';
import { useStore } from '@/lib/store';
import './catalogue.css';

const categories = ['Tous', 'Vêtements', 'Linge de maison'];

export default function Catalogue() {
  const { cart, cartCount, subtotal, setQty, add } = useStore();
  const [category, setCategory] = useState('Tous');
  const [search, setSearch] = useState('');
  const filtered = useMemo(
    () => items.filter((i) => (category === 'Tous' || i.category === category) && i.name.toLowerCase().includes(search.trim().toLowerCase())),
    [category, search],
  );

  return <MotionConfig reducedMotion="user"><main className="ct">
    <section className="ct-hero">
      <motion.div className="ct-wrap" variants={group(0.1, 0.05)} initial="hidden" animate="show">
        <motion.h1 variants={rise}>Les tarifs, article par article.</motion.h1>
        <motion.p variants={rise}>Prix indicatifs en FCFA, confirmés avant la collecte. Ajoutez vos articles : ils vous attendent dans votre commande.</motion.p>
        <motion.div variants={rise} className="ct-tools">
          <div className="ct-tabs" role="group" aria-label="Catégorie">
            {categories.map((x) => <button type="button" key={x} className={category === x ? 'is-on' : undefined} aria-pressed={category === x} onClick={() => setCategory(x)}>
              {category === x && <motion.span layoutId="ct-pill" className="ct-tabs__pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span>{x}</span>
            </button>)}
          </div>
          <label className="ct-search"><Search size={18} aria-hidden /><input type="search" placeholder="Rechercher un article" aria-label="Rechercher un article" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
        </motion.div>
      </motion.div>
    </section>

    <section className="ct-body">
      <div className="ct-wrap">
        <p className="ct-count" aria-live="polite">{filtered.length} article{filtered.length > 1 ? 's' : ''}</p>
        <motion.ul className="ct-grid" layout>
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((item) => {
              const qty = cart[item.id] ?? 0;
              return <motion.li key={item.id} className={`ct-card${qty ? ' is-in' : ''}`} layout initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.4, ease: EASE }} whileHover={{ y: -4 }}>
                <div className="ct-card__img"><Photo src={item.image} alt={item.name} /><span>{item.category}</span></div>
                <div className="ct-card__body">
                  <div className="ct-card__top"><h2>{item.name}</h2><strong>{money(item.price)}</strong></div>
                  <p>{item.description}</p>
                  <div className="ct-card__act">
                    {qty === 0
                      ? <motion.button type="button" className="ct-add" whileTap={{ scale: 0.96 }} onClick={() => add(item.id)}><Plus size={18} aria-hidden /> Ajouter</motion.button>
                      : <div className="ct-step" role="group" aria-label={`Quantité de ${item.name}`}>
                          <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => setQty(item.id, -1)} aria-label={`Retirer un ${item.name}`}><Minus size={18} aria-hidden /></motion.button>
                          <motion.output key={qty} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} aria-live="polite">{qty}</motion.output>
                          <motion.button type="button" whileTap={{ scale: 0.85 }} onClick={() => setQty(item.id, 1)} aria-label={`Ajouter un ${item.name}`}><Plus size={18} aria-hidden /></motion.button>
                        </div>}
                  </div>
                </div>
              </motion.li>;
            })}
          </AnimatePresence>
        </motion.ul>

        {filtered.length === 0 && <div className="ct-empty"><b>Aucun article ne correspond.</b><p>Essayez un autre mot, ou écrivez-nous si votre pièce n’est pas listée.</p><Link href="/contact">Nous écrire <ArrowRight size={16} aria-hidden /></Link></div>}

        <p className="ct-note">À chaque commande s’ajoutent {money(LOGISTICS_FEE)} de collecte et livraison. Une pièce qui n’est pas listée&nbsp;? <Link href="/contact">Demandez-nous un tarif.</Link></p>
      </div>
    </section>

    <AnimatePresence>
      {cartCount > 0 && <motion.div className="ct-bar" initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
        <span className="ct-bar__info"><ShoppingBag size={20} aria-hidden /><b>{cartCount} article{cartCount > 1 ? 's' : ''}</b><span>{money(subtotal)}</span></span>
        <Link className="ct-bar__cta" href="/commander">Voir ma commande <ArrowRight size={18} aria-hidden /></Link>
      </motion.div>}
    </AnimatePresence>
  </main></MotionConfig>;
}
