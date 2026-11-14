import type { Metadata } from 'next';
import Workspace from '@/views/Workspace';

export const metadata: Metadata = {
  title: "Espace coursier",
  description: "Espace coursier (démonstration).",
};

export default function CoursierPage() {
  return <Workspace kind="courier" />;
}
