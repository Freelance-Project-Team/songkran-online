'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMobile } from '@/src/shared/hooks/useMobile';
import { LangToggleButton } from '@/src/shared/ui/LangToggleButton';
import { useLangStore } from '@/src/shared/stores/lang-store';

type Lang = 'th' | 'en';

const BUTTONS = [
	{
		route: '/newsongkran',
		img: { th: '/assets/home/new-songkran-btn-th.webp', en: '/assets/home/new-songkran-btn-en.webp' },
		left: '2.54%',
		top: '35.21%',
		width: '48.09%',
		height: '21.24%',
	},
	{
		route: '/songnampha',
		img: { th: '/assets/home/songnampha-btn-th.webp', en: '/assets/home/songnampha-btn-en.webp' },
		left: '54.45%',
		top: '35.21%',
		width: '39.95%',
		height: '21.24%',
	},
	{
		route: '/blessing',
		img: { th: '/assets/home/rodnamdumhua-btn-th.webp', en: '/assets/home/rodnamdumhua-btn-en.webp' },
		left: '6.62%',
		top: '57.75%',
		width: '44.02%',
		height: '21.24%',
	},
	{
		route: '/water-play',
		img: { th: '/assets/home/play-water-btn-th.webp', en: '/assets/home/play-water-btn-en.webp' },
		left: '52.67%',
		top: '57.75%',
		width: '43.26%',
		height: '21.24%',
	},
] as const;

const STYLES = `
@keyframes home-select {
  0%   { transform: scale(1); }
  25%  { transform: scale(0.91); }
  55%  { transform: scale(1.06); }
  75%  { transform: scale(0.97); }
  100% { transform: scale(1); }
}
`;

function HomeScene({
	lang,
	onToggle,
	onNavigate,
}: {
	lang: Lang;
	onToggle: () => void;
	onNavigate: (route: string) => void;
}) {
	const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

	const handleClick = (route: string, i: number) => {
		if (selectedIdx !== null) return;
		setSelectedIdx(i);
		setTimeout(() => {
			onNavigate(route);
			setSelectedIdx(null);
		}, 400);
	};

	return (
		<>
			<style>{STYLES}</style>

			<img
				src="/assets/home/home-bg.webp"
				alt=""
				className="absolute inset-0 w-full h-full select-none pointer-events-none"
				style={{ objectFit: 'fill' }}
			/>

			<LangToggleButton lang={lang} onToggle={onToggle} />

			{BUTTONS.map((btn, i) => (
				<div
					key={i}
					className="absolute cursor-pointer"
					style={{
						left: btn.left,
						top: btn.top,
						width: btn.width,
						height: btn.height,
						animation:
							selectedIdx === i ? 'home-select 0.38s ease-out both' : undefined,
					}}
					onClick={() => handleClick(btn.route, i)}
				>
					<img
						src={btn.img[lang]}
						alt=""
						className="w-full h-full select-none pointer-events-none"
						style={{ objectFit: 'fill' }}
					/>
				</div>
			))}
		</>
	);
}

function SceneFrame(props: Parameters<typeof HomeScene>[0]) {
	return (
		<div className="h-dvh w-full flex items-center justify-center overflow-hidden bg-[#b8dff5]">
			<div
				className="relative overflow-hidden w-full sm:h-full sm:w-auto"
				style={{ aspectRatio: '393 / 852' }}
			>
				<HomeScene {...props} />
			</div>
		</div>
	);
}

function DesktopCanvas(props: Parameters<typeof HomeScene>[0]) {
	return (
		<div className="flex h-screen">
			<SceneFrame {...props} />
			<div className="w-110 shrink-0 flex flex-col items-center justify-center bg-white px-10 py-12 shadow-2xl overflow-y-auto z-10">
				<img
					src="/assets/login/logo.webp"
					alt="Amazing Songkran Festival 2026"
					className="w-56 object-contain mb-6 select-none"
				/>
				<p
					className="text-[#89c6ff] text-[11px] font-semibold tracking-widest text-center"
					style={{ fontFamily: 'Sarabun, sans-serif' }}
				>
					{props.lang === 'th' ? 'เลือกกิจกรรมที่ต้องการ' : 'SELECT AN ACTIVITY'}
				</p>
			</div>
		</div>
	);
}

export default function HomePage() {
	const router = useRouter();
	const { lang, toggleLang } = useLangStore();
	const isMobile = useMobile();

	const props = {
		lang,
		onToggle: toggleLang,
		onNavigate: (route: string) => router.push(route),
	};

	return isMobile ? <SceneFrame {...props} /> : <DesktopCanvas {...props} />;
}
