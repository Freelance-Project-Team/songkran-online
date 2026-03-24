'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMobile } from '@/src/shared/hooks/useMobile';
import { GoBackButton } from '@/src/shared/ui/GoBackButton';
import { LangToggleButton } from '@/src/shared/ui/LangToggleButton';
import { useLangStore } from '@/src/shared/stores/lang-store';

type Lang = 'th' | 'en';
type PourState = 'idle' | 'pouring' | 'blessed';

const A = {
	bg: '/assets/rodnamdumhua/bg.png',
	scene: '/assets/rodnamdumhua/scene.png',
	bgText: '/assets/rodnamdumhua/bg-text.png',
	text: { th: '/assets/rodnamdumhua/text-th.png', en: '/assets/rodnamdumhua/text-en.png' },
} as const;

const STYLES = `
@keyframes bl-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
@keyframes bl-tap {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.07); }
  60%  { transform: scale(0.96); }
  80%  { transform: scale(1.03); }
  100% { transform: scale(1); }
}
@keyframes bl-ripple {
  0%   { transform: scale(0.2); opacity: 0.55; }
  100% { transform: scale(2.6); opacity: 0; }
}
@keyframes bl-card-in {
  from { opacity: 0; transform: translateY(-14px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)     scale(1); }
}
`;

function BlessingCard({ lang }: { lang: Lang }) {
	return (
		<div
			className="absolute z-20"
			style={{
				left: '7.38%',
				top: '25%',
				width: '85.24%',
				height: '19.37%',
				animation: 'bl-card-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
			}}
		>
			<img
				src={A.bgText}
				alt=""
				className="absolute inset-0 w-full h-full select-none pointer-events-none"
				style={{ objectFit: 'fill' }}
			/>
			<div className="absolute inset-0 flex items-center justify-center px-[6%] py-[8%]">
				<img
					src={A.text[lang]}
					alt="คำอวยพร"
					className="w-full h-full select-none pointer-events-none"
					style={{ objectFit: 'contain' }}
				/>
			</div>
		</div>
	);
}

function WaterRipple() {
	return (
		<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
			<div style={{ position: 'relative', width: '50%', aspectRatio: '1' }}>
				{[0, 0.22, 0.44].map((delay) => (
					<div
						key={delay}
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: '50%',
							border: '3px solid rgba(100, 190, 255, 0.6)',
							animation: `bl-ripple 1s ease-out ${delay}s both`,
						}}
					/>
				))}
			</div>
		</div>
	);
}

function SceneOverlay({ pourState }: { pourState: PourState }) {
	return (
		<img
			src={A.scene}
			alt=""
			className="absolute w-full h-full select-none pointer-events-none"
			style={{
				objectFit: 'contain',
				animation:
					pourState === 'idle'
						? 'bl-float 3.5s ease-in-out infinite'
						: pourState === 'pouring'
							? 'bl-tap 0.9s ease-in-out both'
							: 'none',
			}}
		/>
	);
}

function BlessingScene({
	lang,
	pourState,
	onPour,
	onToggleLang,
	onBack,
}: {
	lang: Lang;
	pourState: PourState;
	onPour: () => void;
	onToggleLang: () => void;
	onBack: () => void;
}) {
	return (
		<>
			<style>{STYLES}</style>

			<img
				src={A.bg}
				alt=""
				className="absolute inset-0 w-full h-full select-none pointer-events-none"
				style={{ objectFit: 'fill' }}
			/>

			{pourState === 'blessed' && <BlessingCard lang={lang} />}

			<LangToggleButton lang={lang} onToggle={onToggleLang} />

			<div
				className="absolute"
				style={{ left: '8%', top: '48%', right: '8%', bottom: '18%' }}
			>
				{pourState === 'pouring' && <WaterRipple />}

				<SceneOverlay pourState={pourState} />

				{pourState === 'idle' && (
					<button
						onClick={onPour}
						className="absolute inset-0 cursor-pointer bg-transparent border-0 p-0"
						aria-label={lang === 'th' ? 'รดน้ำดำหัว' : 'Pour water blessing'}
					/>
				)}
			</div>

			<GoBackButton lang={lang} onBack={onBack} />
		</>
	);
}

function SceneFrame(props: Parameters<typeof BlessingScene>[0]) {
	return (
		<div className="h-dvh w-full flex items-center justify-center overflow-hidden bg-[#b8dff5]">
			<div
				className="relative overflow-hidden w-full sm:h-full sm:w-auto"
				style={{ aspectRatio: '393 / 852' }}
			>
				<BlessingScene {...props} />
			</div>
		</div>
	);
}

function DesktopCanvas(props: Parameters<typeof BlessingScene>[0]) {
	return (
		<div className="flex h-screen">
			<SceneFrame {...props} />
			<div className="w-110 shrink-0 flex flex-col items-center justify-center bg-white px-10 py-12 shadow-2xl overflow-y-auto z-10">
				<img
					src={A.text[props.lang]}
					alt="รดน้ำดำหัว"
					className="w-48 object-contain mb-6 select-none"
				/>
				<p
					className="text-[#89c6ff] text-[11px] font-semibold tracking-widest text-center"
					style={{ fontFamily: 'Sarabun, sans-serif' }}
				>
					{props.pourState === 'blessed'
						? props.lang === 'th'
							? 'ขอให้มีความสุข'
							: 'Blessings to you'
						: props.lang === 'th'
							? 'แตะเพื่อรดน้ำดำหัว'
							: 'TAP TO POUR WATER'}
				</p>
			</div>
		</div>
	);
}

export default function BlessingPage() {
	const router = useRouter();
	const isMobile = useMobile();
	const { lang, toggleLang } = useLangStore();
	const [pourState, setPourState] = useState<PourState>('idle');

	const handleTap = () => {
		if (pourState !== 'idle') return;
		setPourState('pouring');
		setTimeout(() => setPourState('blessed'), 950);
	};

	const props = {
		lang,
		pourState,
		onPour: handleTap,
		onToggleLang: toggleLang,
		onBack: () => router.push('/home'),
	};

	return isMobile ? <SceneFrame {...props} /> : <DesktopCanvas {...props} />;
}
