import type { Metadata } from 'next';
import Workspace from '@/views/Workspace';

export const metadata: Metadata = {
  title: "Espace partenaire",
  description: "Espace partenaire (démonstration).",
};

export default function PartenairePage() {
  return <Workspace kind="partner" />;
}
