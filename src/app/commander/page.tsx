import { Suspense } from 'react';
import type { Metadata } from 'next';
import Order from '@/views/Order';

export const metadata: Metadata = {
  title: "Commander",
  description: "Planifiez une collecte de pressing à domicile à Abomey-Calavi.",
};

export default function CommanderPage() {
  return <Suspense><Order /></Suspense>;
}
