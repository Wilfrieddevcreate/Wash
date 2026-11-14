'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { faqs, LOGISTICS_FEE, money, services } from '@/lib/data';
import './home.css';

const steps = [
  ['Vous commandez', 'Choisissez vos articles, votre adresse et un créneau de collecte. Quelques minutes suffisent.'],
  ['Nous collectons', 'Un coursier vient chercher votre linge à la porte, au créneau choisi.'],
  ['Nous traitons', 'Lavage, repassage ou nettoyage à sec, en 24 à 48 h. Vous suivez l’avancement en ligne.'],
  ['Nous livrons', 'Votre linge revient propre et plié. Vous payez à la récupération, ou à l’avance.'],
];

export default function Home() {
  return <main className="hm">
    <Hero />
    <Services />
    <Steps />
    <Practical />
    <Faq />
    <section className="hm-final hm-section">
      <div className="hm-wrap">
        <div><h2>Votre linge, collecté demain&nbsp;?</h2><p>Réservez un créneau en quelques minutes. Rien n’est facturé avant la collecte.</p></div>
        <Link className="hm-btn hm-btn--sun" href="/commander">Planifier une collecte <ArrowRight size={18} aria-hidden /></Link>
      </div>
    </section>
    <div className="hm-sticky"><span><b>Collecte à domicile</b>Abomey-Calavi</span><Link className="hm-btn hm-btn--sun" href="/commander">Commander</Link></div>
  </main>;
}

function Hero() {
  const [serviceId, setServiceId] = useState(services[1].id);
  const [qty, setQty] = useState(5);
  const service = services.find((s) => s.id === serviceId) ?? services[0];
  const estimate = service.price * qty + LOGISTICS_FEE;

  return <section className="hm-hero">
    <div className="hm-wrap">
      <div>
        <h1>On collecte votre linge. Il revient propre en 48&nbsp;h.</h1>
        <p className="hm-lead">Lavage, repassage et nettoyage à sec, avec collecte et livraison à votre porte à Abomey-Calavi. Vous suivez chaque étape depuis votre téléphone.</p>

        <form className="hm-quote" aria-labelledby="quote-title" onSubmit={(e) => e.preventDefault()}>
          <h2 className="hm-quote__title" id="quote-title">Estimez votre commande</h2>
          <div className="hm-quote__row">
            <label className="hm-field">Prestation
              <select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
                {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </label>
            <div className="hm-field" role="group" aria-label="Nombre d’articles">Articles
              <div className="hm-stepper">
                <button type="button" aria-label="Un article de moins" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <output aria-live="polite">{qty}</output>
                <button type="button" aria-label="Un article de plus" disabled={qty >= 50} onClick={() => setQty((q) => Math.min(50, q + 1))}>+</button>
              </div>
            </div>
          </div>
          <div className="hm-quote__result">
            <span className="hm-quote__price">{money(estimate)}</span>
            <span className="hm-quote__note">dont {money(LOGISTICS_FEE)} de collecte et livraison. Estimation indicative.</span>
          </div>
          <Link className="hm-btn hm-btn--sun" href={`/commander?service=${service.id}`}>Planifier la collecte <ArrowRight size={18} aria-hidden /></Link>
        </form>
      </div>

      <div className="hm-ticket-zone">
        <article className="hm-ticket" aria-label="Exemple de ticket de suivi">
          <header className="hm-ticket__head"><b>soigné</b><span>Ticket de dépôt</span></header>
          <div className="hm-ticket__body">
            <p className="hm-ticket__ref">Commande<strong>SG-24091</strong></p>
            <ol>
              <li className="is-done"><i><Check size={15} aria-hidden /></i><div><b>Collecte effectuée</b><span>Mer. 13 nov., 08:00 — 10:00</span></div></li>
              <li className="is-now"><i /><div><b>En traitement</b><span>Prête demain en fin de journée</span></div></li>
              <li><i /><div><b>Livraison</b><span>Créneau confirmé par SMS</span></div></li>
            </ol>
          </div>
          <footer className="hm-ticket__stub"><span>4 pièces</span><span>8 400 FCFA</span></footer>
        </article>
        <p className="hm-ticket-caption">Exemple de suivi. <Link className="hm-link" href="/suivi">Voir la page de suivi</Link></p>
      </div>
    </div>
  </section>;
}

function Services() {
  return <section className="hm-section" id="prestations">
    <div className="hm-wrap">
      <h2>Quatre prestations, des prix affichés</h2>
      <table className="hm-table">
        <caption className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Prestations et tarifs</caption>
        <thead><tr><th scope="col">Prestation</th><th scope="col">Pour quoi</th><th scope="col">Par article, dès</th></tr></thead>
        <tbody>
          {services.map((s) => <tr key={s.id}>
            <td>{s.title}</td>
            <td>{s.desc}<br /><Link className="hm-link" href={`/commander?service=${s.id}`}>Choisir cette prestation</Link></td>
            <td>{money(s.price)}</td>
          </tr>)}
        </tbody>
      </table>
      <div className="hm-foot">
        <p>Collecte et livraison : {money(LOGISTICS_FEE)} par commande.</p>
        <Link className="hm-link" href="/catalogue">Voir le prix de chaque article</Link>
      </div>
    </div>
  </section>;
}

function Steps() {
  return <section className="hm-section" id="fonctionnement">
    <div className="hm-wrap">
      <h2>Comment ça marche</h2>
      <ol className="hm-steps">
        {steps.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}
      </ol>
    </div>
  </section>;
}

function Practical() {
  return <section className="hm-section">
    <div className="hm-wrap">
      <h2>Avant de commander</h2>
      <div className="hm-info">
        <div><h3>Où</h3><ul><li>Zogbadjè</li><li>Arconville</li><li>Fidjrossè</li></ul><small>Abomey-Calavi uniquement, pour l’instant.</small></div>
        <div><h3>Quand</h3><p>Notre équipe répond du lundi au samedi, de 8 h à 18 h. Vous choisissez un créneau de collecte de 2 heures.</p><small>Délai de traitement : 24 à 48 h.</small></div>
        <div><h3>Paiement</h3><p>À la récupération de votre linge, ou à l’avance. Le tarif est affiché avant de confirmer.</p><small>Questions&nbsp;? <Link className="hm-link" href="/contact">Écrivez-nous</Link>.</small></div>
      </div>
    </div>
  </section>;
}

function Faq() {
  return <section className="hm-section">
    <div className="hm-wrap">
      <h2>Questions fréquentes</h2>
      <div className="hm-faq">
        {faqs.slice(0, 4).map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </div>
      <div className="hm-foot"><Link className="hm-link" href="/faq">Toutes les questions</Link></div>
    </div>
  </section>;
}
