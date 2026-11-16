'use client';

import type { ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';

export const EASE = [0.22, 1, 0.36, 1] as const;
export const VIEW = { once: true, margin: '0px 0px -12% 0px' } as const;

export const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
export const group = (stagger = 0.09, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Apparition au scroll : un bloc, ou une liste d'enfants en cascade (avec `stagger`). */
export function Reveal({ children, className, as = 'div', stagger, id }: { children: ReactNode; className?: string; as?: 'div' | 'header' | 'ul' | 'ol' | 'section'; stagger?: number; id?: string }) {
  const Tag = motion[as] as typeof motion.div;
  return <Tag id={id} className={className} variants={stagger ? group(stagger) : rise} initial="hidden" whileInView="show" viewport={VIEW}>{children}</Tag>;
}
