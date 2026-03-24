'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMobile } from '@/src/shared/hooks/useMobile';
import { GoBackButton } from '@/src/shared/ui/GoBackButton';
import { LangToggleButton } from '@/src/shared/ui/LangToggleButton';

type Lang = 'th' | 'en';
type PourState = 'idle' | 'pouring' | 'blessed';

const A = {
	bg: '/assets/shared/bg.png',
	scene: '/assets/newsongkran/scene.png',
	bgText: '/assets/newsongkran/bg-text.png',
	text: '/assets/newsongkran/text.png',
} as const;

const STYLES = `
@keyframes ns-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
@keyframes ns-tap {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.07); }
  60%  { transform: scale(0.96); }
  80%  { transform: scale(1.03); }
  100% { transform: scale(1); }
}
@keyframes ns-ripple {
  0%   { transform: scale(0.2); opacity: 0.55; }
  100% { transform: scale(2.6); opacity: 0; }
}
@keyframes ns-card-in {
  from { opacity: 0; transform: translateY(-14px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)     scale(1); }
}
`;



function BlessingCard() {
	return (
		<div
			className="absolute z-20"
			style={{
				left: '7.89%',
				top: '20%',
				width: '85.24%',
				height: '25.82%',
				animation: 'ns-card-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
			}}
		>
			<img
				src={A.bgText}
				alt=""
				className="absolute inset-0 w-full h-full select-none pointer-events-none"
				style={{ objectFit: 'fill' }}
			/>
			<div className="absolute inset-0 flex items-center justify-center px-[6.7%] py-[10%]">
				<img
					src={A.text}
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
							animation: `ns-ripple 1s ease-out ${delay}s both`,
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
				objectFit: 'fill',
				animation:
					pourState === 'idle'
						? 'ns-float 3.5s ease-in-out infinite'
						: pourState === 'pouring'
							? 'ns-tap 0.9s ease-in-out both'
							: 'none',
			}}
		/>
	);
}

function NewSongkranScene({
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

			{pourState === 'blessed' && <BlessingCard />}

			<LangToggleButton lang={lang} onToggle={onToggleLang} />

			<div
				className="absolute"
				style={{ left: '7.89%', top: '42%', right: '1.47%', bottom: '27.57%' }}
			>
				{pourState === 'pouring' && <WaterRipple />}

				<SceneOverlay pourState={pourState} />

				{pourState === 'idle' && (
					<button
						onClick={onPour}
						className="absolute inset-0 cursor-pointer bg-transparent border-0 p-0"
						aria-label={lang === 'th' ? 'ทำบุญตักบาตร' : 'Make merit'}
					/>
				)}
			</div>

			<GoBackButton lang={lang} onBack={onBack} />
		</>
	);
}

function SceneFrame(props: Parameters<typeof NewSongkranScene>[0]) {
	return (
		<div className="h-dvh w-full flex items-center justify-center overflow-hidden bg-[#b8dff5]">
			<div className="relative overflow-hidden w-full sm:h-full sm:w-auto" style={{ aspectRatio: '393 / 852' }}>
				<NewSongkranScene {...props} />
			</div>
		</div>
	);
}

function DesktopCanvas(props: Parameters<typeof NewSongkranScene>[0]) {
	return (
		<div className="flex h-screen">
			<SceneFrame {...props} />
			<div className="w-[440px] shrink-0 flex flex-col items-center justify-center bg-white px-10 py-12 shadow-2xl overflow-y-auto z-10">
				<img src={A.text} alt="ทำบุญ" className="w-48 object-contain mb-6 select-none" />
				<p
					className="text-[#89c6ff] text-[11px] font-semibold tracking-widest text-center"
					style={{ fontFamily: 'Sarabun, sans-serif' }}
				>
					{props.pourState === 'blessed'
						? props.lang === 'th'
							? 'ขอให้มีความสุข'
							: 'Blessings to you'
						: props.lang === 'th'
							? 'แตะเพื่อทำบุญตักบาตร'
							: 'TAP TO MAKE MERIT'}
				</p>
			</div>
		</div>
	);
}

export default function NewSongkranPage() {
	const router = useRouter();
	const isMobile = useMobile();
	const [lang, setLang] = useState<Lang>('th');
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
		onToggleLang: () => setLang((l) => (l === 'th' ? 'en' : 'th')),
		onBack: () => router.push('/home'),
	};

	return isMobile ? <SceneFrame {...props} /> : <DesktopCanvas {...props} />;
}
