'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ArrowRight, Check, Clock3, Eye, HandHeart, Mail, MapPin, Minus, Phone, Plus, Sparkles, Truck, Waves } from 'lucide-react';
import Photo from '@/components/Photo';
import { EASE, group, Reveal, rise } from '@/components/motion';
import { faqs, images } from '@/lib/data';
import { useStore } from '@/lib/store';
import './inner.css';

function Hero({ title, lead, children }: { title: string; lead?: string; children?: React.ReactNode }) {
  return <section className="in-hero">
    <motion.div className="in-wrap" variants={group(0.1, 0.05)} initial="hidden" animate="show">
      <motion.h1 variants={rise}>{title}</motion.h1>
      {lead && <motion.p variants={rise}>{lead}</motion.p>}
      {children && <motion.div variants={rise}>{children}</motion.div>}
    </motion.div>
  </section>;
}

/* ---------------------------------------------------------------- À propos */

const values = [
  { icon: HandHeart, title: 'Attention', text: 'Chaque article est traité avec le respect qu’il mérite.' },
  { icon: Eye, title: 'Clarté', text: 'Des prix lisibles et un suivi sans jargon.' },
  { icon: MapPin, title: 'Proximité', text: 'Un service local, pensé pour le quotidien à Abomey-Calavi.' },
];
const how = [
  { icon: Clock3, title: 'Vous réservez', text: 'Un jour, un créneau de deux heures.' },
  { icon: Truck, title: 'Nous collectons', text: 'Un coursier passe chez vous.' },
  { icon: Waves, title: 'Nous traitons', text: 'Lavage, repassage, nettoyage à sec.' },
  { icon: Sparkles, title: 'Nous rapportons', text: 'Propre et plié, sous 24 à 48 h.' },
];

export function About() {
  return <MotionConfig reducedMotion="user"><main className="in">
    <Hero title="Le soin, en toute simplicité." lead="Plié rend le pressing aussi simple qu’une livraison de repas : vous réservez, nous passons, votre linge revient impeccable." />

    <section className="in-section"><div className="in-wrap ab-story">
      <Reveal className="ab-photo"><Photo src={images.fold} alt="Pliage soigneux d’un vêtement" width={1000} height={850} priority /></Reveal>
      <Reveal className="ab-text">
        <h2>Pourquoi Plié</h2>
        <p>Faire laver et repasser son linge ne devrait pas demander de traverser la ville ni d’attendre un comptoir.</p>
        <p>Nous coordonnons chaque étape, de la collecte à la livraison, pour que vos vêtements reviennent propres et pliés sans que vous ayez à courir. Le prix est affiché avant la collecte et le suivi se fait en ligne.</p>
        <Link className="in-link" href="/prestations">Voir nos prestations <ArrowRight size={16} aria-hidden /></Link>
      </Reveal>
    </div></section>

    <section className="in-section" style={{ paddingTop: 0 }}><div className="in-wrap">
      <Reveal><h2>Ce qui nous guide</h2></Reveal>
      <Reveal as="ul" className="ab-values" stagger={0.1}>
        {values.map(({ icon: Icon, title, text }) => <motion.li key={title} variants={rise}><Icon size={30} strokeWidth={1.5} aria-hidden /><h3>{title}</h3><p>{text}</p></motion.li>)}
      </Reveal>
    </div></section>

    <section className="in-section ab-band"><div className="in-wrap">
      <Reveal><h2>Comment ça se passe</h2></Reveal>
      <Reveal as="ol" className="ab-steps" stagger={0.1}>
        {how.map(({ icon: Icon, title, text }) => <motion.li key={title} variants={rise}><Icon size={26} strokeWidth={1.5} aria-hidden /><h3>{title}</h3><p>{text}</p></motion.li>)}
      </Reveal>
    </div></section>

    <section className="in-closing"><Reveal className="in-wrap in-closing__in" stagger={0.15}>
      <motion.h2 variants={rise}>Essayez Plié sur une première commande.</motion.h2>
      <motion.div variants={rise}><Link className="in-btn" href="/commander">Planifier une collecte <ArrowRight size={18} aria-hidden /></Link></motion.div>
    </Reveal></section>
  </main></MotionConfig>;
}

/* --------------------------------------------------------------------- FAQ */

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return <MotionConfig reducedMotion="user"><main className="in">
    <Hero title="Les réponses, simplement." lead="Collecte, délais, prix : l’essentiel avant de commander." />
    <section className="in-section"><div className="in-wrap fq-grid">
      <Reveal className="fq-list">
        {faqs.map(([q, a], i) => {
          const isOpen = open === i;
          return <div className={`fq-item${isOpen ? ' is-open' : ''}`} key={q}>
            <h3><button type="button" aria-expanded={isOpen} aria-controls={`fq-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
              {q}<span className="fq-item__icon">{isOpen ? <Minus size={18} aria-hidden /> : <Plus size={18} aria-hidden />}</span>
            </button></h3>
            <AnimatePresence initial={false}>
              {isOpen && <motion.div id={`fq-${i}`} className="fq-item__body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><p>{a}</p></motion.div>}
            </AnimatePresence>
          </div>;
        })}
      </Reveal>
      <Reveal className="fq-side">
        <h3>Une autre question&nbsp;?</h3>
        <p>Écrivez-nous, l’équipe répond du lundi au samedi, de 8 h à 18 h.</p>
        <Link className="in-btn in-btn--gold" href="/contact">Nous écrire <ArrowRight size={18} aria-hidden /></Link>
      </Reveal>
    </div></section>
  </main></MotionConfig>;
}

/* ----------------------------------------------------------------- Contact */

export function Contact() {
  const { notify } = useStore();
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
    notify('Message envoyé, merci !');
  };
  return <MotionConfig reducedMotion="user"><main className="in">
    <Hero title="Une question ? On vous écoute." lead="Notre équipe vous répond du lundi au samedi, de 8 h à 18 h." />
    <section className="in-section"><div className="in-wrap cn-grid">
      <Reveal as="ul" className="cn-cards" stagger={0.08}>
        <motion.li variants={rise}><Mail aria-hidden /><div><small>Email</small><b>hello@plie.bj</b></div></motion.li>
        <motion.li variants={rise}><Phone aria-hidden /><div><small>Téléphone</small><b>+229 01 90 00 00 00</b></div></motion.li>
        <motion.li variants={rise}><MapPin aria-hidden /><div><small>Zone</small><b>Abomey-Calavi, Bénin</b></div></motion.li>
        <motion.li variants={rise}><Clock3 aria-hidden /><div><small>Horaires</small><b>Lundi au samedi, 8 h à 18 h</b></div></motion.li>
      </Reveal>
      <Reveal>
        {sent
          ? <motion.div className="cn-form cn-done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }}>
              <motion.span className="cn-done__icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.1 }}><Check size={30} aria-hidden /></motion.span>
              <h2>Message envoyé.</h2>
              <p>Merci, nous revenons vers vous très vite.</p>
              <button type="button" className="in-link" onClick={() => setSent(false)}>Écrire un autre message</button>
            </motion.div>
          : <form className="cn-form" onSubmit={submit}>
              <label>Votre nom<input required name="name" autoComplete="name" placeholder="Votre nom" /></label>
              <label>Votre adresse email<input required name="email" type="email" autoComplete="email" placeholder="vous@email.com" /></label>
              <label>Votre message<textarea required name="message" placeholder="Comment pouvons-nous vous aider ?" /></label>
              <button className="in-btn" type="submit">Envoyer le message <ArrowRight size={18} aria-hidden /></button>
            </form>}
      </Reveal>
    </div></section>
  </main></MotionConfig>;
}

