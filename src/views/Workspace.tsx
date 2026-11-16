'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bell, Check, ChevronDown, ChevronRight, Clock3, Droplets, LayoutDashboard, Package, Shirt, Sparkles, Truck, type LucideIcon } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { demoOrders, money } from '@/lib/data';
import Logo from '@/components/Logo';

type Kind = 'admin' | 'partner' | 'courier';

const config = {
  admin: { role: 'administration', eyebrow: 'Vue d’ensemble', title: 'Bonjour, équipe Plié.', initials: 'AK', user: 'Aïcha K.', nav: ['Vue d’ensemble', 'Commandes', 'Partenaires', 'Coursiers', 'Zones & tarifs', 'Catalogue', 'Finances', 'Réclamations', 'Paramètres'] },
  partner: { role: 'espace partenaire', eyebrow: 'Espace partenaire', title: 'Bonjour, Pressing Horizon.', initials: 'PH', user: 'Pressing Horizon', nav: ['Vue d’ensemble', 'Commandes reçues', 'Historique'] },
  courier: { role: 'espace coursier', eyebrow: 'Espace coursier', title: 'Bonjour, Aïssatou.', initials: 'AA', user: 'Aïssatou A.', nav: ['Ma journée', 'Collectes', 'Livraisons', 'Historique'] },
} as const;

export default function Workspace({ kind }: { kind: Kind }) {
  const c = config[kind];
  const [active, setActive] = useState(0);

  return <div className="workspace">
    <aside className="side">
      <Link className="brand" href="/" aria-label="Plié, retour à l’accueil"><Logo tone="light" sub={c.role} /></Link>
      <nav className="side-nav" aria-label="Navigation de l’espace">
        {c.nav.map((label, i) => <button className={i === active ? 'selected' : ''} aria-current={i === active ? 'page' : undefined} onClick={() => setActive(i)} key={label}>{i === 0 ? <LayoutDashboard size={17} /> : i === 1 ? <Package size={17} /> : <ChevronRight size={17} />} {label}</button>)}
      </nav>
      <Link className="back-site" href="/">← Retour au site</Link>
    </aside>
    <section className="workspace-main">
      <header className="workspace-header">
        <div className="mobile-work-brand">plié</div>
        <div className="workspace-actions"><button aria-label="Notifications"><Bell size={18} /></button><span className="avatar">{c.initials}</span><span className="user-name">{c.user}</span><ChevronDown size={15} /></div>
      </header>
      <div className="workspace-content">
        <div className="workspace-title">
          <div><p className="eyebrow">{c.eyebrow}</p><h1>{c.title}</h1></div>
          {kind === 'admin' && <Link className="btn btn-dark" href="/commander"><Package size={16} /> Nouvelle commande</Link>}
        </div>
        {kind === 'admin' ? <AdminDash /> : kind === 'partner' ? <PartnerDash /> : <CourierDash />}
      </div>
    </section>
  </div>;
}

const chart = [{ n: 'Lun', v: 18 }, { n: 'Mar', v: 24 }, { n: 'Mer', v: 21 }, { n: 'Jeu', v: 32 }, { n: 'Ven', v: 28 }, { n: 'Sam', v: 36 }, { n: 'Dim', v: 31 }];

function AdminDash() {
  return <>
    <div className="metric-grid">
      <Metric label="Commandes ce mois" value="184" delta="+12,4%" icon={Package} />
      <Metric label="Chiffre d’affaires" value="1 284 500" suffix="FCFA" delta="+8,2%" icon={Sparkles} />
      <Metric label="En traitement" value="32" delta="À suivre" icon={Clock3} />
      <Metric label="Marge estimée" value="42,8%" delta="+3,1%" icon={Droplets} />
    </div>
    <div className="dash-grid">
      <div className="dash-card chart-card">
        <div className="dash-card-head"><div><h3>Activité des commandes</h3><p>7 derniers jours</p></div><button>Cette semaine <ChevronDown size={14} /></button></div>
        <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chart}>
          <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d8a45a" stopOpacity={.25} /><stop offset="100%" stopColor="#d8a45a" stopOpacity={0} /></linearGradient></defs>
          <XAxis dataKey="n" axisLine={false} tickLine={false} /><YAxis hide /><Tooltip />
          <Area type="monotone" dataKey="v" stroke="#d59a4b" fill="url(#g)" strokeWidth={2} />
        </AreaChart></ResponsiveContainer></div>
      </div>
      <div className="dash-card">
        <div className="dash-card-head"><div><h3>Répartition</h3><p>Par statut</p></div></div>
        <div className="status-bars">
          <div><span>En traitement</span><b>32</b><i style={{ width: '68%' }} /></div>
          <div><span>À livrer</span><b>18</b><i style={{ width: '42%' }} /></div>
          <div><span>Terminées</span><b>134</b><i style={{ width: '88%' }} /></div>
        </div>
      </div>
    </div>
    <div className="dash-card orders-table">
      <div className="dash-card-head"><div><h3>Dernières commandes</h3><p>Les commandes les plus récentes</p></div><Link className="text-link" href="/suivi">Voir tout <ArrowRight size={15} /></Link></div>
      <table>
        <thead><tr><th>Commande</th><th>Client</th><th>Zone</th><th>Montant</th><th>Statut</th></tr></thead>
        <tbody>{demoOrders.map((o) => <tr key={o.id}><td><b>{o.id}</b><small>{o.date}</small></td><td>{o.client}</td><td>{o.zone}</td><td>{money(o.total)}</td><td><span className="status-pill">● {o.status}</span></td></tr>)}</tbody>
      </table>
    </div>
  </>;
}

function Metric({ label, value, delta, icon: Icon, suffix }: { label: string; value: string; delta: string; icon: LucideIcon; suffix?: string }) {
  return <div className="metric"><div className="metric-icon"><Icon size={18} /></div><p>{label}</p><strong>{value} <small>{suffix}</small></strong><span>{delta}</span></div>;
}

function PartnerDash() {
  return <>
    <div className="partner-alert"><Check size={18} /><div><b>3 commandes à traiter aujourd’hui</b><p>La prochaine échéance est à 16:30.</p></div><ArrowRight /></div>
    <div className="dash-card orders-table">
      <div className="dash-card-head"><div><h3>Commandes reçues</h3><p>Vos commandes attribuées</p></div><button>Filtrer <ChevronDown size={14} /></button></div>
      {demoOrders.slice(0, 2).map((o) => <div className="task-row" key={o.id}>
        <div className="task-icon"><Shirt size={18} /></div>
        <div><b>{o.id} · {o.client}</b><small>{o.pieces} articles · Délai estimé : 48 h</small></div>
        <span className="status-pill">● {o.status}</span>
        <button className="icon-button" aria-label={`Détails ${o.id}`}><ChevronRight size={17} /></button>
      </div>)}
    </div>
  </>;
}

const missions: Array<{ kind: string; ref: string; where: string; icon: LucideIcon }> = [
  { kind: 'Collecte', ref: 'PL-24091', where: 'Zogbadjè · 08:00 — 10:00', icon: Package },
  { kind: 'Livraison', ref: 'PL-24090', where: 'Arconville · 14:00 — 16:00', icon: Truck },
];

function CourierDash() {
  return <>
    <div className="courier-today">
      <div><p className="eyebrow">Mercredi 13 novembre</p><h2>Votre journée,<br /><em>en un coup d’œil.</em></h2></div>
      <div className="courier-count"><strong>{missions.length}</strong><span>missions prévues</span></div>
    </div>
    <div className="dash-card">
      <div className="dash-card-head"><div><h3>Prochaines missions</h3><p>Appuyez pour voir les détails</p></div></div>
      {missions.map(({ kind, ref, where, icon: Icon }) => <div className="task-row" key={ref}>
        <div className="task-icon saffron"><Icon size={18} /></div>
        <div><b>{kind} · {ref}</b><small>{where}</small></div>
        <Link className="btn btn-dark small" href={`/suivi?ref=${ref}`}>Voir la mission <ArrowRight size={14} /></Link>
      </div>)}
    </div>
    <div className="metric-grid two">
      <Metric label="Gains estimés ce mois" value="86 500" suffix="FCFA" delta="+12%" icon={Sparkles} />
      <Metric label="Courses terminées" value="38" delta="Ce mois" icon={Check} />
    </div>
  </>;
}
