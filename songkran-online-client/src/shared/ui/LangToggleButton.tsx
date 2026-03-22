'use client';

type Lang = 'th' | 'en';

export function LangToggleButton({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
	return (
		<button
			onClick={onToggle}
			className="absolute z-10 cursor-pointer hover:scale-105 active:scale-95 transition-transform p-0 bg-transparent border-0"
			style={{ left: '82.7%', top: '6.57%', width: '11.45%', aspectRatio: '1' }}
			aria-label={lang === 'th' ? 'Switch to English' : 'Switch to Thai'}
		>
			<img
				src={lang === 'th' ? '/assets/shared/lang-en.svg' : '/assets/shared/lang-th.svg'}
				alt=""
				className="w-full h-full select-none pointer-events-none"
			/>
		</button>
	);
}
