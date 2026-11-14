import type { Metadata } from 'next';
import Catalogue from '@/views/Catalogue';

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Tarifs indicatifs en FCFA pour vos vêtements et votre linge de maison.",
};

export default function CataloguePage() {
  return <Catalogue />;
}
