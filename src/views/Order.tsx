'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Check, ChevronUp, Clock3, Copy, Droplets, House, Loader2, Minus, Pencil, Plus, Shirt, Sparkles, X, type LucideIcon } from 'lucide-react';
import Logo from '@/components/Logo';
import Photo from '@/components/Photo';
import { EASE } from '@/components/motion';
import { items, LOGISTICS_FEE, money, services, slots, zones } from '@/lib/data';
import { useStore } from '@/lib/store';
import './order.css';

const STEPS = ['Votre linge', 'Collecte', 'Confirmation'] as const;
const serviceIcons: Record<string, LucideIcon> = { wash: Droplets, iron: Sparkles, dry: Shirt, home: House };
const payments = [
  { id: 'recuperation', title: 'Payer à la récupération', text: 'Vous réglez à la remise de votre linge.' },
  { id: 'avance', title: 'Payer à l’avance', text: 'Vous réglez maintenant, rien à prévoir à la livraison.' },
] as const;

type Field = 'name' | 'phone' | 'address' | 'date';
type Errors = Partial<Record<Field, string>>;

const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const parse = (s: string) => new Date(`${s}T00:00`);
const longDay = (s: string) => s ? parse(s).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '';
const phoneDigits = (v: string) => v.replace(/[\s.\-()]/g, '').replace(/^\+?229/, '');

const collectSchema = z.object({
  name: z.string().trim().min(2, 'Indiquez votre nom.'),
  phone: z.string().refine((v) => /^\d{8,10}$/.test(phoneDigits(v)), 'Entrez un numéro valide, par exemple 01 90 00 00 00.'),
  address: z.string().trim().min(5, 'Indiquez une adresse de collecte.'),
  date: z.string().refine((d) => d !== '', 'Choisissez un jour de collecte.')
    .refine((d) => d === '' || parse(d) >= parse(iso(new Date())), 'Choisissez un jour à partir d’aujourd’hui.')
    .refine((d) => d === '' || parse(d).getDay() !== 0, 'Nous ne collectons pas le dimanche.'),
});

/** Un créneau du jour n'est proposé que s'il commence au moins 2 h plus tard. */
const slotOpen = (date: string, slot: string, now: Date) => {
  if (date !== iso(now)) return true;
  const [h, m] = slot.split(':').map((x) => parseInt(x, 10));
  return h * 60 + m >= now.getHours() * 60 + now.getMinutes() + 120;
};

export default function Order() {
  const store = useStore();
  const { cart, setQty, serviceId, setServiceId, collect, setCollect, subtotal, total, cartCount, placeOrder, hydrated, notify } = store;
  const params = useSearchParams();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [now, setNow] = useState<Date | null>(null);
  const [payment, setPayment] = useState<(typeof payments)[number]['id']>('recuperation');
  const [submitting, setSubmitting] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [done, setDone] = useState<{ id: string; total: number; pickup: string; address: string; lines: Array<[string, number]>; payment: string; count: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mounted = useRef(false);

  useEffect(() => { setNow(new Date()); return () => clearTimeout(timer.current); }, []);

  // Arrivée depuis « Choisir » sur une prestation : présélection.
  const preselect = params.get('service');
  useEffect(() => {
    if (hydrated && preselect && services.some((s) => s.id === preselect)) setServiceId(preselect);
  }, [hydrated, preselect, setServiceId]);

  // Un brouillon ancien ne doit pas garder un jour déjà passé.
  useEffect(() => {
    if (hydrated && now && collect.date && collect.date < iso(now)) setCollect({ ...collect, date: '' });
  }, [hydrated, now, collect, setCollect]);

  /* Historique : le bouton « retour » du navigateur revient à l'étape précédente. */
  const go = useCallback((n: number, push = true) => {
    setStep(n);
    setSheet(false);
    if (push) window.history.pushState({ plieStep: n }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  useEffect(() => {
    window.history.replaceState({ ...(window.history.state ?? {}), plieStep: 1 }, '');
    const onPop = (e: PopStateEvent) => { const n = e.state?.plieStep; setStep(typeof n === 'number' ? n : 1); setSheet(false); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => { if (!sheet) return; const k = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [sheet]);

  const category = serviceId === 'home' ? 'Linge de maison' : serviceId ? 'Vêtements' : null;
  const visibleItems = useMemo(() => items.filter((i) => !category || i.category === category), [category]);
  const lines = Object.entries(cart).flatMap(([id, qty]) => {
    const item = items.find((i) => i.id === Number(id));
    return item ? [{ item, qty }] : [];
  });
  const service = services.find((s) => s.id === serviceId);

  const chooseService = (id: string) => {
    const cat = id === 'home' ? 'Linge de maison' : 'Vêtements';
    for (const { item, qty } of lines) if (item.category !== cat) setQty(item.id, -qty); // pas d'article hors catégorie
    setServiceId(id);
  };

  const days = useMemo(() => {
    if (!now) return [];
    const out: string[] = [];
    for (let i = 0; out.length < 6 && i < 14; i++) {
      const d = new Date(now); d.setDate(d.getDate() + i);
      if (d.getDay() !== 0 && slots.some((s) => slotOpen(iso(d), s, now))) out.push(iso(d));
    }
    return out;
  }, [now]);

  const pickDate = (date: string) => {
    const ok = now ? slots.find((s) => slotOpen(date, s, now)) : undefined;
    const slot = now && !slotOpen(date, collect.slot, now) && ok ? ok : collect.slot;
    setCollect({ ...collect, date, slot });
    setErrors((e) => ({ ...e, date: undefined }));
  };
  const setField = (key: 'name' | 'phone' | 'address', value: string) => {
    setCollect({ ...collect, [key]: value });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const missing = step === 1 ? (!serviceId ? 'Choisissez un soin pour continuer.' : lines.length === 0 ? 'Ajoutez au moins un article.' : '') : '';

  const next = () => {
    if (step === 1) { if (!missing) go(2); return; }
    if (step === 2) {
      const r = collectSchema.safeParse(collect);
      if (!r.success) {
        const f = r.error.flatten().fieldErrors;
        const e: Errors = { name: f.name?.[0], phone: f.phone?.[0], address: f.address?.[0], date: f.date?.[0] };
        setErrors(e);
        const first = (['name', 'phone', 'address', 'date'] as Field[]).find((k) => e[k]);
        if (first) document.getElementById(`od-${first}`)?.focus();
        return;
      }
      setErrors({});
      go(3);
    }
  };

  const confirm = () => {
    if (submitting) return;
    setSubmitting(true);
    timer.current = setTimeout(() => {
      const snapshot = { total, pickup: `${longDay(collect.date)} · ${collect.slot}`, address: `${collect.address}, ${collect.zone}`, lines: lines.map(({ item, qty }): [string, number] => [`${qty} × ${item.name}`, qty * item.price]), payment: payments.find((p) => p.id === payment)!.title, count: cartCount };
      const order = placeOrder();
      setDone({ id: order.id, ...snapshot });
      setSubmitting(false);
      go(4);
    }, 900);
  };

  const copyRef = async () => {
    if (!done) return;
    try { await navigator.clipboard.writeText(done.id); notify('Référence copiée'); } catch { notify(`Référence : ${done.id}`); }
  };

  const title = useRef<HTMLHeadingElement>(null);
  const focusTitle = () => { if (mounted.current) title.current?.focus({ preventScroll: true }); mounted.current = true; };

  const Summary = <div className="od-sum">
    <h2>Votre commande</h2>
    {service && <p className="od-sum__svc">{service.title}</p>}
    {lines.length === 0
      ? <p className="od-sum__empty">Aucun article pour l’instant.</p>
      : <ul>{lines.map(({ item, qty }) => <li key={item.id}><span>{qty} × {item.name}</span><b>{money(qty * item.price)}</b></li>)}</ul>}
    {collect.date && step >= 2 && <p className="od-sum__when"><Clock3 size={16} aria-hidden /> {longDay(collect.date)}<br />{collect.slot}</p>}
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
      {step < 4 && <nav aria-label="Étapes de la commande">
        <ol className="od-steps">
          {STEPS.map((n, i) => <li key={n} className={step === i + 1 ? 'is-now' : step > i + 1 ? 'is-done' : undefined}>
            <button type="button" disabled={i + 1 >= step} onClick={() => go(i + 1)} aria-current={step === i + 1 ? 'step' : undefined}>
              <span>{step > i + 1 ? <Check size={15} aria-hidden /> : i + 1}</span><em>{n}</em>
            </button>
          </li>)}
        </ol>
        <div className="od-progress" aria-hidden><motion.i animate={{ scaleX: step / STEPS.length }} initial={false} transition={{ duration: 0.5, ease: EASE }} /></div>
      </nav>}

      <div className={`od-grid${step < 4 ? ' has-aside' : ''}`}>
        <div className="od-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28, ease: EASE }} onAnimationComplete={focusTitle}>

              {step === 1 && <section aria-labelledby="od-title">
                <h1 id="od-title" ref={title} tabIndex={-1}>Que doit-on traiter ?</h1>
                <p className="od-sub">Choisissez un soin, puis ajoutez vos articles. Les prix sont indicatifs.</p>

                <div className="od-svcs" role="radiogroup" aria-labelledby="od-svcs-l"><p id="od-svcs-l" className="od-label">Le soin</p>
                  {services.map((s) => { const Icon = serviceIcons[s.id]; const on = serviceId === s.id; return <label key={s.id} className={on ? 'is-on' : undefined}>
                    <input type="radio" name="service" checked={on} onChange={() => chooseService(s.id)} />
                    <Icon size={26} strokeWidth={1.5} aria-hidden />
                    <b>{s.title}</b><small>Dès {money(s.price)}</small>
                    {on && <motion.span layoutId="od-svc-check" className="od-svcs__tick"><Check size={14} aria-hidden /></motion.span>}
                  </label>; })}
                </div>

                <h2 className="od-h2">Les articles</h2>
                <ul className="od-items">
                  {visibleItems.map((item) => { const q = cart[item.id] ?? 0; return <li key={item.id} className={q ? 'is-in' : undefined}>
                    <div className="od-items__img"><Photo src={item.image} alt="" width={120} height={120} /></div>
                    <div className="od-items__txt"><b>{item.name}</b><span>{money(item.price)}</span></div>
                    <div className="od-qty" role="group" aria-label={`Quantité de ${item.name}`}>
                      <button type="button" aria-label={`Retirer un ${item.name}`} disabled={!q} onClick={() => setQty(item.id, -1)}><Minus size={18} aria-hidden /></button>
                      <output aria-live="polite">{q}</output>
                      <button type="button" aria-label={`Ajouter un ${item.name}`} onClick={() => setQty(item.id, 1)}><Plus size={18} aria-hidden /></button>
                    </div>
                  </li>; })}
                </ul>
              </section>}

              {step === 2 && <section aria-labelledby="od-title">
                <h1 id="od-title" ref={title} tabIndex={-1}>Où et quand passer ?</h1>
                <p className="od-sub">Nous intervenons à Abomey-Calavi, du lundi au samedi.</p>

                <div className="od-form">
                  <label>Votre nom
                    <input id="od-name" value={collect.name} onChange={(e) => setField('name', e.target.value)} autoComplete="name" placeholder="Prénom et nom" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'od-name-e' : undefined} />
                    {errors.name && <small id="od-name-e" className="od-err" role="alert">{errors.name}</small>}
                  </label>
                  <label>Téléphone (WhatsApp si possible)
                    <span className="od-phone"><i>+229</i><input id="od-phone" value={collect.phone} onChange={(e) => setField('phone', e.target.value)} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="01 90 00 00 00" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'od-phone-e' : undefined} /></span>
                    {errors.phone && <small id="od-phone-e" className="od-err" role="alert">{errors.phone}</small>}
                  </label>
                  <label className="full">Adresse de collecte
                    <input id="od-address" value={collect.address} onChange={(e) => setField('address', e.target.value)} autoComplete="street-address" placeholder="Ex. Rue 125, maison bleue près de la pharmacie" aria-invalid={!!errors.address} aria-describedby={errors.address ? 'od-address-e' : undefined} />
                    {errors.address && <small id="od-address-e" className="od-err" role="alert">{errors.address}</small>}
                  </label>
                  <label className="full">Quartier
                    <select value={collect.zone} onChange={(e) => setCollect({ ...collect, zone: e.target.value })}>{zones.map((z) => <option key={z}>{z}</option>)}</select>
                  </label>

                  <fieldset className="full od-days"><legend>Jour de collecte</legend>
                    <div className="od-chips">
                      {days.length === 0 && <span className="od-skel" aria-hidden />}
                      {now && days.map((d) => { const dt = parse(d); const rel = d === iso(now) ? 'Auj.' : d === iso(new Date(now.getTime() + 86400000)) ? 'Demain' : dt.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''); return <label key={d} className={collect.date === d ? 'is-on' : undefined}>
                        <input type="radio" name="day" id={d === days[0] ? 'od-date' : undefined} checked={collect.date === d} onChange={() => pickDate(d)} aria-invalid={!!errors.date} />
                        <small>{rel}</small><b>{dt.getDate()}</b><small>{dt.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}</small>
                      </label>; })}
                    </div>
                    <label className="od-other">Ou une autre date
                      <input type="date" min={now ? iso(now) : undefined} value={collect.date} onChange={(e) => pickDate(e.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'od-date-e' : undefined} />
                    </label>
                    {errors.date && <small id="od-date-e" className="od-err" role="alert">{errors.date}</small>}
                  </fieldset>

                  <fieldset className="full od-slots"><legend>Créneau de deux heures</legend>
                    {slots.map((s) => { const open = !now || slotOpen(collect.date, s, now); return <label key={s} className={`${collect.slot === s ? 'is-on' : ''}${open ? '' : ' is-off'}`}>
                      <input type="radio" name="slot" disabled={!open} checked={collect.slot === s} onChange={() => setCollect({ ...collect, slot: s })} />{s}
                    </label>; })}
                  </fieldset>

                  <label className="full">Instructions (facultatif)
                    <textarea value={collect.notes} onChange={(e) => setCollect({ ...collect, notes: e.target.value })} placeholder="Un repère, un code, une précision pour le coursier…" />
                  </label>
                </div>
              </section>}

              {step === 3 && <section aria-labelledby="od-title">
                <h1 id="od-title" ref={title} tabIndex={-1}>Tout est en ordre ?</h1>
                <p className="od-sub">Vérifiez, choisissez votre règlement, puis confirmez.</p>
                <div className="od-review">
                  <div className="od-card">
                    <div className="od-card__head"><h2>Collecte</h2><button type="button" onClick={() => go(2)}><Pencil size={14} aria-hidden /> Modifier</button></div>
                    <dl>
                      <div><dt>Contact</dt><dd>{collect.name} · +229 {collect.phone}</dd></div>
                      <div><dt>Adresse</dt><dd>{collect.address}, {collect.zone}</dd></div>
                      <div><dt>Passage</dt><dd>{longDay(collect.date)}, {collect.slot}</dd></div>
                      {collect.notes && <div><dt>Instructions</dt><dd>{collect.notes}</dd></div>}
                    </dl>
                  </div>
                  <div className="od-card">
                    <div className="od-card__head"><h2>Articles</h2><button type="button" onClick={() => go(1)}><Pencil size={14} aria-hidden /> Modifier</button></div>
                    <ul>
                      {service && <li><span>Soin</span><b>{service.title}</b></li>}
                      {lines.map(({ item, qty }) => <li key={item.id}><span>{qty} × {item.name}</span><b>{money(qty * item.price)}</b></li>)}
                      <li><span>Collecte et livraison</span><b>{money(LOGISTICS_FEE)}</b></li>
                      <li className="od-total"><span>Total estimé</span><b>{money(total)}</b></li>
                    </ul>
                  </div>
                  <fieldset className="od-pay"><legend>Règlement</legend>
                    {payments.map((p) => <label key={p.id} className={payment === p.id ? 'is-on' : undefined}>
                      <input type="radio" name="pay" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                      <i aria-hidden />
                      <span><b>{p.title}</b><small>{p.text}</small></span>
                    </label>)}
                  </fieldset>
                  <p className="od-note"><Clock3 size={18} aria-hidden /> Traitement en 24 à 48 h après la collecte. Démonstration : aucun paiement réel n’est déclenché.</p>
                </div>
              </section>}

              {step === 4 && done && <section className="od-done" aria-labelledby="od-title">
                <motion.span className="od-done__icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 13, delay: 0.1 }}><Check size={40} aria-hidden /></motion.span>
                <h1 id="od-title" ref={title} tabIndex={-1}>Commande confirmée.</h1>
                <p>Merci, votre linge est entre de bonnes mains. Gardez votre référence pour suivre la commande.</p>
                <button type="button" className="od-ref" onClick={copyRef} aria-label={`Copier la référence ${done.id}`}><span>Référence</span><b>{done.id}</b><Copy size={16} aria-hidden /></button>

                <div className="od-card od-recap">
                  <dl>
                    <div><dt>Passage</dt><dd>{done.pickup}</dd></div>
                    <div><dt>Adresse</dt><dd>{done.address}</dd></div>
                    <div><dt>Articles</dt><dd>{done.count} pièce{done.count > 1 ? 's' : ''}</dd></div>
                    <div><dt>Règlement</dt><dd>{done.payment}</dd></div>
                    <div><dt>Total estimé</dt><dd><b>{money(done.total)}</b></dd></div>
                  </dl>
                </div>

                <ol className="od-next">
                  <li><b>Nous confirmons le créneau</b><span>avant le passage, par téléphone ou WhatsApp.</span></li>
                  <li><b>Le coursier passe</b><span>à l’heure choisie, pour récupérer votre linge.</span></li>
                  <li><b>Retour sous 24 à 48 h</b><span>propre et plié, à votre porte.</span></li>
                </ol>

                <div className="od-done__act">
                  <Link className="od-btn" href={`/suivi?ref=${done.id}`}>Suivre ma commande <ArrowRight size={18} aria-hidden /></Link>
                  <Link className="od-link" href="/">Retour à l’accueil</Link>
                </div>
              </section>}

            </motion.div>
          </AnimatePresence>
        </div>
        {step < 4 && <aside className="od-aside" aria-label="Récapitulatif">{Summary}</aside>}
      </div>
    </div>

    {step < 4 && <div className="od-bar" data-step={step}><div className="od-wrap od-bar__in">
      <button type="button" className="od-bar__info" onClick={() => setSheet(true)} aria-haspopup="dialog">
        <span>{cartCount ? <><span className="od-bar__n"><b>{cartCount} article{cartCount > 1 ? 's' : ''}</b> · </span><b className="od-bar__t">{money(total)}</b></> : 'Panier vide'}</span>
        <ChevronUp size={16} aria-hidden />
      </button>
      {missing && <p className="od-bar__hint" role="status">{missing}</p>}
      <div className="od-bar__act">
        {step > 1 && <button type="button" className="od-back" onClick={() => go(step - 1)} aria-label="Retour"><ArrowLeft size={18} aria-hidden /><span>Retour</span></button>}
        {step < 3
          ? <button type="button" className="od-btn" disabled={!!missing} onClick={next}>Continuer <ArrowRight size={18} aria-hidden /></button>
          : <button type="button" className="od-btn od-btn--gold" disabled={submitting} onClick={confirm}>{submitting ? <><Loader2 className="od-spin" size={18} aria-hidden /> Confirmation…</> : <>Confirmer · {money(total)}</>}</button>}
      </div>
    </div></div>}

    <AnimatePresence>
      {sheet && <>
        <motion.div className="od-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
        <motion.div className="od-sheet" role="dialog" aria-modal="true" aria-label="Récapitulatif de la commande" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.35, ease: EASE }}>
          <button type="button" className="od-sheet__close" onClick={() => setSheet(false)} aria-label="Fermer"><X size={20} aria-hidden /></button>
          {Summary}
        </motion.div>
      </>}
    </AnimatePresence>
  </main></MotionConfig>;
}
