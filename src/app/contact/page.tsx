import type { Metadata } from 'next';
import { Contact } from '@/views/Static';

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrivez à l’équipe Plié.",
};

export default function ContactPage() {
  return <Contact />;
}
