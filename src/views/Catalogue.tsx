'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import Photo from '@/components/Photo';
import { items, money } from '@/lib/data';
import { useStore } from '@/lib/store';

const categories = ['Tous', 'Vêtements', 'Linge de maison'];

export default function Catalogue() {
  const { add } = useStore();
  const [category, setCategory] = useState('Tous');
  const [search, setSearch] = useState('');
  const filtered = useMemo(
    () => items.filter((i) => (category === 'Tous' || i.category === category) && i.name.toLowerCase().includes(search.trim().toLowerCase())),
    [category, search],
  );

  return <main className="page">
    <div className="page-intro compact"><p className="eyebrow">Le catalogue</p><h1>Tout ce qui mérite<br /><em>d’être bien traité.</em></h1><p>Des tarifs indicatifs en FCFA, pensés pour une commande simple et transparente.</p></div>
    <div className="catalog-toolbar">
      <div className="tabs">{categories.map((x) => <button className={category === x ? 'selected' : ''} aria-pressed={category === x} onClick={() => setCategory(x)} key={x}>{x}</button>)}</div>
      <label className="search"><Search size={17} /><input placeholder="Rechercher un article" aria-label="Rechercher un article" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
    </div>
    <div className="catalog-grid">
      {filtered.map((item) => <article className="catalog-card" key={item.id}>
        <div className="catalog-img"><Photo src={item.image} alt={item.name} /><span>{item.category}</span></div>
        <div className="catalog-info"><div><h3>{item.name}</h3><p>{item.description}</p></div><strong>{money(item.price)}</strong></div>
        <button className="catalog-add" onClick={() => add(item.id)}>Ajouter à la commande <ArrowRight size={15} /></button>
      </article>)}
    </div>
    <div className="order-float"><span>{filtered.length ? 'Besoin d’un coup de main ?' : 'Aucun article trouvé'}</span><Link href="/commander">Voir ma commande <ArrowRight size={16} /></Link></div>
  </main>;
}
