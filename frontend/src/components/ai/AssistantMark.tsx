import React from 'react';

// The Kairo ring and its saffron dot, redrawn on a 24px grid so it sits alongside lucide icons.
// The ring follows currentColor; the dot defaults to brand saffron and can be swapped for contrast.
const AssistantMark: React.FC<{ className?: string; dotClassName?: string }> = ({
  className = 'w-6 h-6',
  dotClassName = 'fill-brand-400',
}) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M18.95 11.15A7 7 0 1 1 12.85 5.05" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="16.95" cy="7.05" r="2.3" className={dotClassName} />
  </svg>
);

export default AssistantMark;
