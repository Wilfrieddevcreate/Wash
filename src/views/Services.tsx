import Link from 'next/link';
import { ArrowRight, Droplets, House, Shirt, Sparkles, type LucideIcon } from 'lucide-react';
import Photo from '@/components/Photo';
import { services } from '@/lib/data';

const serviceIcons: Record<string, LucideIcon> = { wash: Droplets, iron: Sparkles, dry: Shirt, home: House };

export default function Services() {
  return <main className="page">
    <div className="page-intro"><p className="eyebrow">Nos services</p><h1>Le soin juste,<br /><em>pour chaque textile.</em></h1><p>Des prestations claires, des gestes précis, et une collecte qui s’adapte à votre rythme.</p></div>
    <div className="service-list">
      {services.map((service, i) => {
        const Icon = serviceIcons[service.id];
        return <article className="service-feature" key={service.id}>
          <div className="service-feature-copy">
            <span className="service-number">0{i + 1}</span><Icon size={28} strokeWidth={1.4} />
            <h2>{service.title}</h2><p>{service.desc}</p>
            <Link className="text-link" href={`/commander?service=${service.id}`}>Choisir ce service <ArrowRight size={16} /></Link>
          </div>
          <Photo src={service.image} alt={service.title} />
        </article>;
      })}
    </div>
  </main>;
}
