'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { ArrowRight, Check, ChevronRight, Clock3, Droplets, House, Shirt, Sparkles, X, type LucideIcon } from 'lucide-react';
import Photo from '@/components/Photo';
import { items, LOGISTICS_FEE, money, services, slots, zones, type Order as PlacedOrder } from '@/lib/data';
import { useStore } from '@/lib/store';

const stepNames = ['Service', 'Articles', 'Collecte', 'Récapitulatif', 'Paiement'];
const serviceIcons: Record<string, LucideIcon> = { wash: Droplets, iron: Sparkles, dry: Shirt, home: House };

const collectSchema = z.object({
  address: z.string().trim().min(5, 'Indiquez une adresse de collecte.'),
  date: z.string().refine((d) => d !== '' && new Date(d) >= new Date(new Date().toDateString()), 'Choisissez un jour à partir d’aujourd’hui.'),
});

export default function Order() {
  const store = useStore();
  const { cart, setQty, serviceId, setServiceId, collect, setCollect, subtotal, total, cartCount, placeOrder } = store;
  const params = useSearchParams();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<'address' | 'date', string>>>({});
  const [confirmed, setConfirmed] = useState<PlacedOrder | null>(null);

  // Arrivée depuis une carte « Choisir ce service » : présélection et saut à l'étape 2.
  const preselect = params.get('service');
  useEffect(() => {
    if (preselect && services.some((s) => s.id === preselect)) {
      setServiceId(preselect);
      setStep(2);
    }
  }, [preselect, setServiceId]);

  const category = serviceId === 'home' ? 'Linge de maison' : serviceId ? 'Vêtements' : null;
  const visibleItems = useMemo(() => items.filter((i) => !category || i.category === category), [category]);
  const selected = Object.entries(cart).flatMap(([id, qty]) => {
    const item = items.find((i) => i.id === Number(id));
    return item ? [{ item, qty }] : [];
  });
  const service = services.find((s) => s.id === serviceId);

  const next = () => {
    if (step === 3) {
      const result = collectSchema.safeParse(collect);
      if (!result.success) {
        const flat = result.error.flatten().fieldErrors;
        setErrors({ address: flat.address?.[0], date: flat.date?.[0] });
        return;
      }
      setErrors({});
    }
    setStep(step + 1);
  };

  const pay = () => {
    setConfirmed(placeOrder());
    setStep(6);
  };

  const disabled = (step === 2 && selected.length === 0) || (step === 4 && selected.length === 0);

  return <main className="order-page">
    <div className="order-head">
      <div><p className="eyebrow">Nouvelle commande</p><h1>Un peu de soin,<br /><em>en quelques étapes.</em></h1></div>
      <Link className="close-order" href="/"><X size={18} /> Quitter</Link>
    </div>

    {step < 6 && <div className="stepper">{stepNames.map((n, i) => <button disabled={i + 1 > step} onClick={() => setStep(i + 1)} className={step >= i + 1 ? 'done' : ''} aria-current={step === i + 1 ? 'step' : undefined} key={n}><span>{step > i + 1 ? <Check size={14} /> : i + 1}</span>{n}</button>)}</div>}

    <div className="order-body">
      {step === 1 && <div className="choice-panel">
        <h2>Quel soin pour vos vêtements ?</h2>
        <p className="muted">Vous pourrez ajuster votre sélection à l’étape suivante.</p>
        <div className="choice-grid">
          {services.map((s) => { const Icon = serviceIcons[s.id]; return <button className="choice-card" onClick={() => { setServiceId(s.id); setStep(2); }} key={s.id}><Icon size={25} /><h3>{s.title}</h3><p>{s.short}</p><ChevronRight size={16} /></button>; })}
        </div>
      </div>}

      {step === 2 && <div className="choice-panel">
        <h2>Que souhaitez-vous faire traiter ?</h2>
        <p className="muted">{service ? `Service : ${service.title}. ` : ''}Ajoutez les articles à votre panier. Les prix sont indicatifs.</p>
        <div className="order-items">
          {visibleItems.map((item) => <div className="order-item" key={item.id}>
            <Photo src={item.image} alt={item.name} width={120} height={120} />
            <div><h3>{item.name}</h3><span>{money(item.price)}</span></div>
            <div className="quantity"><button aria-label={`Retirer ${item.name}`} onClick={() => setQty(item.id, -1)}>−</button><b>{cart[item.id] ?? 0}</b><button aria-label={`Ajouter ${item.name}`} onClick={() => setQty(item.id, 1)}>+</button></div>
          </div>)}
        </div>
      </div>}

      {step === 3 && <div className="form-panel">
        <h2>Où et quand collecter ?</h2>
        <p className="muted">Nous intervenons actuellement à Abomey-Calavi.</p>
        <div className="form-grid">
          <label>Adresse de collecte<input value={collect.address} onChange={(e) => setCollect({ ...collect, address: e.target.value })} placeholder="Ex. Rue 125, Zogbadjè" aria-invalid={!!errors.address} />{errors.address && <small className="field-error" role="alert">{errors.address}</small>}</label>
          <label>Quartier<select value={collect.zone} onChange={(e) => setCollect({ ...collect, zone: e.target.value })}>{zones.map((z) => <option key={z}>{z}</option>)}</select></label>
          <label>Jour souhaité<input type="date" value={collect.date} onChange={(e) => setCollect({ ...collect, date: e.target.value })} aria-invalid={!!errors.date} />{errors.date && <small className="field-error" role="alert">{errors.date}</small>}</label>
          <label>Créneau<select value={collect.slot} onChange={(e) => setCollect({ ...collect, slot: e.target.value })}>{slots.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label className="full">Instructions complémentaires<textarea value={collect.notes} onChange={(e) => setCollect({ ...collect, notes: e.target.value })} placeholder="Un repère, une précision…" /></label>
        </div>
      </div>}

      {step === 4 && <div className="summary">
        <div><h2>Tout est en ordre ?</h2><p className="muted">Vérifiez les informations de votre commande.</p></div>
        <div className="summary-box">
          <h3>Articles sélectionnés</h3>
          {service && <div className="summary-row"><span>Service</span><b>{service.title}</b></div>}
          {selected.map(({ item, qty }) => <div className="summary-row" key={item.id}><span>{qty} × {item.name}</span><b>{money(qty * item.price)}</b></div>)}
          <div className="summary-row"><span>Collecte</span><b>{collect.zone} · {collect.slot}</b></div>
          <div className="summary-row"><span>Frais logistiques</span><b>{money(LOGISTICS_FEE)}</b></div>
          <div className="summary-total"><span>Total estimé</span><b>{money(total)}</b></div>
        </div>
        <div className="info-note"><Clock3 size={17} /> Collecte estimée sous 24 à 48 h après confirmation.</div>
      </div>}

      {step === 5 && <div className="payment-panel">
        <div className="success-icon"><Check /></div>
        <h2>Votre commande est prête.</h2>
        <p className="muted">Choisissez votre mode de règlement. Aucun paiement réel ne sera déclenché.</p>
        <button className="payment-choice" onClick={pay}><span><span className="radio" />Paiement à la récupération</span><ChevronRight /></button>
        <button className="payment-choice" onClick={pay}><span><span className="radio" />Paiement à l’avance</span><ChevronRight /></button>
      </div>}

      {step === 6 && confirmed && <div className="confirmation">
        <div className="success-icon"><Check /></div>
        <p className="eyebrow">Commande confirmée</p>
        <h2>Merci, votre linge est<br /><em>entre de bonnes mains.</em></h2>
        <p>Votre référence <b>{confirmed.id}</b> a bien été créée. Nous vous contacterons avant la collecte.</p>
        <Link className="btn btn-dark" href={`/suivi?ref=${confirmed.id}`}>Suivre ma commande <ArrowRight size={17} /></Link>
      </div>}
    </div>

    {step < 6 && step !== 5 && <div className="order-footer">
      <span>{cartCount ? `${cartCount} article(s) · ${money(subtotal)}` : 'Votre sélection est vide'}</span>
      <button className="btn btn-dark" disabled={disabled} onClick={next}>Continuer <ArrowRight size={17} /></button>
    </div>}
  </main>;
}
