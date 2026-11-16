export type Item = { id: number; name: string; category: string; price: number; image: string; description: string };
export type Service = { id: string; title: string; short: string; desc: string; from: string; price: number; image: string };
export type OrderStatus = 'Collecte programmée' | 'En traitement' | 'Prête à livrer';
export type Order = {
  id: string;
  client: string;
  zone: string;
  total: number;
  status: OrderStatus;
  date: string;
  pieces: number;
  pickup: string;
  /** index (0-5) de l'étape actuelle dans la frise de suivi */
  stage: number;
};

export const images = {
  hero: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1600&q=85',
  fold: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1000&q=85',
  shirt: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
  linen: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
  care: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
};

export const items: Item[] = [
  { id: 1, name: 'Chemise', category: 'Vêtements', price: 1200, image: images.shirt, description: 'Lavage et repassage soignés.' },
  { id: 2, name: 'Pantalon', category: 'Vêtements', price: 1500, image: images.care, description: 'Finition nette, pliage inclus.' },
  { id: 3, name: 'Robe', category: 'Vêtements', price: 2800, image: images.care, description: 'Traitement adapté aux tissus délicats.' },
  { id: 4, name: 'Drap 2 places', category: 'Linge de maison', price: 2500, image: images.linen, description: 'Fraîcheur et douceur retrouvées.' },
  { id: 5, name: 'Serviette', category: 'Linge de maison', price: 800, image: images.linen, description: 'Lavage profond et séchage soigné.' },
  { id: 6, name: 'Veste', category: 'Vêtements', price: 3000, image: images.shirt, description: 'Pressing délicat pour vos pièces fortes.' },
];

export const services: Service[] = [
  { id: 'wash', title: 'Lavage simple', short: 'Le quotidien, parfaitement propre.', desc: 'Le quotidien, parfaitement propre. Un lavage adapté à chaque matière, puis un séchage doux.', from: 'À partir de 1 200 FCFA', price: 1200, image: images.shirt },
  { id: 'iron', title: 'Lavage & repassage', short: 'Net, jusque dans les détails.', desc: 'Pour retrouver le plaisir d’un vêtement impeccable, prêt à porter.', from: 'À partir de 1 500 FCFA', price: 1500, image: images.fold },
  { id: 'dry', title: 'Nettoyage à sec', short: 'Pour les pièces qui demandent plus.', desc: 'Le soin expert des tissus qui demandent une attention particulière.', from: 'À partir de 2 800 FCFA', price: 2800, image: images.care },
  { id: 'home', title: 'Linge de maison', short: 'Le confort revient chez vous.', desc: 'Draps, serviettes et linge de maison : le confort revient chez vous.', from: 'À partir de 800 FCFA', price: 800, image: images.linen },
];

export const zones = ['Zogbadjè', 'Arconville', 'Fidjrossè'] as const;
export const slots = ['08:00 — 10:00', '10:00 — 12:00', '14:00 — 16:00'] as const;
export const LOGISTICS_FEE = 1000;

export const demoOrders: Order[] = [
  { id: 'PL-24091', client: 'Aïcha K.', zone: 'Zogbadjè', total: 8400, status: 'En traitement', date: '12 nov. 2026', pieces: 4, pickup: 'mercredi 13 nov. · 08:00 — 10:00', stage: 3 },
  { id: 'PL-24090', client: 'Thomas A.', zone: 'Arconville', total: 5200, status: 'Prête à livrer', date: '11 nov. 2026', pieces: 3, pickup: 'mardi 12 nov. · 10:00 — 12:00', stage: 4 },
  { id: 'PL-24089', client: 'Mireille D.', zone: 'Fidjrossè', total: 12600, status: 'Collecte programmée', date: '11 nov. 2026', pieces: 7, pickup: 'jeudi 14 nov. · 14:00 — 16:00', stage: 1 },
];

export const money = (n: number) => `${n.toLocaleString('fr-FR')} FCFA`;

export const faqs: Array<[string, string]> = [
  ['Comment fonctionne la collecte à domicile ?', 'Vous choisissez vos articles, une adresse et un créneau. Un coursier passe récupérer votre linge, puis vous le rapporte une fois traité.'],
  ['Dans quelles zones intervenez-vous ?', 'Nous intervenons actuellement à Abomey-Calavi, notamment à Zogbadjè, Arconville et Fidjrossè.'],
  ['Quels sont les délais ?', 'Comptez 24 à 48 h de traitement après la collecte. Le statut de votre commande est visible à tout moment depuis la page de suivi.'],
  ['Comment sont calculés les prix ?', 'Les tarifs du catalogue sont indicatifs, par article, auxquels s’ajoutent 1 000 FCFA de frais logistiques par commande.'],
  ['Puis-je modifier ma commande ?', 'Tant que la collecte n’a pas eu lieu, contactez-nous : nous ajusterons votre commande avec vous.'],
];
