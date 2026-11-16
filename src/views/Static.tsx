'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Photo from '@/components/Photo';
import { faqs, images } from '@/lib/data';
import { useStore } from '@/lib/store';

export function About() {
  return <main className="page info-page">
    <div className="page-intro"><p className="eyebrow">Notre histoire</p><h1>Le soin, en toute simplicité.</h1><p>Plié est né d’une idée simple : rendre le pressing aussi facile qu’une livraison de repas. Nous coordonnons chaque étape pour que vos vêtements reviennent impeccables, sans jamais vous faire courir.</p></div>
    <Photo src={images.fold} alt="Pliage soigneux d'un vêtement" width={1000} height={700} className="wide-photo" />
    <div className="values">
      <div><span>01</span><h3>Attention</h3><p>Chaque article est traité avec le respect qu’il mérite.</p></div>
      <div><span>02</span><h3>Clarté</h3><p>Des prix lisibles et un suivi sans jargon.</p></div>
      <div><span>03</span><h3>Proximité</h3><p>Un service local pensé pour votre quotidien.</p></div>
    </div>
  </main>;
}

export function Faq() {
  return <main className="page faq">
    <div className="page-intro compact"><p className="eyebrow">Questions fréquentes</p><h1>Les réponses, <em>simplement.</em></h1></div>
    {faqs.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}<ChevronDown size={18} /></summary><p>{a}</p></details>)}
  </main>;
}

export function Contact() {
  const { notify } = useStore();
  return <main className="page contact">
    <div className="page-intro compact"><p className="eyebrow">Nous écrire</p><h1>Une question ?<br /><em>On vous écoute.</em></h1><p>Notre équipe vous répond du lundi au samedi, de 8h à 18h.</p></div>
    <div className="contact-grid">
      <div><p className="eyebrow">Coordonnées</p><h3>hello@plie.bj</h3><h3>+229 01 90 00 00 00</h3><p className="muted">Abomey-Calavi, Bénin</p></div>
      <form onSubmit={(e) => { e.preventDefault(); e.currentTarget.reset(); notify('Message envoyé — merci !'); }}>
        <label>Votre nom<input required name="name" autoComplete="name" placeholder="Votre nom" /></label>
        <label>Votre adresse email<input required name="email" type="email" autoComplete="email" placeholder="vous@email.com" /></label>
        <label>Votre message<textarea required name="message" placeholder="Comment pouvons-nous vous aider ?" /></label>
        <button className="btn btn-dark">Envoyer le message <ArrowRight size={16} /></button>
      </form>
    </div>
  </main>;
}
