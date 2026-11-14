import type { Metadata } from 'next';
import { Faq } from '@/views/Static';

export const metadata: Metadata = {
  title: "FAQ",
  description: "Réponses aux questions fréquentes sur la collecte, les délais et les prix.",
};

export default function FaqPage() {
  return <Faq />;
}
