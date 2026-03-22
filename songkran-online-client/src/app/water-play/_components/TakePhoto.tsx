'use client';

import { useRef } from 'react';
import { LangToggleButton } from '@/src/shared/ui/LangToggleButton';
import { GoBackButton } from '@/src/shared/ui/GoBackButton';

type Lang = 'th' | 'en';

const SCENES: Record<string, string> = {
	arun:        '/assets/playsongkran/scenes/arun-bg.png',
	phakeaw:     '/assets/playsongkran/scenes/phakeaw-bg.png',
	yaksuwan:    '/assets/playsongkran/scenes/yaksuwan-bg.png',
	saochingcha: '/assets/playsongkran/scenes/saochingcha-bg.png',
};

const CHAR_IMG: Record<'boy' | 'girl', string> = {
	boy:  '/assets/playsongkran/boy-player.png',
	girl: '/assets/playsongkran/women-player.png',
};

// Character: horizontally centered, bottom-anchored (leaves room for buttons)
const CHAR_POS = { left: '20%', top: '21%', width: '60%', height: '65%' };

// Face circle: derived from SelectCharacter face-{character} ratios, scaled to CHAR_POS
const FACE_POS: Record<'boy' | 'girl', { left: string; top: string; width: string; height: string }> = {
	boy:  { left: '40%', top: '29.2%', width: '22%', height: '10.15%' },
	girl: { left: '39%', top: '29.3%', width: '22%', height: '10.15%' },
};

const STYLES = `
@keyframes tp-slide-in {
  from { transform: translateY(50px); opacity: 0; }
  to   { transform: translateY(0px);  opacity: 1; }
}
@keyframes tp-pop-in {
  0%  { transform: scale(0.3); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100%{ transform: scale(1);   opacity: 1; }
}
`;

export function TakePhoto({
	lang,
	character,
	faceUrl,
	locationId,
	onToggleLang,
	onBack,
}: {
	lang: Lang;
	character: 'boy' | 'girl';
	faceUrl: string;
	locationId: string;
	onToggleLang: () => void;
	onBack: () => void;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sceneSrc  = SCENES[locationId] ?? SCENES.arun;
	const charSrc   = CHAR_IMG[character];
	const facePos   = FACE_POS[character];

	const handleSave = async () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const loadImg = (src: string): Promise<HTMLImageElement> =>
			new Promise((resolve, reject) => {
				const img = new Image();
				img.crossOrigin = 'anonymous';
				img.onload  = () => resolve(img);
				img.onerror = reject;
				img.src = src;
			});

		try {
			const [scene, char_, face] = await Promise.all([
				loadImg(sceneSrc),
				loadImg(charSrc),
				faceUrl ? loadImg(faceUrl) : Promise.resolve(null as unknown as HTMLImageElement),
			]);

			ctx.drawImage(scene, 0, 0, 393, 852);

			const cX = 0.20 * 393, cY = 0.21 * 852;
			const cW = 0.60 * 393, cH = 0.65 * 852;
			ctx.drawImage(char_, cX, cY, cW, cH);

			if (face && faceUrl) {
				const fL = parseFloat(facePos.left)   / 100;
				const fT = parseFloat(facePos.top)    / 100;
				const fW = parseFloat(facePos.width)  / 100;
				const fH = parseFloat(facePos.height) / 100;
				const fx = fL * 393, fy = fT * 852;
				const fw = fW * 393, fh = fH * 852;
				ctx.save();
				ctx.beginPath();
				ctx.ellipse(fx + fw / 2, fy + fh / 2, fw / 2, fh / 2, 0, 0, Math.PI * 2);
				ctx.clip();
				ctx.drawImage(face, fx, fy, fw, fh);
				ctx.restore();
			}

			const url = canvas.toDataURL('image/png');
			const a   = document.createElement('a');
			a.href     = url;
			a.download = 'songkran-2026.png';
			a.click();
		} catch (e) {
			console.error('Save failed', e);
		}
	};

	return (
		<>
			<style>{STYLES}</style>

			<canvas ref={canvasRef} width={393} height={852} className="hidden" />

			<img
				src={sceneSrc}
				alt=""
				className="absolute inset-0 w-full h-full select-none pointer-events-none"
				style={{ objectFit: 'fill' }}
			/>

			{/* Character + face — entrance animation on wrapper */}
			<div
				className="absolute inset-0"
				style={{ animation: 'tp-slide-in 0.65s cubic-bezier(0.34,1.56,0.64,1) both' }}
			>
				<img
					src={charSrc}
					alt=""
					className="absolute select-none pointer-events-none"
					style={{
						...CHAR_POS,
						objectFit: 'contain',
						objectPosition: 'bottom center',
					}}
				/>

				{faceUrl && (
					<div
						className="absolute overflow-hidden rounded-full"
						style={{
							left:   facePos.left,
							top:    facePos.top,
							width:  facePos.width,
							height: facePos.height,
							border: '3px solid rgba(255,255,255,0.9)',
							boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
							animation: 'tp-pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.35s both',
						}}
					>
						<img
							src={faceUrl}
							alt="face"
							className="w-full h-full object-cover select-none pointer-events-none"
						/>
					</div>
				)}
			</div>

			<LangToggleButton lang={lang} onToggle={onToggleLang} />

			<GoBackButton
				lang={lang}
				onBack={onBack}
				style={{ left: '2%', top: '84.27%', width: '35%', height: '14.32%' }}
			/>

			<button
				onClick={handleSave}
				className="absolute z-10 p-0 bg-transparent border-0 cursor-pointer"
				style={{ right: '2%', top: '84.27%', width: '35%', height: '14.32%' }}
				aria-label={lang === 'th' ? 'บันทึกรูป' : 'Save photo'}
			>
				<img
					src="/assets/playsongkran/continue.png"
					alt=""
					className="w-full h-full select-none pointer-events-none"
					style={{ objectFit: 'contain', objectPosition: 'right bottom' }}
				/>
			</button>
		</>
	);
}
