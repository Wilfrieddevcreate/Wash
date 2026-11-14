import { Suspense } from 'react';
import type { Metadata } from 'next';
import Tracking from '@/views/Tracking';

export const metadata: Metadata = {
  title: "Suivi de commande",
  description: "Suivez l’avancement de votre commande soigné.",
};

export default function SuiviPage() {
  return <Suspense><Tracking /></Suspense>;
}
