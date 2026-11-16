import type { Metadata } from 'next';
import { About } from '@/views/Static';

export const metadata: Metadata = {
  title: "À propos",
  description: "L’histoire et les valeurs de Plié.",
};

export default function AProposPage() {
  return <About />;
}
