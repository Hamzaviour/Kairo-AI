import React from 'react';

/*
 * Kairo identity. The mark is an open ring (the clock face, the cycle of work) whose gap
 * holds a saffron dot: the right moment. The wordmark is drawn monoline from the same
 * 3px stroke, and the dot of its "i" is that same saffron moment.
 */

export const SAFFRON = '#ffb224';
export const INK = '#13151a';

interface MarkProps {
  size?: number;
  // 'tile' sits on an ink square; 'bare' is the ring alone in currentColor
  variant?: 'tile' | 'tile-light' | 'bare';
  className?: string;
  title?: string;
}

export const KairoMark: React.FC<MarkProps> = ({ size = 32, variant = 'tile', className = '', title }) => {
  const ring = variant === 'tile' ? '#ffffff' : variant === 'tile-light' ? INK : 'currentColor';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {variant === 'tile' && <rect width="32" height="32" rx="8" fill={INK} />}
      {variant === 'tile-light' && <rect width="32" height="32" rx="8" fill="#ffffff" stroke="#e3e5ea" />}
      <path d="M23.94 15.03A8 8 0 1 1 16.97 8.06" stroke={ring} strokeWidth="3" strokeLinecap="round" />
      <circle cx="21.66" cy="10.34" r="2.6" fill={SAFFRON} />
    </svg>
  );
};

interface WordmarkProps {
  height?: number;
  className?: string;
}

// Monoline wordmark; strokes follow currentColor so it works on ink and on paper
export const KairoWordmark: React.FC<WordmarkProps> = ({ height = 20, className = '' }) => (
  <svg
    height={height}
    width={(height * 74) / 32}
    viewBox="0 0 74 32"
    fill="none"
    className={className}
    role="img"
    aria-label="Kairo"
  >
    <g stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4.2V26M10.5 12.2 2.7 19.6M5.8 16.8 11 26" />
      <path d="M31.6 19a7 7 0 1 1-14 0 7 7 0 1 1 14 0M31.6 12.2V26" />
      <path d="M38.2 12.2V26" />
      <path d="M44.8 26v-7.2c0-4 2.6-6.6 6.6-6.6" />
      <path d="M71.1 19a7 7 0 1 1-14 0 7 7 0 1 1 14 0" />
    </g>
    <circle cx="38.2" cy="5.8" r="2.4" fill={SAFFRON} />
  </svg>
);

interface LockupProps {
  size?: number;
  tone?: 'ink' | 'light';
  className?: string;
}

// Mark + wordmark. On ink grounds the tile would vanish, so the bare ring is used instead.
export const KairoLockup: React.FC<LockupProps> = ({ size = 32, tone = 'ink', className = '' }) => (
  <span
    className={`inline-flex items-center ${tone === 'light' ? 'text-white' : 'text-slate-900'} ${className}`}
    style={{ gap: size * 0.4 }}
  >
    <KairoMark size={size} variant={tone === 'light' ? 'bare' : 'tile'} />
    <KairoWordmark height={size * 0.62} />
  </span>
);
