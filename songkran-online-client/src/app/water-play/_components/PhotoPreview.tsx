'use client';

import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { GoBackButton } from '@/src/shared/ui/GoBackButton';

type Lang = 'th' | 'en';

const SCENES: Record<string, string> = {
	arun: '/assets/playsongkran/scenes/arun-bg.png',
	phakeaw: '/assets/playsongkran/scenes/phakeaw-bg.png',
	yaksuwan: '/assets/playsongkran/scenes/yaksuwan-bg.png',
	saochingcha: '/assets/playsongkran/scenes/saochingcha-bg.png',
};

const CHAR_IMG: Record<'boy' | 'girl', string> = {
	boy: '/assets/playsongkran/boy-player.png',
	girl: '/assets/playsongkran/women-player.png',
};

const LOCATION_NAMES: Record<string, { th: string; en: string }> = {
	arun: { th: 'วัดอรุณราชวราราม', en: 'Wat Arun' },
	phakeaw: { th: 'วัดพระแก้ว', en: 'Wat Phra Kaew' },
	yaksuwan: { th: 'วัดยักษ์สุวรรณ', en: 'Wat Yak Suwan' },
	saochingcha: { th: 'เสาชิงช้า', en: 'Sao Chingcha' },
};

const SF =
	'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif';

const STYLES = `
@keyframes pp-slide-up {
  from { transform: translateY(28px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes pp-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes pp-pop-in {
  0%   { transform: scale(0.4); opacity: 0; }
  65%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
}
`;

const px = (n: number, axis: 'x' | 'y') => `${(n / (axis === 'x' ? 393 : 852)) * 100}%`;

function ShareIcon() {
	return (
		<svg width="30" height="30" viewBox="0 0 24 24" fill="none">
			<path d="M12 2L7.5 6.5h3V14h3V6.5h3L12 2Z" fill="white" />
			<path
				d="M4 12v8h16v-8"
				stroke="white"
				strokeWidth="2.2"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
		</svg>
	);
}

export function PhotoPreview({
	lang,
	character,
	faceUrl,
	locationId,
	onBack,
}: {
	lang: Lang;
	character: 'boy' | 'girl';
	faceUrl: string;
	locationId: string;
	photoUrl: string;
	onBack: () => void;
}) {
	const [userName, setUserName] = useState('');
	const [sharing, setSharing] = useState(false);
	const photoRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setUserName(localStorage.getItem('user_name') || '');
		}
	}, []);

	const sceneSrc = SCENES[locationId] ?? SCENES.arun;
	const charSrc = CHAR_IMG[character];
	const location = LOCATION_NAMES[locationId] ?? LOCATION_NAMES.arun;

	// Capture the rendered DOM directly — no image reloads needed
	const buildShareImage = async (): Promise<string> => {
		const el = photoRef.current;
		if (!el) throw new Error('ref not ready');

		const rect = el.getBoundingClientRect();
		const fullPng = await toPng(el, {
			cacheBust: true,
			pixelRatio: 393 / rect.width,
		});

		// Crop to banner bottom (677/852 of full height = 79.46%)
		const img = await new Promise<HTMLImageElement>((res) => {
			const i = new Image();
			i.onload = () => res(i);
			i.src = fullPng;
		});
		const cropH = Math.round(img.height * (677 / 852));
		const out = document.createElement('canvas');
		out.width = img.width;
		out.height = cropH;
		out.getContext('2d')!.drawImage(img, 0, 0);
		return out.toDataURL('image/png');
	};

	const handleFacebook = () => {
		window.open(
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
			'_blank'
		);
	};

	const handleLine = () => {
		const text = encodeURIComponent(
			lang === 'th'
				? `ฉันร่วมเล่นน้ำสงกรานต์ที่${location.th}! 🎉`
				: `I joined Songkran water play at ${location.en}! 🎉`
		);
		window.open(`https://line.me/R/msg/text/?${text}`, '_blank');
	};

	const handleNativeShare = async () => {
		setSharing(true);
		try {
			const url = await buildShareImage();
			if (!navigator.share) {
				const a = document.createElement('a');
				a.href = url;
				a.download = 'songkran-2026.png';
				a.click();
				return;
			}
			const blob = await fetch(url).then((r) => r.blob());
			const file = new File([blob], 'songkran-2026.png', { type: 'image/png' });
			await navigator.share({
				title: lang === 'th' ? 'สงกรานต์ 2026' : 'Songkran 2026',
				text:
					lang === 'th'
						? `ฉันร่วมเล่นน้ำสงกรานต์ที่${location.th}!`
						: `I joined Songkran at ${location.en}!`,
				files: [file],
			});
		} catch {
			/* cancelled */
		} finally {
			setSharing(false);
		}
	};

	return (
		<>
			<style>{STYLES}</style>

			{/* Photo layers captured by html-to-image */}
			<div ref={photoRef} className="absolute inset-0">
				<img
					src={sceneSrc}
					alt=""
					className="absolute inset-0 w-full h-full select-none pointer-events-none"
					style={{
						objectFit: 'fill',
						zIndex: 0,
						clipPath: `inset(0 0 ${((852 - 677) / 852) * 100}% 0)`,
					}}
				/>

				<img
					src="/assets/login/bg.png"
					alt=""
					className="absolute left-0 right-0 select-none pointer-events-none"
					style={{
						top: px(677, 'y'),
						bottom: 0,
						width: '100%',
						height: px(852 - 677, 'y'),
						objectFit: 'cover',
						objectPosition: 'bottom center',
						zIndex: 0,
					}}
				/>

				<img
					src="/assets/playsongkran/preview/aot-robot.png"
					alt=""
					className="absolute select-none pointer-events-none"
					style={{
						left: px(-12, 'x'),
						top: px(462, 'y'),
						width: px(238, 'x'),
						height: 'auto',
						zIndex: 1,
						animation: 'pp-slide-up 0.55s ease-out 0.1s both',
					}}
				/>

				<img
					src={charSrc}
					alt=""
					className="absolute select-none pointer-events-none"
					style={{
						left: px(163, 'x'),
						top: px(208, 'y'),
						width: px(276, 'x'),
						height: px(494, 'y'),
						objectFit: 'contain',
						objectPosition: 'bottom center',
						zIndex: 2,
						animation: 'pp-slide-up 0.55s ease-out both',
					}}
				/>

				{faceUrl && (
					<div
						className="absolute overflow-hidden rounded-full"
						style={{
							left: px(256, 'x'),
							top: px(265, 'y'),
							width: px(108, 'x'),
							height: px(108, 'y'),
							border: '3px solid rgba(255,255,255,0.9)',
							boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
							zIndex: 3,
							animation: 'pp-pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.25s both',
						}}
					>
						<img
							src={faceUrl}
							alt="face"
							className="w-full h-full object-cover select-none"
						/>
					</div>
				)}

				<div
					className="absolute flex flex-col items-center justify-center text-center"
					style={{
						left: px(13, 'x'),
						top: px(340, 'y'),
						width: px(205, 'x'),
						height: px(110, 'y'),
						background: 'rgba(0,85,165,0.70)',
						borderRadius: '20px',
						padding: '0 10px',
						zIndex: 4,
						fontFamily: SF,
						animation: 'pp-fade-in 0.45s ease-out 0.15s both',
					}}
				>
					<p
						className="text-white leading-snug"
						style={{ fontSize: 'clamp(12px, 2.1vh, 18px)', fontWeight: 700 }}
					>
						{lang === 'th' ? `คุณ ${userName}` : userName}
					</p>
					<p
						className="text-white leading-snug"
						style={{ fontSize: 'clamp(12px, 2.1vh, 18px)', fontWeight: 700 }}
					>
						{lang === 'th' ? 'ได้มาร่วมเล่นน้ำสงกรานต์' : 'joined Songkran'}
					</p>
					<p
						className="text-white leading-snug"
						style={{ fontSize: 'clamp(12px, 2.1vh, 18px)', fontWeight: 700 }}
					>
						{lang === 'th' ? `ที่${location.th}` : `at ${location.en}`}
					</p>
				</div>

				<div
					className="absolute flex items-center justify-end"
					style={{
						left: 0,
						right: 0,
						top: px(597, 'y'),
						height: px(80, 'y'),
						background: '#0055A5',
						paddingRight: '4%',
						zIndex: 5,
						animation: 'pp-slide-up 0.45s ease-out 0.2s both',
					}}
				>
					<p
						className="text-white text-right"
						style={{
							fontFamily: SF,
							fontSize: '17px',
							fontWeight: 700,
							lineHeight: '22px',
						}}
					>
						{lang === 'th' ? (
							<>
								ท่าอากาศสุวรรณภูมิขอเชิญทุกท่าน
								<br />
								ร่วมสนุกเทศกาลสงกรานต์
								<br />
								สาดสุขแบบไทยสไตล์ร่วมสมัย
							</>
						) : (
							<>
								Suvarnabhumi Airport invites everyone
								<br />
								to join Songkran Festival
								<br />
								Splash happiness Thai style
							</>
						)}
					</p>
				</div>

				<img
					src="/assets/login/logo.png"
					alt="Songkran Festival 2026"
					className="absolute select-none pointer-events-none"
					style={{
						left: px(-33, 'x'),
						top: px(569, 'y'),
						width: px(208, 'x'),
						height: 'auto',
						zIndex: 6,
						animation: 'pp-fade-in 0.5s ease-out 0.3s both',
					}}
				/>
			</div>

			{/* Share buttons — outside photo ref, not included in export */}
			<button
				onClick={handleFacebook}
				className="absolute overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-transform"
				style={{
					left: '38%',
					top: '80.5%',
					width: px(50, 'x'),
					height: px(50, 'y'),
					borderRadius: '14px',
					boxShadow: '0 0 0.563px rgba(0,0,0,0.3), 0 1.125px 16.875px rgba(0,0,0,0.08)',
					zIndex: 7,
					animation: 'pp-pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.35s both',
					padding: 0,
					border: 0,
					background: 'transparent',
				}}
				aria-label="Share on Facebook"
			>
				<img
					src="/assets/login/facebook.jpg"
					alt=""
					className="w-full h-full object-cover"
				/>
			</button>

			<button
				onClick={handleLine}
				className="absolute overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-transform"
				style={{
					left: '53%',
					top: '80.5%',
					width: px(50, 'x'),
					height: px(50, 'y'),
					borderRadius: '14px',
					zIndex: 7,
					animation: 'pp-pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.38s both',
					padding: 0,
					border: 0,
				}}
				aria-label="Share on LINE"
			>
				<img
					src="/assets/login/line.png"
					alt=""
					className="absolute max-w-none"
					style={{ height: '144.26%', left: '-26.02%', top: '-22.13%', width: '286.43%' }}
				/>
			</button>

			<button
				onClick={handleNativeShare}
				disabled={sharing}
				className="absolute flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
				style={{
					left: '68%',
					top: '80.5%',
					width: px(50, 'x'),
					height: px(50, 'y'),
					borderRadius: '14px',
					background: '#0055A5',
					zIndex: 7,
					opacity: sharing ? 0.6 : 1,
					animation: 'pp-pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.41s both',
					padding: 0,
					border: 0,
				}}
				aria-label={lang === 'th' ? 'แชร์' : 'Share'}
			>
				{sharing ? (
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						className="animate-spin"
					>
						<circle
							cx="12"
							cy="12"
							r="10"
							stroke="white"
							strokeWidth="2.5"
							strokeDasharray="32"
							strokeDashoffset="12"
							strokeLinecap="round"
						/>
					</svg>
				) : (
					<ShareIcon />
				)}
			</button>

			<GoBackButton
				lang={lang}
				onBack={onBack}
				style={{
					left: '4%',
					top: '79%',
					width: px(115, 'x'),
					height: px(93, 'y'),
					zIndex: 7,
				}}
			/>
		</>
	);
}
