'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Droplets, House, Plus, Shirt, Sparkles, type LucideIcon } from 'lucide-react';
import { faqs, items, LOGISTICS_FEE, money, services, slots, zones } from '@/lib/data';
import { useStore } from '@/lib/store';
import './home.css';

const serviceIcons: Record<string, LucideIcon> = { wash: Droplets, iron: Sparkles, dry: Shirt, home: House };

const steps = [
  ['Vous réservez', 'Adresse, jour et créneau de deux heures. Vous composez ensuite votre liste d’articles.'],
  ['Nous passons chez vous', 'Un coursier récupère le linge à votre porte, à l’heure choisie.'],
  ['Nous traitons', 'Lavage, repassage ou nettoyage à sec. Vous suivez l’avancement en ligne, pièce par pièce.'],
  ['Nous rapportons', 'Votre linge revient propre et plié, sous 24 à 48 h. Vous payez à la récupération ou à l’avance.'],
];

export default function Home() {
  return <main className="hm">
    <Hero />
    <Services />
    <Process />
    <Prices />
    <Coverage />
    <Faq />
    <Closing />
    <StickyBar />
  </main>;
}

/* ------------------------------------------------------------------ Hero */

function Hero() {
  const router = useRouter();
  const { collect, setCollect } = useStore();
  const [zone, setZone] = useState<string>(collect.zone);
  const [date, setDate] = useState(collect.date);
  const [slot, setSlot] = useState<string>(collect.slot);
  const [minDate, setMinDate] = useState<string | undefined>();

  useEffect(() => {
    const d = new Date();
    setMinDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10));
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setCollect({ ...collect, zone, date, slot });
    router.push('/commander');
  };

  return <section className="hm-hero">
    <div className="hm-wrap hm-hero__grid">
      <div className="hm-hero__copy">
        <h1>Le pressing qui vient <span>chez vous.</span></h1>
        <p>Nous collectons votre linge à Abomey-Calavi, nous le lavons et le repassons, puis nous le rapportons sous 24 à 48&nbsp;h.</p>
        <ul className="hm-hero__facts">
          <li><b>{money(LOGISTICS_FEE)}</b> collecte et livraison</li>
          <li><b>Dès {money(Math.min(...services.map((s) => s.price)))}</b> par article</li>
          <li><b>Suivi</b> en ligne</li>
        </ul>
      </div>

      <div className="hm-hero__art" aria-hidden="true">
        <svg viewBox="0 0 280 300" role="img" focusable="false">
          <circle cx="140" cy="160" r="128" className="hm-art__disc" />
          <g className="hm-art__line">
            <path d="M140 64 V52 C140 40 156 38 156 28 C156 18 142 14 136 22" />
            <path d="M140 64 L104 86 M140 64 L176 86" />
            <path d="M104 86 L66 106 L44 150 L74 164 L92 136 V248 H188 V136 L206 164 L236 150 L214 106 L176 86 C166 102 114 102 104 86 Z" />
            <path d="M118 90 L140 114 L162 90" />
            <path d="M140 114 V248" strokeDasharray="2 10" />
          </g>
          <g className="hm-art__dots"><circle cx="140" cy="146" r="4" /><circle cx="140" cy="182" r="4" /><circle cx="140" cy="218" r="4" /></g>
        </svg>
        <div className="hm-art__badge"><b>24–48 h</b><span>de traitement</span></div>
      </div>
    </div>

    <form className="hm-wrap hm-book" onSubmit={submit} aria-label="Planifier une collecte">
      <div className="hm-book__title"><b>Planifier une collecte</b><span>Gratuit, sans engagement</span></div>
      <label>Quartier
        <select value={zone} onChange={(e) => setZone(e.target.value)}>{zones.map((z) => <option key={z}>{z}</option>)}</select>
      </label>
      <label>Jour
        <input type="date" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>Créneau
        <select value={slot} onChange={(e) => setSlot(e.target.value)}>{slots.map((s) => <option key={s}>{s}</option>)}</select>
      </label>
      <button className="hm-btn hm-btn--gold" type="submit">Continuer <ArrowRight size={18} aria-hidden /></button>
    </form>
  </section>;
}

/* -------------------------------------------------------------- Services */

function Services() {
  return <section className="hm-section" id="prestations">
    <div className="hm-wrap">
      <header className="hm-head">
        <h2>Chaque textile a son traitement</h2>
        <p>Quatre prestations, un prix affiché pour chacune. Aucun supplément caché : seuls s’ajoutent les {money(LOGISTICS_FEE)} de collecte et livraison.</p>
      </header>
      <div className="hm-bento">
        {services.map((s, i) => {
          const Icon = serviceIcons[s.id];
          return <article className={`hm-tile hm-tile--${i + 1}`} key={s.id}>
            <Icon size={34} strokeWidth={1.4} aria-hidden />
            <div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
            <div className="hm-tile__foot">
              <span>Dès <b>{money(s.price)}</b></span>
              <Link href={`/commander?service=${s.id}`} aria-label={`Choisir ${s.title}`}>Choisir <ArrowRight size={16} aria-hidden /></Link>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}

/* --------------------------------------------------------------- Process */

function Process() {
  return <section className="hm-section hm-section--sand" id="fonctionnement">
    <div className="hm-wrap hm-process">
      <header className="hm-head">
        <h2>Du panier à la porte, en quatre temps</h2>
        <p>Vous n’avez rien à déposer ni à récupérer. Vous gardez la main sur l’horaire.</p>
        <Link className="hm-btn hm-btn--ink" href="/commander">Commencer une commande <ArrowRight size={18} aria-hidden /></Link>
      </header>
      <ol className="hm-steps">
        {steps.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}
      </ol>
    </div>
  </section>;
}

/* ---------------------------------------------------------------- Prices */

function Prices() {
  const { add } = useStore();
  return <section className="hm-section" id="tarifs">
    <div className="hm-wrap">
      <header className="hm-head">
        <h2>Le tarif, article par article</h2>
        <p>Ajoutez directement à votre commande. Les prix sont indicatifs et confirmés avant la collecte.</p>
      </header>
      <ul className="hm-board">
        {items.map((item) => <li key={item.id}>
          <span className="hm-board__name">{item.name}<small>{item.category}</small></span>
          <span className="hm-board__dots" aria-hidden />
          <span className="hm-board__price">{money(item.price)}</span>
          <button type="button" onClick={() => add(item.id)} aria-label={`Ajouter ${item.name} à la commande`}><Plus size={18} aria-hidden /></button>
        </li>)}
      </ul>
      <p className="hm-more"><Link href="/catalogue">Voir tout le catalogue <ArrowRight size={16} aria-hidden /></Link></p>
    </div>
  </section>;
}

/* -------------------------------------------------------------- Coverage */

function Coverage() {
  return <section className="hm-coverage">
    <div className="hm-wrap hm-coverage__grid">
      <div>
        <h2>Nous couvrons Abomey-Calavi</h2>
        <p>Trois quartiers pour commencer. D’autres suivront : écrivez-nous si le vôtre manque.</p>
        <ul className="hm-zones">{zones.map((z) => <li key={z}>{z}</li>)}</ul>
      </div>
      <dl className="hm-hours">
        <div><dt>Équipe joignable</dt><dd>Lundi au samedi, 8 h à 18 h</dd></div>
        <div><dt>Créneau de collecte</dt><dd>Deux heures, que vous choisissez</dd></div>
        <div><dt>Paiement</dt><dd>À la récupération ou à l’avance</dd></div>
        <div><dt>Une question&nbsp;?</dt><dd><Link href="/contact">Écrivez-nous</Link></dd></div>
      </dl>
    </div>
  </section>;
}

/* -------------------------------------------------------------------- FAQ */

function Faq() {
  return <section className="hm-section" id="faq">
    <div className="hm-wrap hm-faq">
      <header className="hm-head">
        <h2>Ce que l’on nous demande souvent</h2>
        <Link className="hm-textlink" href="/faq">Toutes les questions <ArrowRight size={16} aria-hidden /></Link>
      </header>
      <div className="hm-faq__list">
        {faqs.slice(0, 4).map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </div>
    </div>
  </section>;
}

/* --------------------------------------------------------------- Closing */

function Closing() {
  return <section className="hm-closing">
    <div className="hm-wrap">
      <h2>Votre prochaine lessive peut attendre.</h2>
      <Link className="hm-btn hm-btn--ink" href="/commander">Planifier une collecte <ArrowRight size={18} aria-hidden /></Link>
    </div>
  </section>;
}

function StickyBar() {
  return <div className="hm-sticky"><span><b>Collecte à domicile</b>Abomey-Calavi</span><Link className="hm-btn hm-btn--gold" href="/commander">Commander</Link></div>;
}
