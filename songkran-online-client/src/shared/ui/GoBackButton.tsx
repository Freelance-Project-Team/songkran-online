'use client';

import { useState } from 'react';

const STYLES = `
@keyframes gb-lift {
  0%   { transform: translateY(0)    scale(1); }
  40%  { transform: translateY(-10px) scale(1.07); }
  65%  { transform: translateY(-7px)  scale(1.05); }
  100% { transform: translateY(-9px)  scale(1.06); }
}
`;

type Lang = 'th' | 'en';

export function GoBackButton({ lang, onBack }: { lang: Lang; onBack: () => void }) {
	const [lifting, setLifting] = useState(false);

	const handleClick = () => {
		if (lifting) return;
		setLifting(true);
		setTimeout(onBack, 650);
	};

	return (
		<>
			<style>{STYLES}</style>
			<button
				onClick={handleClick}
				className="absolute z-10 cursor-pointer p-0 bg-transparent border-0"
				style={{
					left: '30.8%', top: '83.8%', width: '38.4%', height: '14.4%',
					animation: lifting ? 'gb-lift 0.5s ease-out both' : undefined,
				}}
				aria-label={lang === 'th' ? 'กลับหน้าหลัก' : 'Back to home'}
			>
				<img
					src="/assets/shared/go-back-btn.png"
					alt=""
					className="absolute inset-0 w-full h-full select-none pointer-events-none"
					style={{
						objectFit: 'fill',
						opacity: lifting ? 0 : 1,
						transition: 'opacity 0.2s ease',
					}}
				/>
				<img
					src="/assets/shared/go-back-2-btn.png"
					alt=""
					className="absolute inset-0 w-full h-full select-none pointer-events-none"
					style={{
						objectFit: 'fill',
						opacity: lifting ? 1 : 0,
						transition: 'opacity 0.2s ease',
					}}
				/>
			</button>
		</>
	);
}
