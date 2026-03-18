'use client';

import { useEffect, useState } from 'react';

// ── Assets ─────────────────────────────────────────────────────────
const BG       = '/assets/loading/bg.png';
const AOT_LOGO = '/assets/loading/aot-logo.png';
const PLANES   = [
  '/assets/loading/plane-2.svg', // bottom-left, small   (takeoff start)
  '/assets/loading/plane-1.svg', // lower-left, smaller  (banking turn)
  '/assets/loading/plane-3.svg', // center, large        (climbing)
  '/assets/loading/plane-4.svg', // upper-right, huge    (exit off-screen)
];

// ── Timing ─────────────────────────────────────────────────────────
const FADE_IN_MS    = 300;   // blank → Frame 1
const ADVANCE_MS    = 750;   // Frame N → Frame N+1
const FADE_MS       = 400;   // crossfade duration (ms)
const LOGO_DELAY_MS = FADE_IN_MS + ADVANCE_MS * 3 + 200;  // logo after Frame 4
const DONE_MS       = FADE_IN_MS + ADVANCE_MS * 3 + 2200; // navigate

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  // -1 = nothing; 0-3 = planes[0-3]
  const [frame, setFrame]     = useState(-1);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setFrame(0), FADE_IN_MS),
      setTimeout(() => setFrame(1), FADE_IN_MS + ADVANCE_MS),
      setTimeout(() => setFrame(2), FADE_IN_MS + ADVANCE_MS * 2),
      setTimeout(() => setFrame(3), FADE_IN_MS + ADVANCE_MS * 3),
      setTimeout(() => setShowLogo(true), LOGO_DELAY_MS),
      setTimeout(onComplete, DONE_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background */}
      <img
        src={BG}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />

      {/* Plane frames — each is a full-canvas SVG (393×852 viewBox) */}
      {PLANES.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          style={{
            objectFit: 'contain',
            opacity: frame === idx ? 1 : 0,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />
      ))}

      {/* AOT Suvarnabhumi logo — fades in after Frame 4 */}
      <img
        src={AOT_LOGO}
        alt="AOT Suvarnabhumi Airport"
        className="absolute object-contain pointer-events-none"
        style={{
          left: '13.49%',
          top: '52.11%',
          width: '73.03%',
          opacity: showLogo ? 1 : 0,
          transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
}
