'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, MotionConfig, useScroll, useSpring } from 'motion/react';
import { EASE, group, Reveal, rise, VIEW } from '@/components/motion';
import { ArrowRight, Check, Droplets, House, Plus, Shirt, Sparkles, type LucideIcon } from 'lucide-react';
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
  return <MotionConfig reducedMotion="user"><main className="hm">
    <Hero />
    <Services />
    <Process />
    <Prices />
    <Coverage />
    <Faq />
    <Closing />
    <StickyBar />
  </main></MotionConfig>;
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
      <motion.div className="hm-hero__copy" variants={group(0.12, 0.05)} initial="hidden" animate="show">
        <motion.h1 variants={rise}>Le pressing qui vient <span>chez vous.</span></motion.h1>
        <motion.p variants={rise}>Nous collectons votre linge à Abomey-Calavi, nous le lavons et le repassons, puis nous le rapportons sous 24 à 48&nbsp;h.</motion.p>
        <motion.ul className="hm-hero__facts" variants={rise}>
          <li><b>{money(LOGISTICS_FEE)}</b> collecte et livraison</li>
          <li><b>Dès {money(Math.min(...services.map((s) => s.price)))}</b> par article</li>
          <li><b>Suivi</b> en ligne</li>
        </motion.ul>
      </motion.div>

      <div className="hm-hero__art" aria-hidden="true">
        <svg viewBox="0 0 280 300" role="img" focusable="false">
          <motion.circle cx="140" cy="160" r="128" className="hm-art__disc" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: EASE }} style={{ transformOrigin: '140px 160px' }} />
          <motion.g className="hm-art__line" animate={{ rotate: [-2.5, 2.5, -2.5] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }} style={{ transformOrigin: '140px 40px' }}>
            {['M140 64 V52 C140 40 156 38 156 28 C156 18 142 14 136 22', 'M140 64 L104 86 M140 64 L176 86',
              'M104 86 L66 106 L44 150 L74 164 L92 136 V248 H188 V136 L206 164 L236 150 L214 106 L176 86 C166 102 114 102 104 86 Z',
              'M118 90 L140 114 L162 90'].map((d, i) =>
              <motion.path key={d} d={d} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.3 + i * 0.25 }} />)}
            <motion.path d="M140 114 V248" strokeDasharray="2 10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} />
          </motion.g>
          <g className="hm-art__dots">{[146, 182, 218].map((cy, i) =>
            <motion.circle key={cy} cx="140" cy={cy} r="4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 1.7 + i * 0.12 }} style={{ transformOrigin: `140px ${cy}px` }} />)}</g>
        </svg>
        <motion.div className="hm-art__badge" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: -8 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 1.2 }}><b>24–48 h</b><span>de traitement</span></motion.div>
      </div>
    </div>

    <motion.form className="hm-wrap hm-book" onSubmit={submit} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.5 }} aria-label="Planifier une collecte">
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
    </motion.form>
  </section>;
}

/* -------------------------------------------------------------- Services */

function Services() {
  return <section className="hm-section" id="prestations">
    <div className="hm-wrap">
      <Reveal as="header" className="hm-head">
        <h2>Chaque textile a son traitement</h2>
        <p>Quatre prestations, un prix affiché pour chacune. Aucun supplément caché : seuls s’ajoutent les {money(LOGISTICS_FEE)} de collecte et livraison.</p>
      </Reveal>
      <Reveal className="hm-bento" stagger={0.1}>
        {services.map((s, i) => {
          const Icon = serviceIcons[s.id];
          return <motion.article className={`hm-tile hm-tile--${i + 1}`} key={s.id} variants={rise} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
            <Icon size={34} strokeWidth={1.4} aria-hidden />
            <div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
            <div className="hm-tile__foot">
              <span>Dès <b>{money(s.price)}</b></span>
              <Link href={`/commander?service=${s.id}`} aria-label={`Choisir ${s.title}`}>Choisir <ArrowRight size={16} aria-hidden /></Link>
            </div>
          </motion.article>;
        })}
      </Reveal>
    </div>
  </section>;
}

/* --------------------------------------------------------------- Process */

function Process() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 70%', 'end 70%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return <section className="hm-section hm-section--sand" id="fonctionnement">
    <div className="hm-wrap hm-process">
      <Reveal as="header" className="hm-head">
        <h2>Du panier à la porte, en quatre temps</h2>
        <p>Vous n’avez rien à déposer ni à récupérer. Vous gardez la main sur l’horaire.</p>
        <Link className="hm-btn hm-btn--ink" href="/commander">Commencer une commande <ArrowRight size={18} aria-hidden /></Link>
      </Reveal>
      <ol className="hm-steps" ref={list}>
        <span className="hm-steps__rail" aria-hidden><motion.i style={{ scaleY: fill }} /></span>
        {steps.map(([title, text]) => <motion.li key={title} variants={rise} initial="hidden" whileInView="show" viewport={VIEW}><h3>{title}</h3><p>{text}</p></motion.li>)}
      </ol>
    </div>
  </section>;
}

/* ---------------------------------------------------------------- Prices */

function AddButton({ id, name }: { id: number; name: string }) {
  const { add } = useStore();
  const [done, setDone] = useState(false);
  useEffect(() => { if (!done) return; const t = setTimeout(() => setDone(false), 1200); return () => clearTimeout(t); }, [done]);
  return <motion.button type="button" className={done ? 'is-done' : undefined} whileTap={{ scale: 0.82 }} onClick={() => { add(id); setDone(true); }} aria-label={`Ajouter ${name} à la commande`}>
    {done ? <Check size={18} aria-hidden /> : <Plus size={18} aria-hidden />}
  </motion.button>;
}

function Prices() {
  return <section className="hm-section" id="tarifs">
    <div className="hm-wrap">
      <Reveal as="header" className="hm-head">
        <h2>Le tarif, article par article</h2>
        <p>Ajoutez directement à votre commande. Les prix sont indicatifs et confirmés avant la collecte.</p>
      </Reveal>
      <Reveal as="ul" className="hm-board" stagger={0.05}>
        {items.map((item) => <motion.li key={item.id} variants={rise}>
          <span className="hm-board__name">{item.name}<small>{item.category}</small></span>
          <span className="hm-board__dots" aria-hidden />
          <span className="hm-board__price">{money(item.price)}</span>
          <AddButton id={item.id} name={item.name} />
        </motion.li>)}
      </Reveal>
      <p className="hm-more"><Link href="/catalogue">Voir tout le catalogue <ArrowRight size={16} aria-hidden /></Link></p>
    </div>
  </section>;
}

/* -------------------------------------------------------------- Coverage */

function Coverage() {
  return <section className="hm-coverage">
    <div className="hm-wrap hm-coverage__grid">
      <Reveal>
        <h2>Nous couvrons Abomey-Calavi</h2>
        <p>Trois quartiers pour commencer. D’autres suivront : écrivez-nous si le vôtre manque.</p>
        <Reveal as="ul" className="hm-zones" stagger={0.1}>{zones.map((z) => <motion.li key={z} variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 18 } } }}>{z}</motion.li>)}</Reveal>
      </Reveal>
      <motion.dl className="hm-hours" variants={group(0.1)} initial="hidden" whileInView="show" viewport={VIEW}>
        <motion.div variants={rise}><dt>Équipe joignable</dt><dd>Lundi au samedi, 8 h à 18 h</dd></motion.div>
        <motion.div variants={rise}><dt>Créneau de collecte</dt><dd>Deux heures, que vous choisissez</dd></motion.div>
        <motion.div variants={rise}><dt>Paiement</dt><dd>À la récupération ou à l’avance</dd></motion.div>
        <motion.div variants={rise}><dt>Une question&nbsp;?</dt><dd><Link href="/contact">Écrivez-nous</Link></dd></motion.div>
      </motion.dl>
    </div>
  </section>;
}

/* -------------------------------------------------------------------- FAQ */

function Faq() {
  return <section className="hm-section" id="faq">
    <div className="hm-wrap hm-faq">
      <Reveal as="header" className="hm-head">
        <h2>Ce que l’on nous demande souvent</h2>
        <Link className="hm-textlink" href="/faq">Toutes les questions <ArrowRight size={16} aria-hidden /></Link>
      </Reveal>
      <Reveal className="hm-faq__list" stagger={0.08}>
        {faqs.slice(0, 4).map(([q, a]) => <motion.details key={q} variants={rise}><summary>{q}</summary><p>{a}</p></motion.details>)}
      </Reveal>
    </div>
  </section>;
}

/* --------------------------------------------------------------- Closing */

function Closing() {
  return <section className="hm-closing">
    <Reveal className="hm-wrap" stagger={0.15}>
      <motion.h2 variants={rise}>Votre prochaine lessive peut attendre.</motion.h2>
      <motion.div variants={rise}><Link className="hm-btn hm-btn--ink" href="/commander">Planifier une collecte <ArrowRight size={18} aria-hidden /></Link></motion.div>
    </Reveal>
  </section>;
}

function StickyBar() {
  return <div className="hm-sticky"><span><b>Collecte à domicile</b>Abomey-Calavi</span><Link className="hm-btn hm-btn--gold" href="/commander">Commander</Link></div>;
}
