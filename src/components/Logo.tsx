import './logo.css';

type Tone = 'dark' | 'light';

/** Cintre + coche : « c’est impec ». `dark` = pastille verte (fonds clairs), `light` = pastille or (fonds sombres). */
export function LogoMark({ tone = 'dark', size = 40 }: { tone?: Tone; size?: number }) {
  const tile = tone === 'dark' ? '#123b43' : '#d5a05a';
  const hanger = tone === 'dark' ? '#d5a05a' : '#123b43';
  const check = '#fffdf8';
  return <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
    <rect width="96" height="96" rx="28" fill={tile} />
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke={hanger} strokeWidth="8" d="M18 56L48 36L78 56" />
      <path stroke={hanger} strokeWidth="7" d="M48 36C48 30 58 30 58 22C58 13 43 13 41 22" />
      <path stroke={check} strokeWidth="9" d="M30 66L43 78L68 56" />
    </g>
  </svg>;
}

export default function Logo({ tone = 'dark', sub, size = 40 }: { tone?: Tone; sub?: string; size?: number }) {
  return <span className="logo">
    <LogoMark tone={tone} size={size} />
    <span className="logo__word">impec{sub && <small>{sub}</small>}</span>
  </span>;
}
