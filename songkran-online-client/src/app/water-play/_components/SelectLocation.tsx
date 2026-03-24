'use client';

import { useState } from 'react';
import { LangToggleButton } from '@/src/shared/ui/LangToggleButton';
import { GoBackButton } from '@/src/shared/ui/GoBackButton';

type Lang = 'th' | 'en';
type LocationId = 'arun' | 'phakeaw' | 'airport' | 'saochingcha';

const A = {
	bg: '/assets/playsongkran/locations/bg.png',
	cont: '/assets/playsongkran/continue.png',
} as const;

// labelHeight normalized so all text renders at the same visual size.
// Reference: arun 36px source → 4.8% height looks correct.
// Formula: 4.8% × (srcH / 36)
const LOCATIONS: {
	id: LocationId;
	img: string;
	textImg: { th: string; en: string };
	ariaLabel: string;
	left: string;
	top: string;
	labelTop: { th: string; en: string };
	labelCenterX: { th: string; en: string };
	labelHeight: { th: string; en: string };
	labelMaxWidth: { th: string; en: string };
}[] = [
	{
		id: 'arun',
		img: '/assets/playsongkran/locations/arun.png',
		textImg: { th: '/assets/playsongkran/locations/arun-text-th.png', en: '/assets/playsongkran/locations/arun-text-en.png' },
		ariaLabel: 'วัดอรุณราชวราราม',
		left: '8.14%',
		top: '37.32%',
		labelTop: { th: '51.94%', en: '50%' },
		labelCenterX: { th: '36.23%', en: '38%' },
		labelHeight: { th: '4.8%', en: '4.8%' },
		labelMaxWidth: { th: '70%', en: '65%' },
	},
	{
		id: 'phakeaw',
		img: '/assets/playsongkran/locations/phakeaw.png',
		textImg: { th: '/assets/playsongkran/locations/phakeaw-text-th.png', en: '/assets/playsongkran/locations/phakeaw-text-en.png' },
		ariaLabel: 'วัดพระแก้ว',
		left: '54.45%',
		top: '37.32%',
		labelTop: { th: '51.94%', en: '51.94%' },
		labelCenterX: { th: '73.54%', en: '70%' },
		labelHeight: { th: '3.87%', en: '3.87%' },
		labelMaxWidth: { th: '100%', en: '125%' },
	},
	{
		id: 'airport',
		img: '/assets/playsongkran/locations/airport.png',
		textImg: { th: '/assets/playsongkran/locations/airport-text-th.png', en: '/assets/playsongkran/locations/airport-text-en.png' },
		ariaLabel: 'ท่าอากาศยานสุวรรณภูมิ',
		left: '8.14%',
		top: '60.09%',
		labelTop: { th: '72.65%', en: '72.65%' },
		labelCenterX: { th: '41.23%', en: '39%' },
		labelHeight: { th: '5.47%', en: '5.47%' },
		labelMaxWidth: { th: '50%', en: '60%' },
	},
	{
		id: 'saochingcha',
		img: '/assets/playsongkran/locations/saochingcha.png',
		textImg: { th: '/assets/playsongkran/locations/saochingcha-text-th.png', en: '/assets/playsongkran/locations/saochingcha-text-en.png' },
		ariaLabel: 'เสาชิงช้า',
		left: '54.45%',
		top: '59.51%',
		labelTop: { th: '73.89%', en: '73.89%' },
		labelCenterX: { th: '74.54%', en: '70%' },
		labelHeight: { th: '3.87%', en: '3.87%' },
		labelMaxWidth: { th: '90%', en: '120%' },
	},
];

const CARD_W = '38.17%';
const CARD_H = '17.61%';

const STYLES = `
@keyframes sl-pop {
  0%   { transform: scale(1); }
  35%  { transform: scale(1.12); }
  65%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
@keyframes sl-cont-pop {
  0%   { transform: scale(1); }
  35%  { transform: scale(1.07); }
  65%  { transform: scale(0.96); }
  100% { transform: scale(1); }
}
@keyframes sl-text-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-5px); }
}
@keyframes sl-text-pop {
  0%   { transform: scale(1)    translateY(0px); }
  30%  { transform: scale(1.18) translateY(-4px); }
  60%  { transform: scale(0.93) translateY(1px); }
  80%  { transform: scale(1.06) translateY(-1px); }
  100% { transform: scale(1)    translateY(0px); }
}
`;

export function SelectLocation({
	lang,
	onToggleLang,
	onBack,
	onComplete,
}: {
	lang: Lang;
	character: 'boy' | 'girl';
	onToggleLang: () => void;
	onBack: () => void;
	onComplete: (locationId: string) => void;
}) {
	const [selected, setSelected] = useState<LocationId | null>(null);
	const [poppingId, setPoppingId] = useState<LocationId | null>(null);
	const [textPoppingId, setTextPoppingId] = useState<LocationId | null>(null);
	const [contPop, setContPop] = useState(false);

	const handleSelect = (id: LocationId) => {
		setSelected(id);
		setPoppingId(id);
		setTextPoppingId(id);
	};

	const handleContinue = () => {
		if (!selected) return;
		setContPop(true);
		setTimeout(() => onComplete(selected), 180);
	};

	return (
		<>
			<style>{STYLES}</style>

			<img
				src={A.bg}
				alt=""
				className="absolute inset-0 w-full h-full select-none pointer-events-none"
				style={{ objectFit: 'fill' }}
			/>

			<LangToggleButton lang={lang} onToggle={onToggleLang} />

			{LOCATIONS.map((loc) => (
				<button
					key={loc.id}
					onClick={() => handleSelect(loc.id)}
					onAnimationEnd={() => setPoppingId(null)}
					className="absolute p-0 bg-transparent border-0 cursor-pointer"
					style={{
						left: loc.left,
						top: loc.top,
						width: CARD_W,
						height: CARD_H,
						animation: poppingId === loc.id ? 'sl-pop 0.4s ease-out both' : undefined,
					}}
					aria-label={loc.ariaLabel}
				>
					<img
						src={loc.img}
						alt=""
						className="w-full h-full select-none pointer-events-none"
						style={{
							borderRadius: '50%',
							objectFit: 'cover',
							boxShadow:
								selected === loc.id
									? '0 0 0 4px #fff, 0 0 0 8px #4db6e8'
									: '0 0 0 3px rgba(255,255,255,0.7)',
							transition: 'box-shadow 0.25s ease',
						}}
					/>
				</button>
			))}

			{LOCATIONS.map((loc, i) => (
				<div
					key={`text-${loc.id}`}
					className="absolute select-none pointer-events-none"
					style={{
						left: loc.labelCenterX[lang],
						top: loc.labelTop[lang],
						transform: 'translateX(-50%)',
					}}
				>
					<img
						src={loc.textImg[lang]}
						alt={loc.ariaLabel}
						onAnimationEnd={(e) => {
							if (e.animationName === 'sl-text-pop') setTextPoppingId(null);
						}}
						style={{
							height: loc.labelHeight[lang],
							width: 'auto',
							maxWidth: loc.labelMaxWidth[lang],
							display: 'block',
							animation:
								textPoppingId === loc.id
									? 'sl-text-pop 0.45s ease-out both'
									: `sl-text-float 2.8s ease-in-out ${i * 0.35}s infinite`,
						}}
					/>
				</div>
			))}

			<GoBackButton
				lang={lang}
				onBack={onBack}
				style={{ left: '2%', top: '78%', width: '35%', height: '14.32%' }}
			/>

			<button
				onClick={handleContinue}
				onAnimationEnd={() => setContPop(false)}
				className="absolute z-10 p-0 bg-transparent border-0"
				style={{
					right: '2%',
					top: '78%',
					width: '35%',
					height: '14.32%',
					cursor: !selected ? 'default' : 'pointer',
					opacity: !selected ? 0.45 : 1,
					transition: 'opacity 0.3s ease',
					animation: contPop ? 'sl-cont-pop 0.35s ease-out both' : undefined,
				}}
				aria-label={lang === 'th' ? 'ไปกันต่อ' : 'Continue'}
			>
				<img
					src={A.cont}
					alt=""
					className="w-full h-full select-none pointer-events-none"
					style={{ objectFit: 'contain', objectPosition: 'right bottom' }}
				/>
			</button>
		</>
	);
}
