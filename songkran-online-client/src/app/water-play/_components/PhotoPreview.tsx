'use client';

import { useEffect, useState } from 'react';
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

const LOCATION_NAMES: Record<string, { th: string; en: string }> = {
	arun:        { th: 'วัดอรุณราชวราราม', en: 'Wat Arun' },
	phakeaw:     { th: 'วัดพระแก้ว',       en: 'Wat Phra Kaew' },
	yaksuwan:    { th: 'วัดยักษ์สุวรรณ',    en: 'Wat Yak Suwan' },
	saochingcha: { th: 'เสาชิงช้า',         en: 'Sao Chingcha' },
};

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

const inter = 'var(--font-inter), Inter, sans-serif';

// Share icon SVG
function ShareIcon() {
	return (
		<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="18" cy="5"  r="3" fill="#0055A5" />
			<circle cx="6"  cy="12" r="3" fill="#0055A5" />
			<circle cx="18" cy="19" r="3" fill="#0055A5" />
			<line x1="8.59"  y1="13.51" x2="15.42" y2="17.49" stroke="#0055A5" strokeWidth="1.6" />
			<line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" stroke="#0055A5" strokeWidth="1.6" />
		</svg>
	);
}

export function PhotoPreview({
	lang,
	character,
	faceUrl,
	locationId,
	photoUrl,
	onBack,
	onRetake,
}: {
	lang: Lang;
	character: 'boy' | 'girl';
	faceUrl: string;
	locationId: string;
	photoUrl: string;
	onBack: () => void;
	onRetake: () => void;
}) {
	const [userName, setUserName] = useState('');

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setUserName(localStorage.getItem('user_name') || '');
		}
	}, []);

	const sceneSrc = SCENES[locationId] ?? SCENES.arun;
	const charSrc  = CHAR_IMG[character];
	const location = LOCATION_NAMES[locationId] ?? LOCATION_NAMES.arun;

	// ---------- share handlers ----------

	const handleDownload = () => {
		const a = document.createElement('a');
		a.href     = photoUrl;
		a.download = 'songkran-2026.png';
		a.click();
	};

	const handleFacebook = () => {
		const url = encodeURIComponent(window.location.href);
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
	};

	const handleLine = () => {
		const text = encodeURIComponent(
			lang === 'th'
				? `ฉันร่วมเล่นน้ำสงกรานต์ที่${location.th}! 🎉`
				: `I joined Songkran water play at ${location.en}! 🎉`,
		);
		window.open(`https://line.me/R/msg/text/?${text}`, '_blank');
	};

	const handleNativeShare = async () => {
		if (!navigator.share) { handleDownload(); return; }
		try {
			const blob = await fetch(photoUrl).then(r => r.blob());
			const file = new File([blob], 'songkran-2026.png', { type: 'image/png' });
			await navigator.share({
				title: lang === 'th' ? 'สงกรานต์ 2026' : 'Songkran 2026',
				text:  lang === 'th'
					? `ฉันร่วมเล่นน้ำสงกรานต์ที่${location.th}!`
					: `I joined Songkran at ${location.en}!`,
				files: [file],
			});
		} catch { /* cancelled */ }
	};

	// ---- layout constants (Figma 393×852 → %) ----
	// Character
	const charL = `${163 / 393 * 100}%`;
	const charT = `${208 / 852 * 100}%`;
	const charW = `${276 / 393 * 100}%`;
	const charH = `${494 / 852 * 100}%`;

	// Face — absolute on frame
	const faceL = `${256 / 393 * 100}%`;
	const faceT = `${265 / 852 * 100}%`;
	const faceW = `${108 / 393 * 100}%`;
	const faceH = `${108 / 852 * 100}%`;

	// Info card
	const cardL = `${13  / 393 * 100}%`;
	const cardT = `${340 / 852 * 100}%`;
	const cardW = `${205 / 393 * 100}%`;
	const cardH = `${110 / 852 * 100}%`;

	// Robot
	const robL = `${-12 / 393 * 100}%`;
	const robT = `${462 / 852 * 100}%`;
	const robW = `${238 / 393 * 100}%`;

	// Logo (songkran)
	const logoL = `${-33 / 393 * 100}%`;
	const logoT = `${569 / 852 * 100}%`;
	const logoW = `${208 / 393 * 100}%`;

	// Footer
	const footT = `${597 / 852 * 100}%`;
	const footH = `${80  / 852 * 100}%`;

	// Share row
	const shareL = `${103 / 393 * 100}%`;
	const shareT = `${691 / 852 * 100}%`;

	// Retake button
	const retakeL = `${141 / 393 * 100}%`;
	const retakeT = `${752 / 852 * 100}%`;
	const retakeW = `${115 / 393 * 100}%`;
	const retakeH = `${93  / 852 * 100}%`;

	// Button size (share)
	const btn50 = `${50 / 393 * 100}%`;
	const btn63 = `${63 / 393 * 100}%`;

	return (
		<>
			<style>{STYLES}</style>

			{/* ── Scene bg ── */}
			<img
				src={sceneSrc}
				alt=""
				className="absolute inset-0 w-full h-full select-none pointer-events-none"
				style={{ objectFit: 'fill', zIndex: 0 }}
			/>

			{/* ── AOT Robot (behind character) ── */}
			<img
				src="/assets/playsongkran/preview/aot-robot.png"
				alt=""
				className="absolute select-none pointer-events-none"
				style={{
					left: robL, top: robT, width: robW, height: 'auto',
					zIndex: 1,
					animation: 'pp-slide-up 0.55s ease-out 0.1s both',
				}}
			/>

			{/* ── Character ── */}
			<img
				src={charSrc}
				alt=""
				className="absolute select-none pointer-events-none"
				style={{
					left: charL, top: charT, width: charW, height: charH,
					objectFit: 'contain', objectPosition: 'bottom center',
					zIndex: 2,
					animation: 'pp-slide-up 0.55s ease-out both',
				}}
			/>

			{/* ── Face ── */}
			{faceUrl && (
				<div
					className="absolute overflow-hidden rounded-full"
					style={{
						left: faceL, top: faceT, width: faceW, height: faceH,
						border: '3px solid rgba(255,255,255,0.9)',
						boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
						zIndex: 3,
						animation: 'pp-pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.25s both',
					}}
				>
					<img src={faceUrl} alt="face" className="w-full h-full object-cover select-none" />
				</div>
			)}

			{/* ── Info card ── */}
			<div
				className="absolute flex flex-col justify-center"
				style={{
					left: cardL, top: cardT, width: cardW, height: cardH,
					background: 'rgba(0,85,165,0.70)',
					borderRadius: '20px',
					padding: '8px 14px',
					zIndex: 4,
					fontFamily: inter,
					animation: 'pp-fade-in 0.45s ease-out 0.15s both',
				}}
			>
				<p className="text-white font-extrabold leading-snug" style={{ fontSize: '16px' }}>
					{lang === 'th' ? `คุณ ${userName}` : userName}
				</p>
				<p className="text-white font-semibold leading-snug" style={{ fontSize: '13px', opacity: 0.95 }}>
					{lang === 'th' ? 'ได้มาร่วมเล่นน้ำสงกรานต์' : 'joined Songkran water play'}
				</p>
				<p className="text-white font-bold leading-snug" style={{ fontSize: '13px' }}>
					{lang === 'th' ? `ณ ${location.th}` : `at ${location.en}`}
				</p>
			</div>

			{/* ── Blue footer bar ── */}
			<div
				className="absolute flex items-center justify-end"
				style={{
					left: 0, right: 0, top: footT, height: footH,
					background: '#0055A5',
					paddingRight: '4%',
					zIndex: 5,
					animation: 'pp-slide-up 0.45s ease-out 0.2s both',
				}}
			>
				<p
					className="text-white text-right"
					style={{ fontFamily: inter, fontSize: '10px', fontWeight: 600, lineHeight: 1.65 }}
				>
					{lang === 'th' ? (
						<>ท่าอากาศยานสุวรรณภูมิขอเชิญทุกท่าน<br />ร่วมสนุกเทศกาลสงกรานต์<br />สาดสุขแบบไทยสไตล์ร่วมสมัย</>
					) : (
						<>Suvarnabhumi Airport invites everyone<br />to join the Songkran Festival<br />Splash happiness Thai contemporary style</>
					)}
				</p>
			</div>

			{/* ── Songkran logo (over footer) ── */}
			<img
				src="/assets/login/logo.png"
				alt="Songkran Festival 2026"
				className="absolute select-none pointer-events-none"
				style={{
					left: logoL, top: logoT, width: logoW, height: 'auto',
					zIndex: 6,
					animation: 'pp-fade-in 0.5s ease-out 0.3s both',
				}}
			/>

			{/* ── Share buttons row ── */}
			<div
				className="absolute flex items-center"
				style={{
					left: shareL, top: shareT,
					gap: `${10 / 393 * 100}%`,
					zIndex: 7,
					animation: 'pp-pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.35s both',
				}}
			>
				{/* Facebook */}
				<button
					onClick={handleFacebook}
					className="rounded-[14px] overflow-hidden shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
					style={{ width: btn50, paddingBottom: btn50, position: 'relative' }}
					aria-label="Share on Facebook"
				>
					<img
						src="/assets/login/facebook.jpg"
						alt="Facebook"
						className="absolute inset-0 w-full h-full object-cover"
					/>
				</button>

				{/* LINE */}
				<button
					onClick={handleLine}
					className="rounded-[14px] overflow-hidden shrink-0 relative hover:scale-105 active:scale-95 transition-transform cursor-pointer"
					style={{ width: btn50, paddingBottom: btn50, position: 'relative' }}
					aria-label="Share on LINE"
				>
					<img
						src="/assets/login/line.png"
						alt="LINE"
						className="absolute max-w-none"
						style={{ height: '144.26%', left: '-26.02%', top: '-22.13%', width: '286.43%' }}
					/>
				</button>

				{/* Native share */}
				<button
					onClick={handleNativeShare}
					className="rounded-full bg-white flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
					style={{ width: btn63, paddingBottom: btn63, position: 'relative' }}
					aria-label={lang === 'th' ? 'แชร์' : 'Share'}
				>
					<div className="absolute inset-0 flex items-center justify-center">
						<ShareIcon />
					</div>
				</button>
			</div>

			{/* ── Retake / Play again button ── */}
			<button
				onClick={onRetake}
				className="absolute cursor-pointer bg-transparent border-0 p-0 hover:scale-105 active:scale-95 transition-transform"
				style={{
					left: retakeL, top: retakeT, width: retakeW, height: retakeH,
					zIndex: 7,
					animation: 'pp-pop-in 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.45s both',
				}}
				aria-label={lang === 'th' ? 'เล่นอีกครั้ง' : 'Play again'}
			>
				<img
					src="/assets/playsongkran/continue.png"
					alt={lang === 'th' ? 'เล่นอีกครั้ง' : 'Play again'}
					className="w-full h-full object-contain select-none pointer-events-none"
				/>
			</button>

			{/* ── Go back button ── */}
			<div className="absolute inset-x-0 bottom-0" style={{ height: '15%', zIndex: 10 }}>
				<GoBackButton
					lang={lang}
					onBack={onBack}
					style={{ left: '2%', top: '0%', width: '35%', height: '100%' }}
				/>
			</div>
		</>
	);
}
