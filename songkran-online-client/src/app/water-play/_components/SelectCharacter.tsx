'use client';

import { useRef, useState } from 'react';
import { LangToggleButton } from '@/src/shared/ui/LangToggleButton';
import { GoBackButton } from '@/src/shared/ui/GoBackButton';

type Lang = 'th' | 'en';
type Step = 'select' | 'confirm-boy' | 'confirm-girl' | 'face-boy' | 'face-girl';

const A = {
	bg: '/assets/playsongkran/bg.png',
	boy: '/assets/playsongkran/boy-player.png',
	girl: '/assets/playsongkran/women-player.png',
	selBoy: '/assets/playsongkran/select-boy.png',
	selGirl: '/assets/playsongkran/select-girl.png',
	cont: { th: '/assets/playsongkran/go-next-th.png', en: '/assets/playsongkran/go-next-en.png' },
} as const;

const STYLES = `
@keyframes wp-arrow {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(7px); }
}
@keyframes wp-pop {
  0%   { transform: scale(1); }
  35%  { transform: scale(1.07); }
  65%  { transform: scale(0.96); }
  100% { transform: scale(1); }
}
`;

const CHAR_TRANS =
	'left 0.45s cubic-bezier(0.4,0,0.2,1), top 0.45s cubic-bezier(0.4,0,0.2,1), width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease';

type Pos = { left: string; top: string; width: string; height: string };

const BOY_POS: Record<Exclude<Step, 'face-girl'>, Pos> = {
	select: { left: '0%', top: '32.51%', width: '57.76%', height: '47.77%' },
	'confirm-boy': { left: '-3.82%', top: '23%', width: '80.41%', height: '66.32%' },
	'confirm-girl': { left: '7.38%', top: '42.02%', width: '34.86%', height: '28.76%' },
	'face-boy': { left: '0.51%', top: '17.49%', width: '100%', height: '82.51%' },
};

const GIRL_POS: Record<Exclude<Step, 'face-boy'>, Pos> = {
	select: { left: '41.22%', top: '32.51%', width: '57.76%', height: '47.77%' },
	'confirm-boy': { left: '55.47%', top: '41.20%', width: '36.64%', height: '30.28%' },
	'confirm-girl': { left: '21.88%', top: '23%', width: '81.68%', height: '67.61%' },
	'face-girl': { left: '0%', top: '16.43%', width: '99.24%', height: '82.16%' },
};

const FACE_POS: Record<'face-boy' | 'face-girl', { left: string; top: string }> = {
	'face-boy': { left: '34.1%', top: '27.93%' },
	'face-girl': { left: '31.81%', top: '26.88%' },
};

export function SelectCharacter({
	lang,
	onToggleLang,
	onBack,
	onComplete,
}: {
	lang: Lang;
	onToggleLang: () => void;
	onBack: () => void;
	onComplete: (character: 'boy' | 'girl', faceUrl: string) => void;
}) {
	const [step, setStep] = useState<Step>('select');
	const [faceUrl, setFaceUrl] = useState<string | null>(null);
	const [contPop, setContPop] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const isFace = step === 'face-boy' || step === 'face-girl';

	const handleBoyClick = () => {
		if (step === 'select' || step === 'confirm-girl') setStep('confirm-boy');
		else if (step === 'confirm-boy') setStep('face-boy');
	};

	const handleGirlClick = () => {
		if (step === 'select' || step === 'confirm-boy') setStep('confirm-girl');
		else if (step === 'confirm-girl') setStep('face-girl');
	};

	const handleContinue = () => {
		if (step === 'select') return;
		setContPop(true);
		if (step === 'confirm-boy') setTimeout(() => setStep('face-boy'), 180);
		else if (step === 'confirm-girl') setTimeout(() => setStep('face-girl'), 180);
		else if (isFace) {
			const character = step === 'face-boy' ? 'boy' : 'girl';
			setTimeout(() => onComplete(character, faceUrl ?? ''), 180);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setFaceUrl(URL.createObjectURL(file));
	};

	const boyPos =
		BOY_POS[step === 'face-girl' ? 'confirm-girl' : (step as Exclude<Step, 'face-girl'>)];
	const girlPos =
		GIRL_POS[step === 'face-boy' ? 'confirm-boy' : (step as Exclude<Step, 'face-boy'>)];
	const boyZ = step === 'confirm-boy' || step === 'face-boy' ? 3 : 2;
	const girlZ = step === 'confirm-girl' || step === 'face-girl' ? 3 : 2;

	return (
		<>
			<style>{STYLES}</style>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleFileChange}
			/>

			<img
				src={A.bg}
				alt=""
				className="absolute inset-0 w-full h-full select-none pointer-events-none"
				style={{ objectFit: 'fill' }}
			/>

			<LangToggleButton lang={lang} onToggle={onToggleLang} />

			{step === 'confirm-boy' && (
				<img
					src={A.selBoy}
					alt=""
					className="absolute select-none pointer-events-none"
					style={{
						left: '27%',
						top: '15%',
						width: '12.72%',
						height: '9.86%',
						objectFit: 'contain',
						animation: 'wp-arrow 1.1s ease-in-out infinite',
						zIndex: 4,
					}}
				/>
			)}

			{step === 'confirm-girl' && (
				<img
					src={A.selGirl}
					alt=""
					className="absolute select-none pointer-events-none"
					style={{
						left: '53%',
						top: '15%',
						width: '12.72%',
						height: '10.1%',
						objectFit: 'contain',
						animation: 'wp-arrow 1.1s ease-in-out infinite',
						zIndex: 4,
					}}
				/>
			)}

			<img
				src={A.boy}
				alt=""
				className="absolute select-none pointer-events-none"
				style={{
					...boyPos,
					objectFit: 'contain',
					objectPosition: 'bottom center',
					opacity: step === 'face-girl' ? 0 : 1,
					transition: CHAR_TRANS,
					zIndex: boyZ,
				}}
			/>

			<img
				src={A.girl}
				alt=""
				className="absolute select-none pointer-events-none"
				style={{
					...girlPos,
					objectFit: 'contain',
					objectPosition: 'bottom center',
					opacity: step === 'face-boy' ? 0 : 1,
					transition: CHAR_TRANS,
					zIndex: girlZ,
				}}
			/>

			{step === 'select' && (
				<>
					<button
						onClick={handleBoyClick}
						className="absolute bg-transparent border-0 p-0 cursor-pointer"
						style={{ left: '0%', top: '25%', width: '50%', height: '60%', zIndex: 10 }}
						aria-label="Select boy"
					/>
					<button
						onClick={handleGirlClick}
						className="absolute bg-transparent border-0 p-0 cursor-pointer"
						style={{ left: '50%', top: '25%', width: '50%', height: '60%', zIndex: 10 }}
						aria-label="Select girl"
					/>
				</>
			)}

			{step === 'confirm-boy' && (
				<>
					<button
						onClick={handleBoyClick}
						className="absolute bg-transparent border-0 p-0 cursor-pointer"
						style={{ left: '0%', top: '20%', width: '55%', height: '70%', zIndex: 10 }}
						aria-label="Confirm boy"
					/>
					<button
						onClick={handleGirlClick}
						className="absolute bg-transparent border-0 p-0 cursor-pointer"
						style={{ left: '55%', top: '35%', width: '45%', height: '40%', zIndex: 10 }}
						aria-label="Switch to girl"
					/>
				</>
			)}

			{step === 'confirm-girl' && (
				<>
					<button
						onClick={handleBoyClick}
						className="absolute bg-transparent border-0 p-0 cursor-pointer"
						style={{ left: '0%', top: '35%', width: '45%', height: '40%', zIndex: 10 }}
						aria-label="Switch to boy"
					/>
					<button
						onClick={handleGirlClick}
						className="absolute bg-transparent border-0 p-0 cursor-pointer"
						style={{ left: '45%', top: '20%', width: '55%', height: '70%', zIndex: 10 }}
						aria-label="Confirm girl"
					/>
				</>
			)}

			{isFace && (
				<button
					onClick={() => fileInputRef.current?.click()}
					className="absolute rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer bg-white"
					style={{
						left: FACE_POS[step].left,
						top: FACE_POS[step].top,
						width: '36.9%',
						height: '17.02%',
						zIndex: 5,
					}}
					aria-label={lang === 'th' ? 'เพิ่มรูปหน้า' : 'Add face photo'}
				>
					{faceUrl ? (
						<img src={faceUrl} alt="face" className="w-full h-full object-cover" />
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<span className="text-5xl font-light text-gray-400 leading-none">
								+
							</span>
						</div>
					)}
				</button>
			)}

			<GoBackButton
				lang={lang}
				onBack={onBack}
				style={{ left: '5%', top: '75%', width: '30%', height: '12%' }}
			/>

			<button
				onClick={handleContinue}
				onAnimationEnd={() => setContPop(false)}
				className="absolute z-10 p-0 bg-transparent border-0"
				style={{
					right: '5%',
					top: '75%',
					width: '30%',
					height: '12%',
					cursor: step === 'select' ? 'default' : 'pointer',
					opacity: step === 'select' ? 0.45 : 1,
					transition: 'opacity 0.3s ease',
					animation: contPop ? 'wp-pop 0.35s ease-out both' : undefined,
				}}
				aria-label={lang === 'th' ? 'ไปกันต่อ' : 'Continue'}
			>
				<img
					src={A.cont[lang]}
					alt=""
					className="w-full h-full select-none pointer-events-none"
					style={{ objectFit: 'contain', objectPosition: 'right bottom' }}
				/>
			</button>
		</>
	);
}
