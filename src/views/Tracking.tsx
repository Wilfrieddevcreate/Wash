'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ArrowRight, Check, Search, Truck } from 'lucide-react';
import { EASE, group, rise } from '@/components/motion';
import { money } from '@/lib/data';
import { allOrders, useStore } from '@/lib/store';
import './inner.css';

const stages = ['Commande confirmée', 'Collecte programmée', 'Vêtements récupérés', 'En cours de traitement', 'Prête à être livrée', 'Livrée'];

export default function Tracking() {
  const { placedOrders } = useStore();
  const params = useSearchParams();
  const orders = allOrders(placedOrders);
  const [query, setQuery] = useState(params.get('ref') ?? placedOrders[0]?.id ?? 'IM-24091');
  const order = orders.find((o) => o.id.toLowerCase() === query.trim().toLowerCase());
  const firstName = order && order.client !== 'Vous' ? order.client.split(' ')[0] : null;
  const samples = orders.slice(0, 3).map((o) => o.id);

  return <MotionConfig reducedMotion="user"><main className="in">
    <section className="in-hero">
      <motion.div className="in-wrap" variants={group(0.1, 0.05)} initial="hidden" animate="show">
        <motion.h1 variants={rise}>{firstName ? `Bonjour ${firstName}, on s’occupe de tout.` : 'Où en est votre linge ?'}</motion.h1>
        <motion.p variants={rise}>Entrez votre référence pour suivre chaque étape, de la collecte à la livraison.</motion.p>
        <motion.form variants={rise} className="tk-search" onSubmit={(e) => e.preventDefault()} role="search">
          <Search size={20} aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Référence de commande" placeholder="Ex. IM-24091" autoComplete="off" />
        </motion.form>
        <motion.div variants={rise} className="tk-hints">Exemples :{samples.map((id) => <button type="button" key={id} onClick={() => setQuery(id)}>{id}</button>)}</motion.div>
      </motion.div>
    </section>

    <section className="in-section"><div className="in-wrap">
      <AnimatePresence mode="wait" initial={false}>
        {order
          ? <motion.div key={order.id} className="tk-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: EASE }}>
              <div className="tk-head">
                <div><span className="tk-pill"><i />{order.status}</span><h2>{order.id}</h2><p>Collecte : {order.pickup}</p></div>
                <span className="tk-truck"><Truck size={30} aria-hidden /></span>
              </div>
              <div className="tk-body">
                <ol className="tk-steps">
                  <span className="tk-rail" aria-hidden><motion.i initial={{ scaleY: 0 }} animate={{ scaleY: order.stage / (stages.length - 1) }} transition={{ duration: 1, ease: EASE, delay: 0.2 }} /></span>
                  {stages.map((s, i) => <motion.li key={s} className={i < order.stage ? 'is-done' : i === order.stage ? 'is-now' : undefined} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}>
                    <span className="tk-dot">{i < order.stage ? <Check size={16} aria-hidden /> : i + 1}</span>
                    <div><b>{s}</b><small>{i < order.stage ? 'Terminé' : i === order.stage ? 'En cours' : 'À venir'}</small></div>
                  </motion.li>)}
                </ol>
                <div className="tk-facts">
                  <div><span>Articles</span><b>{order.pieces} pièces</b></div>
                  <div><span>Total estimé</span><b>{money(order.total)}</b></div>
                  <div><span>Quartier</span><b>{order.zone}</b></div>
                </div>
              </div>
            </motion.div>
          : <motion.div key="none" className="tk-card tk-empty" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
              <h2>Aucune commande trouvée.</h2>
              <p>Aucune commande ne correspond à « {query} ». Vérifiez la référence, par exemple {samples[0]}.</p>
            </motion.div>}
      </AnimatePresence>
      <p className="tk-help"><Link className="in-link" href="/contact">Une question sur votre commande ? <ArrowRight size={16} aria-hidden /></Link></p>
    </div></section>
  </main></MotionConfig>;
}
