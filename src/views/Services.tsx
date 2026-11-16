'use client';

import Link from 'next/link';
import { motion, MotionConfig } from 'motion/react';
import { ArrowRight, Check, Clock, Droplets, House, Minus, Shirt, Sparkles, type LucideIcon } from 'lucide-react';
import Photo from '@/components/Photo';
import { EASE, group, Reveal, rise } from '@/components/motion';
import { LOGISTICS_FEE, money, services } from '@/lib/data';
import './services.css';

const icons: Record<string, LucideIcon> = { wash: Droplets, iron: Sparkles, dry: Shirt, home: House };

type Detail = { included: string[]; ideal: string; delay: string };
const details: Record<string, Detail> = {
  wash: { included: ['Lavage adapté à la matière', 'Séchage doux', 'Pliage soigné'], ideal: 'T-shirts, sous-vêtements, vêtements de tous les jours', delay: '24 à 48 h' },
  iron: { included: ['Lavage adapté à la matière', 'Repassage soigné', 'Remis sur cintre ou plié'], ideal: 'Chemises, pantalons, robes, tenues de travail', delay: '24 à 48 h' },
  dry: { included: ['Détachage ciblé', 'Nettoyage sans eau', 'Finition pressing'], ideal: 'Vestes, costumes, robes et tissus délicats', delay: '24 à 48 h' },
  home: { included: ['Lavage en grande capacité', 'Séchage soigné', 'Pliage net'], ideal: 'Draps, serviettes, nappes, linge de lit', delay: '24 à 48 h' },
};

/** Ce que comprend chaque prestation, pour le tableau comparatif. */
const matrix: Array<[string, boolean, boolean, boolean, boolean]> = [
  // id, lavage, séchage, repassage, sans eau
  ['wash', true, true, false, false],
  ['iron', true, true, true, false],
  ['dry', false, false, true, true],
  ['home', true, true, false, false],
];
const cols = ['Lavage', 'Séchage', 'Repassage', 'Nettoyage sans eau'];

export default function Services() {
  return <MotionConfig reducedMotion="user"><main className="sv">
    <section className="sv-hero">
      <motion.div className="sv-wrap" variants={group(0.1, 0.05)} initial="hidden" animate="show">
        <motion.h1 variants={rise}>Un soin juste pour chaque textile.</motion.h1>
        <motion.p variants={rise}>Quatre prestations, un prix affiché pour chacune, et la collecte chez vous. Choisissez celle qui correspond à votre linge.</motion.p>
        <motion.nav variants={rise} className="sv-chips" aria-label="Aller à une prestation">
          {services.map((s) => { const Icon = icons[s.id]; return <a key={s.id} href={`#${s.id}`}><Icon size={18} aria-hidden />{s.title}</a>; })}
        </motion.nav>
      </motion.div>
    </section>

    <section className="sv-list">
      {services.map((s, i) => {
        const Icon = icons[s.id];
        const d = details[s.id];
        return <Reveal as="section" id={s.id} className={`sv-row sv-row--${s.id}${i % 2 ? ' is-flip' : ''}`} key={s.id}>
          <div className="sv-wrap sv-row__grid">
            <motion.div className="sv-visual" whileHover="hover">
              <motion.div className="sv-visual__img" variants={{ hover: { scale: 1.05 } }} transition={{ duration: 0.6, ease: EASE }}>
                <Photo src={s.image} alt={s.title} width={900} height={820} />
              </motion.div>
              <span className="sv-visual__tag"><Icon size={18} aria-hidden />{s.title}</span>
              <span className="sv-visual__price"><small>Dès</small>{money(s.price)}</span>
            </motion.div>
            <div className="sv-copy">
              <h2>{s.title}</h2>
              <p className="sv-lead">{s.desc}</p>
              <dl className="sv-facts">
                <div><dt>Inclus</dt><dd><ul>{d.included.map((x) => <li key={x}><Check size={16} aria-hidden />{x}</li>)}</ul></dd></div>
                <div><dt>Idéal pour</dt><dd>{d.ideal}</dd></div>
                <div><dt>Délai</dt><dd><Clock size={16} aria-hidden /> {d.delay}</dd></div>
              </dl>
              <Link className="sv-btn" href={`/commander?service=${s.id}`}>Choisir {s.title.toLowerCase()} <ArrowRight size={18} aria-hidden /></Link>
            </div>
          </div>
        </Reveal>;
      })}
    </section>

    <section className="sv-compare">
      <div className="sv-wrap">
        <Reveal as="header" className="sv-head">
          <h2>Laquelle choisir ?</h2>
          <p>Le même repère en un coup d’œil. Dans le doute, le lavage et repassage convient à la plupart des vêtements.</p>
        </Reveal>
        <Reveal className="sv-table-wrap">
          <table className="sv-table">
            <thead><tr><th scope="col">Prestation</th>{cols.map((c) => <th scope="col" key={c}>{c}</th>)}<th scope="col">Dès</th></tr></thead>
            <tbody>
              {matrix.map(([id, ...flags]) => {
                const s = services.find((x) => x.id === id)!;
                return <tr key={id}>
                  <th scope="row"><Link href={`#${id}`}>{s.title}</Link></th>
                  {flags.map((on, i) => <td key={cols[i]}>{on ? <Check size={18} aria-label="Oui" /> : <Minus size={18} aria-label="Non" className="is-off" />}</td>)}
                  <td className="sv-table__price">{money(s.price)}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </Reveal>
        <p className="sv-note">À chaque commande s’ajoutent {money(LOGISTICS_FEE)} de collecte et livraison. Les prix sont indicatifs et confirmés avant la collecte.</p>
      </div>
    </section>

    <section className="sv-closing">
      <Reveal className="sv-wrap sv-closing__in" stagger={0.15}>
        <motion.h2 variants={rise}>Prêt à ne plus y penser&nbsp;?</motion.h2>
        <motion.div variants={rise}><Link className="sv-btn sv-btn--ink" href="/commander">Planifier une collecte <ArrowRight size={18} aria-hidden /></Link></motion.div>
      </Reveal>
    </section>
  </main></MotionConfig>;
}
