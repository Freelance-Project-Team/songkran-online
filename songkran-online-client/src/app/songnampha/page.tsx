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
	munk: '/assets/songnampha/munk.png',
	bgText: '/assets/songnampha/bg-text.png',
	text: '/assets/songnampha/text.png',
	flower: '/assets/songnampha/flower.png',
} as const;

const STYLES = `
@keyframes snp-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}
@keyframes snp-pour {
  0%   { transform: scale(1)    rotate(0deg); }
  20%  { transform: scale(1.1)  rotate(-8deg); }
  40%  { transform: scale(1.1)  rotate(8deg); }
  60%  { transform: scale(1.05) rotate(-4deg); }
  80%  { transform: scale(1.02) rotate(2deg); }
  100% { transform: scale(1)    rotate(0deg); }
}
@keyframes snp-ripple {
  0%   { transform: scale(0.2); opacity: 0.6; }
  100% { transform: scale(2.4); opacity: 0; }
}
@keyframes snp-card-in {
  from { opacity: 0; transform: translateY(-14px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)     scale(1); }
}
@keyframes snp-sway {
  0%, 100% { transform: rotate(-7deg); }
  50%       { transform: rotate(7deg); }
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
				animation: 'snp-card-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
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
		<div
			className="absolute inset-0 flex items-center justify-center pointer-events-none"
			style={{ top: '10%' }}
		>
			<div style={{ position: 'relative', width: '55%', aspectRatio: '1' }}>
				{[0, 0.22, 0.44].map((delay) => (
					<div
						key={delay}
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: '50%',
							border: '3px solid rgba(100, 190, 255, 0.65)',
							animation: `snp-ripple 1s ease-out ${delay}s both`,
						}}
					/>
				))}
			</div>
		</div>
	);
}

function MunkImage({ pourState }: { pourState: PourState }) {
	return (
		<img
			src={A.munk}
			alt=""
			className="w-full h-full select-none pointer-events-none"
			style={{
				objectFit: 'contain',
				objectPosition: 'bottom center',
				animation:
					pourState === 'idle'
						? 'snp-float 3s ease-in-out infinite'
						: pourState === 'pouring'
							? 'snp-pour  0.9s ease-in-out both'
							: 'none',
			}}
		/>
	);
}

function SongnamphScene({
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

			<img
				src={A.flower}
				alt=""
				className="absolute select-none pointer-events-none"
				style={{
					left: '1%',
					bottom: '18%',
					width: '23.4%',
					animation: 'snp-sway 2.4s ease-in-out infinite',
					transformOrigin: 'bottom center',
				}}
			/>
			<img
				src={A.flower}
				alt=""
				className="absolute select-none pointer-events-none"
				style={{
					right: '1%',
					bottom: '18%',
					width: '23.4%',
					transform: 'scaleX(-1)',
					animation: 'snp-sway 2.4s ease-in-out 0.6s infinite',
					transformOrigin: 'bottom center',
				}}
			/>

			<div
				className="absolute"
				style={{ left: '0', top: '38%', right: '0', bottom: '27%' }}
			>
				{pourState === 'pouring' && <WaterRipple />}

				{pourState === 'idle' ? (
					<button
						onClick={onPour}
						className="w-full h-full cursor-pointer bg-transparent border-0 p-0 active:scale-95 transition-transform duration-150"
						aria-label={lang === 'th' ? 'สรงน้ำพระ' : 'Pour water on the Buddha'}
					>
						<MunkImage pourState={pourState} />
					</button>
				) : (
					<MunkImage pourState={pourState} />
				)}
			</div>

			<GoBackButton lang={lang} onBack={onBack} />
		</>
	);
}

function SceneFrame(props: Parameters<typeof SongnamphScene>[0]) {
	return (
		<div className="h-dvh w-full flex items-center justify-center overflow-hidden bg-[#b8dff5]">
			<div className="relative overflow-hidden w-full sm:h-full sm:w-auto" style={{ aspectRatio: '393 / 852' }}>
				<SongnamphScene {...props} />
			</div>
		</div>
	);
}

function DesktopCanvas(props: Parameters<typeof SongnamphScene>[0]) {
	return (
		<div className="flex h-screen">
			<SceneFrame {...props} />
			<div className="w-[440px] shrink-0 flex flex-col items-center justify-center bg-white px-10 py-12 shadow-2xl overflow-y-auto z-10">
				<img
					src={A.text}
					alt="สรงน้ำพระ"
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
							? 'แตะเพื่อสรงน้ำพระ'
							: 'TAP TO POUR WATER'}
				</p>
			</div>
		</div>
	);
}

export default function SongnamphPage() {
	const router = useRouter();
	const isMobile = useMobile();
	const [lang, setLang] = useState<Lang>('th');
	const [pourState, setPourState] = useState<PourState>('idle');

	const handlePour = () => {
		if (pourState !== 'idle') return;
		setPourState('pouring');
		setTimeout(() => setPourState('blessed'), 950);
	};

	const props = {
		lang,
		pourState,
		onPour: handlePour,
		onToggleLang: () => setLang((l) => (l === 'th' ? 'en' : 'th')),
		onBack: () => router.push('/home'),
	};

	return isMobile ? <SceneFrame {...props} /> : <DesktopCanvas {...props} />;
}
