import './logo.css';

type Tone = 'dark' | 'light';

/** Pastille « p » au coin plié. `dark` = pastille verte (fonds clairs), `light` = pastille or (fonds sombres). */
export function LogoMark({ tone = 'dark', size = 40 }: { tone?: Tone; size?: number }) {
  const tile = tone === 'dark' ? '#123b43' : '#d5a05a';
  const flap = tone === 'dark' ? '#2a6370' : '#f0d3a6';
  const letter = tone === 'dark' ? '#d5a05a' : '#123b43';
  return <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
    <path fill={tile} d="M22 0H62L96 34V74A22 22 0 0 1 74 96H22A22 22 0 0 1 0 74V22A22 22 0 0 1 22 0Z" />
    <path fill={flap} d="M62 0V34H96Z" />
    <path fill="none" stroke={letter} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" d="M33 80V41H52A13 13 0 0 1 52 67H33" />
  </svg>;
}

export default function Logo({ tone = 'dark', sub, size = 40 }: { tone?: Tone; sub?: string; size?: number }) {
  return <span className="logo">
    <LogoMark tone={tone} size={size} />
    <span className="logo__word">plié{sub && <small>{sub}</small>}</span>
  </span>;
}
