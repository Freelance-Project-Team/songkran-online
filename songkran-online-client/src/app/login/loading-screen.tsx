'use client';

import { useEffect, useState } from 'react';

// ── Assets ─────────────────────────────────────────────────────────
const BG       = '/assets/loading/bg.png';
const AOT_LOGO = '/assets/loading/aot-logo.png';
const CLOUD    = '/assets/loading/cloud.png';
const PLANES   = [
  '/assets/loading/plane-2.svg', // frame 0 — bottom-left, small   (takeoff)
  '/assets/loading/plane-1.svg', // frame 1 — lower-left, smaller  (banking)
  '/assets/loading/plane-3.svg', // frame 2 — center, large        (climbing)
  '/assets/loading/plane-4.svg', // frame 3 — upper-right, huge    (exit)
];

// ── Timing ─────────────────────────────────────────────────────────
const FADE_IN_MS    = 300;
const ADVANCE_MS    = 750;
const CLOUD_MS      = 600;   // cloud position transition duration
const FADE_MS       = 400;
const LOGO_DELAY_MS = FADE_IN_MS + ADVANCE_MS * 3 + 200;
const DONE_MS       = FADE_IN_MS + ADVANCE_MS * 3 + 2200;

// ── Cloud positions per frame ───────────────────────────────────────
// Matching Figma nodes (in order): 422:1165 → 422:1111 → 422:1219 → 422:1273
// Upper cloud group (upper-right area, grows from top-right corner)
const CLOUD_UPPER = [
  { top: '20.77%', right: '-7.55%',   bottom: '22.42%', left: '-24.68%' }, // frame 0
  { top: '0%',     right: '-55.9%',   bottom: '22.42%', left: '-24.68%' }, // frame 1
  { top: '-16.2%', right: '-134.86%', bottom: '9.94%',  left: '-12.47%' }, // frame 2
  { top: '-24.18%',right: '-212.81%', bottom: '-10.21%',left: '0%'      }, // frame 3
] as const;

// Lower cloud group (lower-left area, grows from bottom-left corner)
const CLOUD_LOWER = [
  { top: '35.92%', right: '-11.25%', bottom: '-11.58%', left: '-64.89%'  }, // frame 0
  { top: '49.69%', right: '-11.25%', bottom: '-11.58%', left: '-32.82%'  }, // frame 1
  { top: '27.7%',  right: '-6.03%',  bottom: '-35.56%', left: '-145.04%' }, // frame 2
  { top: '24.88%', right: '-0.09%',  bottom: '-51.29%', left: '-194.15%' }, // frame 3
] as const;

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [frame, setFrame]       = useState(-1); // -1 = nothing visible
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

  // Use frame 0 cloud positions when not yet started (so transition starts from frame 0)
  const ci = frame < 0 ? 0 : frame;
  const cloudVisible = frame >= 0;
  const cloudTransition = `top ${CLOUD_MS}ms ease, right ${CLOUD_MS}ms ease, bottom ${CLOUD_MS}ms ease, left ${CLOUD_MS}ms ease, opacity ${FADE_MS}ms ease`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">

      {/* ── Background ── */}
      <img
        src={BG}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />

      {/* ── Clouds (below planes) ── */}
      {/* Upper cloud — grows from upper-right, flipped horizontally */}
      <div
        className="absolute overflow-hidden pointer-events-none select-none"
        style={{
          top:    CLOUD_UPPER[ci].top,
          right:  CLOUD_UPPER[ci].right,
          bottom: CLOUD_UPPER[ci].bottom,
          left:   CLOUD_UPPER[ci].left,
          opacity: cloudVisible ? 1 : 0,

          transition: cloudTransition,
        }}
      >
        <img
          src={CLOUD}
          alt=""
          className="absolute inset-0 w-full h-full max-w-none object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>

      {/* Lower cloud — grows from lower-left */}
      <div
        className="absolute overflow-hidden pointer-events-none select-none"
        style={{
          top:    CLOUD_LOWER[ci].top,
          right:  CLOUD_LOWER[ci].right,
          bottom: CLOUD_LOWER[ci].bottom,
          left:   CLOUD_LOWER[ci].left,
          opacity: cloudVisible ? 1 : 0,

          transition: cloudTransition,
        }}
      >
        <img
          src={CLOUD}
          alt=""
          className="absolute inset-0 w-full h-full max-w-none object-cover"
        />
      </div>

      {/* ── Plane frames — top layer, centered to preserve mobile layout on desktop ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative h-full" style={{ aspectRatio: '393 / 852' }}>
          {PLANES.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full select-none"
              style={{
                opacity: frame === idx ? 1 : 0,
                transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── AOT Suvarnabhumi logo — fades in after Frame 4 ── */}
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
