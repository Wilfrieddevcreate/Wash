'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Check, Search, Truck } from 'lucide-react';
import { money } from '@/lib/data';
import { allOrders, useStore } from '@/lib/store';

const stages = ['Commande confirmée', 'Collecte programmée', 'Vêtements récupérés', 'En cours de traitement', 'Prête à être livrée', 'Livrée'];

export default function Tracking() {
  const { placedOrders } = useStore();
  const params = useSearchParams();
  const orders = allOrders(placedOrders);
  const [query, setQuery] = useState(params.get('ref') ?? placedOrders[0]?.id ?? 'SG-24091');
  const order = orders.find((o) => o.id.toLowerCase() === query.trim().toLowerCase());
  const firstName = order && order.client !== 'Vous' ? order.client.split(' ')[0] : null;

  return <main className="page tracking">
    <div className="tracking-top">
      <div><p className="eyebrow">Suivi de commande</p><h1>{firstName ? `Bonjour ${firstName},` : 'Bonjour,'}<br /><em>on s’occupe de tout.</em></h1></div>
      <label className="tracking-search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Référence de commande" placeholder="SG-24091" /></label>
    </div>

    {order ? <div className="tracking-card">
      <div className="tracking-card-head">
        <div><span className="status-pill">● {order.status}</span><h2>{order.id}</h2><p>Collecte le {order.pickup}</p></div>
        <Truck size={32} />
      </div>
      <div className="timeline">
        {stages.map((s, i) => <div className={i <= order.stage ? 'timeline-step complete' : 'timeline-step'} key={s}>
          <span>{i < order.stage ? <Check size={13} /> : i + 1}</span>
          <div><b>{s}</b><small>{i < order.stage ? 'Terminé' : i === order.stage ? 'En cours' : 'À venir'}</small></div>
        </div>)}
      </div>
      <div className="tracking-detail">
        <div><span>Articles</span><b>{order.pieces} pièces</b></div>
        <div><span>Total estimé</span><b>{money(order.total)}</b></div>
        <div><span>Zone</span><b>{order.zone}</b></div>
      </div>
    </div> : <div className="tracking-card"><p>Aucune commande ne correspond à « {query} ». Essayez par exemple SG-24091.</p></div>}

    <Link className="text-link" href="/contact">Une question sur votre commande ? <ArrowRight size={16} /></Link>
  </main>;
}
