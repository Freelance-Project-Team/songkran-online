'use client';

import React, { useState } from 'react';

const STYLES = `
@keyframes gb-lift {
  0%   { transform: translateY(0)    scale(1); }
  40%  { transform: translateY(-10px) scale(1.07); }
  65%  { transform: translateY(-7px)  scale(1.05); }
  100% { transform: translateY(-9px)  scale(1.06); }
}
`;

type Lang = 'th' | 'en';

export function GoBackButton({
	lang,
	onBack,
	style,
	noDelay,
}: {
	lang: Lang;
	onBack: () => void;
	style?: React.CSSProperties;
	noDelay?: boolean;
}) {
	const [lifting, setLifting] = useState(false);

	const handleClick = () => {
		if (noDelay) {
			onBack();
			return;
		}
		if (lifting) return;
		setLifting(true);
		setTimeout(onBack, 650);
	};

	const liftedSrc =
		lang === 'en'
			? '/assets/shared/go-back-en.webp'
			: '/assets/shared/go-back-th.webp';

	return (
		<>
			<style>{STYLES}</style>
			<button
				onClick={handleClick}
				className="absolute z-10 cursor-pointer p-0 bg-transparent border-0"
				style={{
					left: '35%',
					top: '75%',
					width: '30%',
					height: '12%',
					animation: lifting ? 'gb-lift 0.5s ease-out both' : undefined,
					...style,
				}}
				aria-label={lang === 'th' ? 'กลับหน้าหลัก' : 'Back to home'}
			>
				<img
					src="/assets/shared/go-back-default.webp"
					alt=""
					className="absolute inset-0 w-full h-full select-none pointer-events-none"
					style={{
						objectFit: 'contain',
						opacity: lifting ? 0 : 1,
						transition: 'opacity 0.2s ease',
					}}
				/>
				<img
					src={liftedSrc}
					alt=""
					className="absolute inset-0 w-full h-full select-none pointer-events-none"
					style={{
						objectFit: 'contain',
						opacity: lifting ? 1 : 0,
						transition: 'opacity 0.2s ease',
					}}
				/>
			</button>
		</>
	);
}
