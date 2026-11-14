import type { Metadata } from 'next';
import Workspace from '@/views/Workspace';

export const metadata: Metadata = {
  title: "Administration",
  description: "Espace d’administration (démonstration).",
};

export default function AdminPage() {
  return <Workspace kind="admin" />;
}
