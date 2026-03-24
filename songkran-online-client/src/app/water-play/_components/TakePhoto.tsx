'use client';

import { useRef, useState, useCallback } from 'react';
import { GoBackButton } from '@/src/shared/ui/GoBackButton';

type Lang = 'th' | 'en';

const SCENES: Record<string, string> = {
	arun: '/assets/playsongkran/scenes/arun-bg.png',
	phakeaw: '/assets/playsongkran/scenes/phakeaw-bg.png',
	airport: '/assets/playsongkran/scenes/airport-bg.png',
	saochingcha: '/assets/playsongkran/scenes/saochingcha-bg.png',
};

const CHAR_IMG: Record<'boy' | 'girl', string> = {
	boy: '/assets/playsongkran/boy-player.png',
	girl: '/assets/playsongkran/women-player.png',
};

const CHAR_POS = { left: '20%', top: '21%', width: '60%', height: '65%' };

const FACE_POS: Record<
	'boy' | 'girl',
	{ left: string; top: string; width: string; height: string }
> = {
	boy: { left: '40%', top: '29.2%', width: '22%', height: '10.15%' },
	girl: { left: '39%', top: '29.3%', width: '22%', height: '10.15%' },
};

type GunItem = {
	id: number;
	side: 'left' | 'right';
	// position in % of container
	x: number;
	y: number;
	// random size in % of container width
	size: number;
	hiding: boolean;
};

let gunIdSeq = 0;

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
@keyframes tp-gun-pop {
  0%   { transform: translate(-50%, -50%) scale(0);    opacity: 0; }
  55%  { transform: translate(-50%, -50%) scale(1.18); opacity: 1; }
  75%  { transform: translate(-50%, -50%) scale(0.9);  opacity: 1; }
  88%  { transform: translate(-50%, -50%) scale(1.06); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1);    opacity: 1; }
}
@keyframes tp-gun-hide {
  from { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
  to   { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
}
@keyframes tp-cam-wiggle {
  0%   { transform: scale(1)    rotate(0deg); }
  15%  { transform: scale(1.12) rotate(-10deg); }
  35%  { transform: scale(1.15) rotate(9deg); }
  55%  { transform: scale(1.08) rotate(-5deg); }
  75%  { transform: scale(1.03) rotate(2deg); }
  100% { transform: scale(1)    rotate(0deg); }
}
`;

type CamState = 'cam1' | 'cam2';

export function TakePhoto({
	lang,
	character,
	faceUrl,
	locationId,
	onBack,
	onPhotoTaken,
}: {
	lang: Lang;
	character: 'boy' | 'girl';
	faceUrl: string;
	locationId: string;
	onToggleLang: () => void;
	onBack: () => void;
	onPhotoTaken: (photoUrl: string) => void;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

	const sceneSrc = SCENES[locationId] ?? SCENES.arun;
	const charSrc = CHAR_IMG[character];
	const facePos = FACE_POS[character];

	const [camState, setCamState] = useState<CamState>('cam1');
	const [camAnim, setCamAnim] = useState(false);
	const [guns, setGuns] = useState<GunItem[]>([]);

	// --- Tap on scene → spawn water gun at click position ---
	const handleSceneTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const xPct = ((e.clientX - rect.left) / rect.width) * 100;
		const yPct = ((e.clientY - rect.top) / rect.height) * 100;
		const side = xPct < 50 ? 'left' : 'right';

		// random size between 35% and 58% of container width
		const size = 35 + Math.random() * 23;

		const id = ++gunIdSeq;
		const newGun: GunItem = { id, side, x: xPct, y: yPct, size, hiding: false };

		setGuns((prev) => [...prev, newGun]);

		// Auto-hide after 1.8s
		const t = setTimeout(() => {
			setGuns((prev) => prev.map((g) => (g.id === id ? { ...g, hiding: true } : g)));
			// Remove after hide animation
			const t2 = setTimeout(() => {
				setGuns((prev) => prev.filter((g) => g.id !== id));
				timersRef.current.delete(id);
			}, 350);
			timersRef.current.set(id, t2);
		}, 1800);
		timersRef.current.set(id, t);
	}, []);

	// --- Camera button ---
	const handleCamera = async () => {
		if (camAnim) return;
		setCamState('cam2');
		setCamAnim(true);
		await savePhoto();
		setTimeout(() => {
			setCamState('cam1');
			setCamAnim(false);
		}, 550);
	};

	const savePhoto = async () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/water-play/log`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify({ character, locationId }),
		}).catch(() => {});

		const loadImg = (src: string): Promise<HTMLImageElement> =>
			new Promise((resolve, reject) => {
				const img = new Image();
				img.crossOrigin = 'anonymous';
				img.onload = () => resolve(img);
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
			ctx.drawImage(char_, 0.2 * 393, 0.21 * 852, 0.6 * 393, 0.65 * 852);

			if (face && faceUrl) {
				const fL = parseFloat(facePos.left) / 100;
				const fT = parseFloat(facePos.top) / 100;
				const fW = parseFloat(facePos.width) / 100;
				const fH = parseFloat(facePos.height) / 100;
				const fx = fL * 393,
					fy = fT * 852;
				const fw = fW * 393,
					fh = fH * 852;
				ctx.save();
				ctx.beginPath();
				ctx.ellipse(fx + fw / 2, fy + fh / 2, fw / 2, fh / 2, 0, 0, Math.PI * 2);
				ctx.clip();
				ctx.drawImage(face, fx, fy, fw, fh);
				ctx.restore();
			}

			const url = canvas.toDataURL('image/png');
			onPhotoTaken(url);
		} catch (e) {
			console.error('Save failed', e);
		}
	};

	return (
		<>
			<style>{STYLES}</style>
			<canvas ref={canvasRef} width={393} height={852} className="hidden" />

			{/* Scene background */}
			<img
				src={sceneSrc}
				alt=""
				className="absolute inset-0 w-full h-full select-none pointer-events-none"
				style={{ objectFit: 'fill' }}
			/>

			{/* Tap zone */}
			<div className="absolute inset-0" style={{ zIndex: 1 }} onClick={handleSceneTap} />

			{/* Character + face */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					zIndex: 2,
					animation: 'tp-slide-in 0.65s cubic-bezier(0.34,1.56,0.64,1) both',
				}}
			>
				<img
					src={charSrc}
					alt=""
					className="absolute select-none"
					style={{ ...CHAR_POS, objectFit: 'contain', objectPosition: 'bottom center' }}
				/>
				{faceUrl && (
					<div
						className="absolute overflow-hidden rounded-full"
						style={{
							left: facePos.left,
							top: facePos.top,
							width: facePos.width,
							height: facePos.height,
							border: '3px solid rgba(255,255,255,0.9)',
							boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
							animation: 'tp-pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.35s both',
						}}
					>
						<img
							src={faceUrl}
							alt="face"
							className="w-full h-full object-cover select-none"
						/>
					</div>
				)}
			</div>

			{/* Water guns — rendered at tap position */}
			{guns.map((gun) => (
				<img
					key={gun.id}
					src={`/assets/playsongkran/scenes/water-gun-${gun.side}.png`}
					alt=""
					className="absolute select-none pointer-events-none"
					style={{
						left: `${gun.x}%`,
						top: `${gun.y}%`,
						width: `${gun.size}%`,
						height: 'auto',
						zIndex: 4,
						animation: gun.hiding
							? 'tp-gun-hide 0.35s ease-in both'
							: 'tp-gun-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
					}}
				/>
			))}

			{/* Bottom buttons */}
			<div
				className="absolute inset-x-0"
				style={{ bottom: '10.2%', height: '15%', zIndex: 10 }}
			>
				<GoBackButton
					lang={lang}
					onBack={onBack}
					style={{ left: '2%', top: '0%', width: '35%', height: '100%' }}
				/>
				<button
					onClick={handleCamera}
					className="absolute p-0 bg-transparent border-0 cursor-pointer"
					style={{ right: '4.8%', top: '10%', width: '20.4%', height: '80%' }}
					aria-label="ถ่ายรูป"
				>
					<img
						src={`/assets/playsongkran/scenes/camera-${camState === 'cam1' ? '1' : '2'}.png`}
						alt=""
						className="w-full h-full object-contain select-none pointer-events-none"
						style={{
							animation: camAnim ? 'tp-cam-wiggle 0.55s ease-out both' : undefined,
						}}
					/>
				</button>
			</div>
		</>
	);
}
