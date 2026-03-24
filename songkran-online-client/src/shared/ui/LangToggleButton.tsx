'use client';

import { useState } from 'react';

const STYLES = `
@keyframes lt-pop {
  0%   { transform: scale(1) rotate(0deg); }
  30%  { transform: scale(1.25) rotate(-12deg); }
  60%  { transform: scale(0.9) rotate(6deg); }
  80%  { transform: scale(1.08) rotate(-3deg); }
  100% { transform: scale(1) rotate(0deg); }
}
`;

type Lang = 'th' | 'en';

export function LangToggleButton({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
	const [popping, setPopping] = useState(false);

	const handleClick = () => {
		setPopping(true);
		onToggle();
	};

	return (
		<>
			<style>{STYLES}</style>
			<button
				onClick={handleClick}
				onAnimationEnd={() => setPopping(false)}
				className="absolute z-10 cursor-pointer p-0 bg-transparent border-0"
				style={{
					left: '79%',
					top: '13%',
					width: '16.54%',
					aspectRatio: '1',
					animation: popping ? 'lt-pop 0.45s ease-out both' : undefined,
				}}
				aria-label={lang === 'th' ? 'Switch to English' : 'Switch to Thai'}
			>
				<img
					src={
						lang === 'th' ? '/assets/shared/lang-en.svg' : '/assets/shared/lang-th.svg'
					}
					alt=""
					className="w-full h-full select-none pointer-events-none"
				/>
			</button>
		</>
	);
}
