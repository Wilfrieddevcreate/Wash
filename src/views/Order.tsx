'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Check, Clock3, Droplets, House, Minus, Pencil, Plus, Shirt, Sparkles, X, type LucideIcon } from 'lucide-react';
import Logo from '@/components/Logo';
import Photo from '@/components/Photo';
import { EASE } from '@/components/motion';
import { items, LOGISTICS_FEE, money, services, slots, zones, type Order as PlacedOrder } from '@/lib/data';
import { useStore } from '@/lib/store';
import './order.css';

const stepNames = ['Service', 'Articles', 'Collecte', 'Vérification', 'Paiement'];
const serviceIcons: Record<string, LucideIcon> = { wash: Droplets, iron: Sparkles, dry: Shirt, home: House };

const collectSchema = z.object({
  address: z.string().trim().min(5, 'Indiquez une adresse de collecte.'),
  date: z.string().refine((d) => d !== '' && new Date(d) >= new Date(new Date().toDateString()), 'Choisissez un jour à partir d’aujourd’hui.'),
});

const dayLabel = (d: string) => d ? new Date(`${d}T00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '—';

export default function Order() {
  const store = useStore();
  const { cart, setQty, serviceId, setServiceId, collect, setCollect, subtotal, total, cartCount, placeOrder } = store;
  const params = useSearchParams();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<'address' | 'date', string>>>({});
  const [confirmed, setConfirmed] = useState<PlacedOrder | null>(null);
  const [minDate, setMinDate] = useState<string | undefined>();

  useEffect(() => {
    const d = new Date();
    setMinDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10));
  }, []);

  // Arrivée depuis « Choisir » sur une prestation : présélection et saut à l'étape 2.
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
  const pay = () => { setConfirmed(placeOrder()); setStep(6); };
  const disabled = (step === 2 || step === 4) && selected.length === 0;
  const showAside = step === 2 || step === 3;

  const Summary = <div className="od-sum">
    <h3>Votre commande</h3>
    {service && <p className="od-sum__svc">{service.title}</p>}
    {selected.length === 0
      ? <p className="od-sum__empty">Aucun article pour l’instant.</p>
      : <ul>{selected.map(({ item, qty }) => <li key={item.id}><span>{qty} × {item.name}</span><b>{money(qty * item.price)}</b></li>)}</ul>}
    <dl>
      <div><dt>Sous-total</dt><dd>{money(subtotal)}</dd></div>
      <div><dt>Collecte et livraison</dt><dd>{cartCount ? money(LOGISTICS_FEE) : '—'}</dd></div>
      <div className="od-sum__total"><dt>Total estimé</dt><dd>{money(total)}</dd></div>
    </dl>
  </div>;

  return <MotionConfig reducedMotion="user"><main className="od">
    <header className="od-top">
      <div className="od-wrap od-top__in">
        <Link href="/" aria-label="Plié, retour à l’accueil"><Logo /></Link>
        <Link className="od-quit" href="/"><X size={18} aria-hidden /> Quitter</Link>
      </div>
    </header>

    <div className="od-wrap">
      {step < 6 && <>
        <ol className="od-steps" aria-label="Étapes de la commande">
          {stepNames.map((n, i) => <li key={n} className={step === i + 1 ? 'is-now' : step > i + 1 ? 'is-done' : undefined}>
            <button type="button" disabled={i + 1 > step} onClick={() => setStep(i + 1)} aria-current={step === i + 1 ? 'step' : undefined}>
              <span>{step > i + 1 ? <Check size={14} aria-hidden /> : i + 1}</span><em>{n}</em>
            </button>
          </li>)}
        </ol>
        <div className="od-progress" aria-hidden><motion.i animate={{ scaleX: (step - 1) / (stepNames.length - 1) }} transition={{ duration: 0.5, ease: EASE }} /></div>
      </>}

      <div className={`od-grid${showAside ? ' has-aside' : ''}`}>
        <div className="od-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.3, ease: EASE }}>

              {step === 1 && <section>
                <h1>Quel soin pour votre linge ?</h1>
                <p className="od-sub">Vous pourrez ajuster votre sélection à l’étape suivante.</p>
                <div className="od-services">
                  {services.map((s) => { const Icon = serviceIcons[s.id]; return <motion.button type="button" key={s.id} className={`od-svc${serviceId === s.id ? ' is-on' : ''}`} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => { setServiceId(s.id); setStep(2); }}>
                    <Icon size={30} strokeWidth={1.4} aria-hidden />
                    <b>{s.title}</b><span>{s.short}</span>
                    <small>Dès {money(s.price)}</small>
                  </motion.button>; })}
                </div>
              </section>}

              {step === 2 && <section>
                <h1>Que faut-il traiter ?</h1>
                <p className="od-sub">{service ? `${service.title}. ` : ''}Ajoutez vos articles, les prix sont indicatifs.</p>
                <ul className="od-items">
                  {visibleItems.map((item) => { const q = cart[item.id] ?? 0; return <li key={item.id} className={q ? 'is-in' : undefined}>
                    <div className="od-items__img"><Photo src={item.image} alt={item.name} width={120} height={120} /></div>
                    <div className="od-items__txt"><b>{item.name}</b><span>{money(item.price)}</span></div>
                    <div className="od-qty">
                      <button type="button" aria-label={`Retirer ${item.name}`} disabled={!q} onClick={() => setQty(item.id, -1)}><Minus size={18} aria-hidden /></button>
                      <output>{q}</output>
                      <button type="button" aria-label={`Ajouter ${item.name}`} onClick={() => setQty(item.id, 1)}><Plus size={18} aria-hidden /></button>
                    </div>
                  </li>; })}
                </ul>
              </section>}

              {step === 3 && <section>
                <h1>Où et quand passer ?</h1>
                <p className="od-sub">Nous intervenons actuellement à Abomey-Calavi.</p>
                <div className="od-form">
                  <label className="full">Adresse de collecte<input value={collect.address} onChange={(e) => setCollect({ ...collect, address: e.target.value })} placeholder="Ex. Rue 125, Zogbadjè" aria-invalid={!!errors.address} />{errors.address && <small className="od-err" role="alert">{errors.address}</small>}</label>
                  <label>Quartier<select value={collect.zone} onChange={(e) => setCollect({ ...collect, zone: e.target.value })}>{zones.map((z) => <option key={z}>{z}</option>)}</select></label>
                  <label>Jour<input type="date" min={minDate} value={collect.date} onChange={(e) => setCollect({ ...collect, date: e.target.value })} aria-invalid={!!errors.date} />{errors.date && <small className="od-err" role="alert">{errors.date}</small>}</label>
                  <fieldset className="full od-slots"><legend>Créneau</legend>
                    {slots.map((s) => <label key={s} className={collect.slot === s ? 'is-on' : undefined}><input type="radio" name="slot" checked={collect.slot === s} onChange={() => setCollect({ ...collect, slot: s })} />{s}</label>)}
                  </fieldset>
                  <label className="full">Instructions (facultatif)<textarea value={collect.notes} onChange={(e) => setCollect({ ...collect, notes: e.target.value })} placeholder="Un repère, une précision…" /></label>
                </div>
              </section>}

              {step === 4 && <section>
                <h1>Tout est en ordre ?</h1>
                <p className="od-sub">Vérifiez les informations avant de passer au paiement.</p>
                <div className="od-review">
                  <div className="od-card">
                    <div className="od-card__head"><h3>Collecte</h3><button type="button" onClick={() => setStep(3)}><Pencil size={14} aria-hidden /> Modifier</button></div>
                    <dl>
                      <div><dt>Adresse</dt><dd>{collect.address}, {collect.zone}</dd></div>
                      <div><dt>Jour</dt><dd>{dayLabel(collect.date)}</dd></div>
                      <div><dt>Créneau</dt><dd>{collect.slot}</dd></div>
                      {collect.notes && <div><dt>Instructions</dt><dd>{collect.notes}</dd></div>}
                    </dl>
                  </div>
                  <div className="od-card">
                    <div className="od-card__head"><h3>Articles</h3><button type="button" onClick={() => setStep(2)}><Pencil size={14} aria-hidden /> Modifier</button></div>
                    <ul>{service && <li><span>Service</span><b>{service.title}</b></li>}{selected.map(({ item, qty }) => <li key={item.id}><span>{qty} × {item.name}</span><b>{money(qty * item.price)}</b></li>)}
                      <li><span>Collecte et livraison</span><b>{money(LOGISTICS_FEE)}</b></li>
                      <li className="od-total"><span>Total estimé</span><b>{money(total)}</b></li></ul>
                  </div>
                  <p className="od-note"><Clock3 size={18} aria-hidden /> Collecte estimée sous 24 à 48 h après confirmation.</p>
                </div>
              </section>}

              {step === 5 && <section>
                <h1>Comment réglez-vous ?</h1>
                <p className="od-sub">Choisissez votre mode de règlement. Aucun paiement réel n’est déclenché.</p>
                <div className="od-pay">
                  {[['À la récupération', 'Vous payez à la remise de votre linge.'], ['À l’avance', 'Vous réglez maintenant, rien à sortir plus tard.']].map(([t, d]) =>
                    <motion.button type="button" key={t} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={pay}><span><b>Paiement {t.toLowerCase()}</b><small>{d}</small></span><ArrowRight size={20} aria-hidden /></motion.button>)}
                </div>
                <p className="od-total-line">Total estimé : <b>{money(total)}</b></p>
              </section>}

              {step === 6 && confirmed && <section className="od-done">
                <motion.span className="od-done__icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 13, delay: 0.1 }}><Check size={38} aria-hidden /></motion.span>
                <h1>Merci, votre linge est entre de bonnes mains.</h1>
                <p>Votre référence <b>{confirmed.id}</b> a bien été créée. Nous vous contacterons avant la collecte.</p>
                <div className="od-done__act">
                  <Link className="od-btn" href={`/suivi?ref=${confirmed.id}`}>Suivre ma commande <ArrowRight size={18} aria-hidden /></Link>
                  <Link className="od-link" href="/">Retour à l’accueil</Link>
                </div>
              </section>}

            </motion.div>
          </AnimatePresence>
        </div>
        {showAside && <aside className="od-aside">{Summary}</aside>}
      </div>
    </div>

    {step < 6 && step !== 5 && <div className="od-bar"><div className="od-wrap od-bar__in">
      <span className="od-bar__info">{cartCount ? <><b>{cartCount} article{cartCount > 1 ? 's' : ''}</b> · {money(subtotal)}</> : 'Votre sélection est vide'}</span>
      <div className="od-bar__act">
        {step > 1 && <button type="button" className="od-back" onClick={() => setStep(step - 1)}><ArrowLeft size={18} aria-hidden /> Retour</button>}
        {step > 1 && <button type="button" className="od-btn" disabled={disabled} onClick={next}>Continuer <ArrowRight size={18} aria-hidden /></button>}
      </div>
    </div></div>}
    {step === 5 && <div className="od-bar"><div className="od-wrap od-bar__in"><span /><button type="button" className="od-back" onClick={() => setStep(4)}><ArrowLeft size={18} aria-hidden /> Retour</button></div></div>}
  </main></MotionConfig>;
}
