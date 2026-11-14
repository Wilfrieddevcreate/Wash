import type { Metadata } from 'next';
import Services from '@/views/Services';

export const metadata: Metadata = {
  title: "Nos prestations",
  description: "Lavage, repassage, nettoyage à sec et linge de maison : découvrez les prestations de soigné.",
};

export default function PrestationsPage() {
  return <Services />;
}
