'use client';

import Link from 'next/link';
import { ArrowRight, ChevronRight, Droplets, House, Shirt, Sparkles, type LucideIcon } from 'lucide-react';
import Photo from '@/components/Photo';
import { images, items, money, services } from '@/lib/data';
import { useStore } from '@/lib/store';

const serviceIcons: Record<string, LucideIcon> = { wash: Droplets, iron: Sparkles, dry: Shirt, home: House };

export default function Home() {
  const { add } = useStore();
  return <main className="home-v3">
    <section className="hero-v3">
      <div className="hero-v3-copy">
        <p className="eyebrow light">Pressing à domicile · Abomey-Calavi</p>
        <h1>Le soin qui<br /><em>vous libère.</em></h1>
        <p>Nous collectons, traitons et rapportons vos vêtements à la maison. Vous gardez votre temps, nous gardons le sens du détail.</p>
        <div className="hero-actions">
          <Link className="btn btn-saffron" href="/commander">Planifier une collecte <ArrowRight size={17} /></Link>
          <Link className="play-link" href="/#fonctionnement">Voir comment ça marche <ChevronRight size={16} /></Link>
        </div>
      </div>
      <div className="hero-v3-photo">
        <Photo src={images.hero} alt="Vêtements propres et soigneusement pliés" width={1600} height={1200} priority />
        <div className="hero-v3-caption"><span>01</span><p>Un soin précis,<br />du panier à la porte.</p></div>
      </div>
      <div className="hero-v3-meta"><span>soigné / 2026</span><span>↓ Faites défiler</span></div>
    </section>

    <section className="proof-strip">
      <div><strong>4.9</strong><span>avis clients<br />en démonstration</span></div>
      <div><strong>24—48h</strong><span>délai moyen<br />de traitement</span></div>
      <div><strong>100%</strong><span>suivi de votre<br />commande</span></div>
      <p>Un service pensé pour les journées qui vont vite.</p>
    </section>

    <section className="editorial-intro">
      <div><p className="eyebrow">L’intention</p><h2>Le luxe, parfois,<br /><em>c’est du temps.</em></h2></div>
      <div className="editorial-intro-copy">
        <p>soigné est une plateforme locale de pressing qui s’occupe du geste que vous repoussez toujours. Une collecte simple, un traitement exigeant et un retour à l’heure convenue.</p>
        <Link className="text-link" href="/a-propos">Découvrir notre approche <ArrowRight size={16} /></Link>
      </div>
    </section>

    <section className="service-index">
      <div className="service-index-head"><p className="eyebrow">Nos prestations</p><Link className="text-link" href="/prestations">Toutes les prestations <ArrowRight size={16} /></Link></div>
      {services.map((service, idx) => {
        const Icon = serviceIcons[service.id];
        return <Link className="service-line" key={service.id} href={`/commander?service=${service.id}`}>
          <span className="service-number">0{idx + 1}</span><Icon size={21} />
          <span className="service-line-main"><b>{service.title}</b><small>{service.short}</small></span>
          <span className="service-line-price">{service.from}</span><ArrowRight size={18} />
        </Link>;
      })}
    </section>

    <section className="process-v3" id="fonctionnement">
      <div className="process-v3-image"><Photo src={images.fold} alt="Pliage soigneux d'un vêtement" width={1000} height={1200} /><span>Le geste juste, à chaque étape.</span></div>
      <div className="process-v3-copy">
        <p className="eyebrow">Comment ça marche</p>
        <h2>Trois gestes.<br /><em>Une journée plus légère.</em></h2>
        <div className="process-list">
          <div><b>01</b><span><strong>Vous commandez</strong><small>Choisissez vos articles et un créneau de collecte.</small></span></div>
          <div><b>02</b><span><strong>Nous prenons le relais</strong><small>Un coursier récupère votre linge à domicile.</small></span></div>
          <div><b>03</b><span><strong>Vous retrouvez l’essentiel</strong><small>Vos vêtements reviennent propres, pliés, prêts à vivre.</small></span></div>
        </div>
        <Link className="btn btn-dark" href="/commander">Commencer maintenant <ArrowRight size={16} /></Link>
      </div>
    </section>

    <section className="quote-v3"><p className="eyebrow">Ce que nous défendons</p><blockquote>« Les belles choses commencent par une attention sincère. »</blockquote><span>— L’équipe soigné</span></section>

    <section className="popular-v3">
      <div className="section-head"><div><p className="eyebrow">Le catalogue</p><h2>Les essentiels<br /><em>du quotidien.</em></h2></div><Link className="text-link" href="/catalogue">Voir le catalogue <ArrowRight size={16} /></Link></div>
      <div className="product-row">
        {items.slice(0, 3).map((item) => <article className="product-card" key={item.id}>
          <Photo src={item.image} alt={item.name} width={800} height={600} />
          <div><span>{item.category}</span><h3>{item.name}</h3><p>À partir de <b>{money(item.price)}</b></p><button onClick={() => add(item.id)}>Ajouter <ArrowRight size={15} /></button></div>
        </article>)}
      </div>
    </section>

    <section className="faq-callout"><div><p className="eyebrow light">Besoin de savoir</p><h2>Tout est plus simple<br /><em>quand c’est clair.</em></h2></div><Link className="btn btn-saffron" href="/faq">Consulter la FAQ <ArrowRight size={16} /></Link></section>
    <section className="cta"><div><p className="eyebrow light">Prêt à souffler un peu ?</p><h2>Votre prochaine lessive<br /><em>peut attendre.</em></h2></div><Link className="btn btn-saffron" href="/commander">Commander maintenant <ArrowRight size={17} /></Link></section>
  </main>;
}
