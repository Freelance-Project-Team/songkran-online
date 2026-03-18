'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Lang = 'th' | 'en';

// ── Background assets (same as login) ────────────────────────────────────────
const BG = {
  bg:            '/assets/login/bg.png',
  wave:          '/assets/login/wave.svg',
  temple:        '/assets/login/temple.png',
  flowers:       '/assets/login/flowers.png',
  logo:          '/assets/login/logo.png',
  pastelCity:    '/assets/login/pastel-city.png',
  kite:          '/assets/login/kite.png',
  bottomBar:     '/assets/login/bottom-bar.png',
  childrenLeft:  '/assets/login/children-left.png',
  childrenRight: '/assets/login/children-right.png',
};

// ── Button configs ─────────────────────────────────────────────────────────────
interface BtnConfig {
  route:  string;
  /** group bounds as % of 393×852 canvas */
  group:  { left: string; top: string; width: string; height: string };
}

const BUTTONS: BtnConfig[] = [
  {
    route:  '/tradition',
    group: { left: '2.54%',  top: '35.21%', width: '47.97%', height: '21.24%' },
  },
  {
    route:  '/prayer',
    group: { left: '54.45%', top: '35.21%', width: '39.95%', height: '21.24%' },
  },
  {
    route:  '/blessing',
    group: { left: '6.62%',  top: '57.75%', width: '43.97%', height: '21.24%' },
  },
  {
    route:  '/water-play',
    group: { left: '52.67%', top: '57.75%', width: '43.26%', height: '21.24%' },
  },
];

const sarabun = { fontFamily: 'Sarabun, sans-serif' };

// ── Background artwork (identical to login Artwork component) ─────────────────
function HomeBackground() {
  return (
    <>
      <img
        src={BG.bg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-left pointer-events-none select-none"
      />

      <img
        src={BG.wave}
        alt=""
        className="absolute max-w-none pointer-events-none select-none"
        style={{
          top: 'calc(50% + 69.5px)',
          left: '-6.62%',
          right: '-6.11%',
          width: '112.73%',
          aspectRatio: '355 / 240',
          transform: 'translateY(-50%)',
        }}
      />

      <img
        src={BG.temple}
        alt=""
        className="absolute left-0 w-full pointer-events-none select-none"
        style={{ top: '-12%' }}
      />

      <img
        src={BG.flowers}
        alt=""
        className="absolute pointer-events-none select-none"
        style={{ top: '5.92%', left: '-2.17%', width: '33.59%' }}
      />

      <img
        src={BG.logo}
        alt="Amazing Songkran Festival 2026"
        className="absolute max-w-none pointer-events-none select-none"
        style={{ top: '10.2%', left: '-17.05%', width: '141.17%' }}
      />

      <img
        src={BG.pastelCity}
        alt=""
        className="absolute left-0 w-full pointer-events-none select-none"
        style={{ top: '71.36%' }}
      />

      <div
        className="absolute pointer-events-none select-none"
        style={{ top: '78.62%', left: '87.01%', right: '3.68%', bottom: '14.75%' }}
      >
        <img src={BG.kite} alt="" className="w-full h-full object-contain" style={{ transform: 'scaleX(-1)' }} />
      </div>

      <div
        className="absolute left-0 right-0 bottom-0 overflow-hidden pointer-events-none select-none"
        style={{ top: '87.56%' }}
      >
        <img
          src={BG.bottomBar}
          alt=""
          className="absolute left-0 w-full max-w-none"
          style={{ height: '371.23%', top: '-271.23%' }}
        />
      </div>

      <div
        className="absolute pointer-events-none select-none"
        style={{ top: '83.55%', left: '13.74%', right: '40.97%', bottom: '2.95%' }}
      >
        <img src={BG.childrenLeft} alt="" className="w-full h-full object-contain" />
      </div>

      <div
        className="absolute pointer-events-none select-none"
        style={{ top: '83.43%', left: '59.28%', right: '15.22%', bottom: '3.25%' }}
      >
        <img src={BG.childrenRight} alt="" className="w-full h-full object-contain" style={{ transform: 'scaleX(-1)' }} />
      </div>
    </>
  );
}

// ── Single button card ────────────────────────────────────────────────────────
function ButtonCard({ index, btn, lang, onClick }: { index: number; btn: BtnConfig; lang: Lang; onClick: () => void }) {
  return (
    <div
      className="absolute cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-transform"
      style={{ left: btn.group.left, top: btn.group.top, width: btn.group.width, height: btn.group.height }}
      onClick={onClick}
    >
      <img
        src={`/assets/home/btn-${index + 1}-${lang}.png`}
        alt=""
        className="absolute inset-0 w-full h-full object-fill select-none pointer-events-none"
      />
    </div>
  );
}

// ── Mobile canvas ─────────────────────────────────────────────────────────────
function MobileCanvas({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  const router = useRouter();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-sky-200">
      <HomeBackground />

      {/* Language toggle */}
      <button
        onClick={onToggle}
        className="absolute z-10 bg-white rounded-[20px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        style={{
          left:        '82.7%',
          top:         '6.57%',
          width:       '11.45%',
          aspectRatio: '1',
          ...sarabun,
          fontSize:    '11px',
          fontWeight:  700,
          color:       '#4da8fe',
        }}
      >
        {lang === 'th' ? 'EN' : 'TH'}
      </button>

      {/* 4 button cards */}
      {BUTTONS.map((btn, i) => (
        <ButtonCard
          key={i}
          index={i}
          btn={btn}
          lang={lang}
          onClick={() => router.push(btn.route)}
        />
      ))}
    </div>
  );
}

// ── Desktop sidebar layout ────────────────────────────────────────────────────
function DesktopCanvas({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  const router = useRouter();

  return (
    <div className="flex h-screen">
      {/* Left: centered mobile-proportioned canvas */}
      <div className="relative flex-1 h-screen overflow-hidden bg-sky-200 flex items-center justify-center">
        <div className="relative h-full" style={{ aspectRatio: '393 / 852' }}>
          <HomeBackground />

          {/* Language toggle */}
          <button
            onClick={onToggle}
            className="absolute z-10 bg-white rounded-[20px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            style={{
              left:        '82.7%',
              top:         '6.57%',
              width:       '11.45%',
              aspectRatio: '1',
              ...sarabun,
              fontSize:    '11px',
              fontWeight:  700,
              color:       '#4da8fe',
            }}
          >
            {lang === 'th' ? 'EN' : 'TH'}
          </button>

          {/* 4 button cards */}
          {BUTTONS.map((btn, i) => (
            <ButtonCard
              key={i}
              index={i}
              btn={btn}
              lang={lang}
              onClick={() => router.push(btn.route)}
            />
          ))}
        </div>
      </div>

      {/* Right: info panel */}
      <div className="w-[440px] shrink-0 flex flex-col items-center justify-center bg-white px-10 py-12 shadow-2xl overflow-y-auto z-10">
        <img
          src={BG.logo}
          alt="Amazing Songkran Festival 2026"
          className="w-56 object-contain mb-6"
          style={{ position: 'static', width: '14rem', left: 'unset', top: 'unset' }}
        />
        <p
          style={sarabun}
          className="text-[#89c6ff] text-[11px] font-semibold tracking-widest text-center"
        >
          {lang === 'th' ? 'เลือกกิจกรรมที่ต้องการ' : 'SELECT AN ACTIVITY'}
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [lang, setLang] = useState<Lang>('th');
  const toggle = () => setLang(l => l === 'th' ? 'en' : 'th');

  return (
    <>
      <div className="lg:hidden">
        <MobileCanvas lang={lang} onToggle={toggle} />
      </div>
      <div className="hidden lg:block">
        <DesktopCanvas lang={lang} onToggle={toggle} />
      </div>
    </>
  );
}
