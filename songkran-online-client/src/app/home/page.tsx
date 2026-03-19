'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMobile } from '@/src/shared/hooks/useMobile';

type Lang = 'th' | 'en';

const BG = {
	bg: '/assets/login/bg.png',
	wave: '/assets/login/wave.svg',
	temple: '/assets/login/temple.png',
	flowers: '/assets/login/flowers.png',
	logo: '/assets/login/logo.png',
	pastelCity: '/assets/login/pastel-city.png',
	kite: '/assets/login/kite.png',
	bottomBar: '/assets/login/bottom-bar.png',
	childrenLeft: '/assets/login/children-left.png',
	childrenRight: '/assets/login/children-right.png',
};

interface BtnConfig {
	route: string;
	group: { left: string; top: string; width: string; height: string };
}

const BUTTONS: BtnConfig[] = [
	{
		route: '/tradition',
		group: { left: '2.54%', top: '35.21%', width: '47.97%', height: '21.24%' },
	},
	{
		route: '/prayer',
		group: { left: '54.45%', top: '35.21%', width: '39.95%', height: '21.24%' },
	},
	{
		route: '/blessing',
		group: { left: '6.62%', top: '57.75%', width: '43.97%', height: '21.24%' },
	},
	{
		route: '/water-play',
		group: { left: '52.67%', top: '57.75%', width: '43.26%', height: '21.24%' },
	},
];

const sarabun = { fontFamily: 'Sarabun, sans-serif' };

function LangToggleButton({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
	return (
		<button
			onClick={onToggle}
			className="absolute z-10 cursor-pointer hover:scale-105 active:scale-95 transition-transform p-0 bg-transparent border-0"
			style={{ left: '82.7%', top: '6.57%', width: '11.45%', aspectRatio: '1' }}
		>
			<img
				src={lang === 'th' ? '/assets/home/lang-en.svg' : '/assets/home/lang-th.svg'}
				alt={lang === 'th' ? 'Switch to English' : 'Switch to Thai'}
				className="w-full h-full select-none pointer-events-none"
			/>
		</button>
	);
}

function HomeBackground() {
	return (
		<>
			<img
				src={BG.bg}
				alt=""
				className="absolute inset-0 w-full h-full object-cover object-left pointer-events-none select-none"
			/>

			<img
				src={BG.wave}
				alt=""
				className="absolute max-w-none pointer-events-none select-none"
				style={{
					top: 'calc(50% + 69.5px)',
					left: '-6.62%',
					right: '-6.11%',
					width: '112.73%',
					aspectRatio: '355 / 240',
					transform: 'translateY(-50%)',
				}}
			/>

			<img
				src={BG.temple}
				alt=""
				className="absolute left-0 w-full pointer-events-none select-none"
				style={{ top: '-12%' }}
			/>

			<img
				src={BG.flowers}
				alt=""
				className="absolute pointer-events-none select-none"
				style={{ top: '5.92%', left: '-2.17%', width: '33.59%' }}
			/>

			<img
				src={BG.logo}
				alt="Amazing Songkran Festival 2026"
				className="absolute max-w-none pointer-events-none select-none"
				style={{ top: '10.2%', left: '-17.05%', width: '141.17%' }}
			/>

			<img
				src={BG.pastelCity}
				alt=""
				className="absolute left-0 w-full pointer-events-none select-none"
				style={{ top: '71.36%' }}
			/>

			<div
				className="absolute pointer-events-none select-none"
				style={{ top: '78.62%', left: '87.01%', right: '3.68%', bottom: '14.75%' }}
			>
				<img
					src={BG.kite}
					alt=""
					className="w-full h-full object-contain"
					style={{ transform: 'scaleX(-1)' }}
				/>
			</div>

			<div
				className="absolute left-0 right-0 bottom-0 overflow-hidden pointer-events-none select-none"
				style={{ top: '87.56%' }}
			>
				<img
					src={BG.bottomBar}
					alt=""
					className="absolute left-0 w-full max-w-none"
					style={{ height: '371.23%', top: '-271.23%' }}
				/>
			</div>

			<div
				className="absolute pointer-events-none select-none"
				style={{ top: '83.55%', left: '13.74%', right: '40.97%', bottom: '2.95%' }}
			>
				<img src={BG.childrenLeft} alt="" className="w-full h-full object-contain" />
			</div>

			<div
				className="absolute pointer-events-none select-none"
				style={{ top: '83.43%', left: '59.28%', right: '15.22%', bottom: '3.25%' }}
			>
				<img
					src={BG.childrenRight}
					alt=""
					className="w-full h-full object-contain"
					style={{ transform: 'scaleX(-1)' }}
				/>
			</div>
		</>
	);
}

function ButtonCard({
	index,
	btn,
	lang,
	onClick,
}: {
	index: number;
	btn: BtnConfig;
	lang: Lang;
	onClick: () => void;
}) {
	return (
		<div
			className="absolute cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-transform"
			style={{
				left: btn.group.left,
				top: btn.group.top,
				width: btn.group.width,
				height: btn.group.height,
			}}
			onClick={onClick}
		>
			<img
				src={`/assets/home/btn-${index + 1}-${lang}.png`}
				alt=""
				className="absolute inset-0 w-full h-full object-fill select-none pointer-events-none"
			/>
		</div>
	);
}

function MobileCanvas({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
	const router = useRouter();

	return (
		<div className="flex items-center justify-center h-screen w-full overflow-hidden bg-black">
			<div
				className="relative overflow-hidden bg-sky-200"
				style={{
					width: 'min(100vw, calc(100vh * 393 / 852))',
					height: 'min(100vh, calc(100vw * 852 / 393))',
				}}
			>
				<HomeBackground />

				<LangToggleButton lang={lang} onToggle={onToggle} />

				{BUTTONS.map((btn, i) => (
					<ButtonCard
						key={i}
						index={i}
						btn={btn}
						lang={lang}
						onClick={() => router.push(btn.route)}
					/>
				))}
			</div>
		</div>
	);
}

function DesktopCanvas({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
	const router = useRouter();

	return (
		<div className="flex h-screen">
			<div className="relative flex-1 h-screen overflow-hidden bg-sky-200 flex items-center justify-center">
				<div className="relative h-full" style={{ aspectRatio: '393 / 852' }}>
					<HomeBackground />

					<LangToggleButton lang={lang} onToggle={onToggle} />

					{BUTTONS.map((btn, i) => (
						<ButtonCard
							key={i}
							index={i}
							btn={btn}
							lang={lang}
							onClick={() => router.push(btn.route)}
						/>
					))}
				</div>
			</div>

			<div className="w-[440px] shrink-0 flex flex-col items-center justify-center bg-white px-10 py-12 shadow-2xl overflow-y-auto z-10">
				<img
					src={BG.logo}
					alt="Amazing Songkran Festival 2026"
					className="w-56 object-contain mb-6"
					style={{ position: 'static', width: '14rem', left: 'unset', top: 'unset' }}
				/>
				<p
					style={sarabun}
					className="text-[#89c6ff] text-[11px] font-semibold tracking-widest text-center"
				>
					{lang === 'th' ? 'เลือกกิจกรรมที่ต้องการ' : 'SELECT AN ACTIVITY'}
				</p>
			</div>
		</div>
	);
}

export default function HomePage() {
	const [lang, setLang] = useState<Lang>('th');
	const isMobile = useMobile();
	const toggle = () => setLang((l) => (l === 'th' ? 'en' : 'th'));

	return isMobile ? (
		<MobileCanvas lang={lang} onToggle={toggle} />
	) : (
		<DesktopCanvas lang={lang} onToggle={toggle} />
	);
}
