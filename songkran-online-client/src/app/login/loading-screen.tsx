'use client';

import { useEffect, useState } from 'react';

const BG       = '/assets/loading/bg.png';
const AOT_LOGO = '/assets/loading/aot-logo.png';
const CLOUD_L  = '/assets/loading/cloud-left.png';
const CLOUD_R  = '/assets/loading/cloud-right.png';
const PLANE    = '/assets/loading/plane-3.svg';

const PLANE_FRONT_MS  = 1400;
const LOGO_MS         = 2000;
const CLOUD_EXPAND_MS = 2700;
const DONE_MS         = 3900;

const STYLES = `
@keyframes ld-fly {
  0%   { transform: scale(0.22) translate(-105%, 100%); opacity: 0; }
  12%  { opacity: 1; }
  100% { transform: scale(2.2) translate(22%, -32%); opacity: 1; }
}
@keyframes ld-logo-in {
  0%   { transform: scale(0.3); opacity: 0; }
  100% { transform: scale(1);   opacity: 1; }
}
@keyframes ld-cloud-in {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
@keyframes ld-cloud-expand {
  from { transform: scale(1); }
  to   { transform: scale(5); }
}
`;

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
	const [started, setStarted]         = useState(false);
	const [planeOnTop, setPlaneOnTop]   = useState(false);
	const [showLogo, setShowLogo]       = useState(false);
	const [cloudExpand, setCloudExpand] = useState(false);

	useEffect(() => {
		const t0 = setTimeout(() => setStarted(true), 60);
		const t1 = setTimeout(() => setPlaneOnTop(true), PLANE_FRONT_MS);
		const t2 = setTimeout(() => setShowLogo(true), LOGO_MS);
		const t3 = setTimeout(() => setCloudExpand(true), CLOUD_EXPAND_MS);
		const t4 = setTimeout(onComplete, DONE_MS);
		return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
	}, [onComplete]);

	const cloudAnim = cloudExpand
		? 'ld-cloud-expand 900ms ease-in forwards'
		: started
			? 'ld-cloud-in 900ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
			: undefined;

	return (
		<div className="fixed inset-0 z-50 overflow-hidden">
			<style>{STYLES}</style>

			<img
				src={BG}
				alt=""
				className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
			/>

			<img
				src={CLOUD_R}
				alt=""
				className="absolute pointer-events-none select-none"
				style={{
					top: '-8%', right: '-15%', width: '90%', height: 'auto',
					transformOrigin: 'top right',
					zIndex: cloudExpand ? 10 : 3,
					animation: cloudAnim,
				}}
			/>

			<img
				src={CLOUD_L}
				alt=""
				className="absolute pointer-events-none select-none"
				style={{
					bottom: '-8%', left: '-14%', width: '85%', height: 'auto',
					transformOrigin: 'bottom left',
					zIndex: cloudExpand ? 10 : 3,
					animation: cloudAnim,
				}}
			/>

			<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
				<div className="relative h-full overflow-hidden" style={{ aspectRatio: '393 / 852' }}>
					<img
						src={PLANE}
						alt=""
						className="absolute"
						style={{
							left: '50%', top: '50%', width: '38%', height: 'auto',
							marginLeft: '-19%', marginTop: '-10%',
							zIndex: planeOnTop ? 4 : 2,
							opacity: 0,
							animation: started
								? `ld-fly ${CLOUD_EXPAND_MS - 60}ms cubic-bezier(0.3, 0, 0.7, 1) forwards`
								: undefined,
						}}
					/>
				</div>
			</div>

			<img
				src={AOT_LOGO}
				alt="AOT Suvarnabhumi Airport"
				className="absolute object-contain pointer-events-none select-none"
				style={{
					left: '13.49%', top: '52.11%', width: '73.03%',
					zIndex: 5,
					transformOrigin: 'center',
					opacity: 0,
					animation: showLogo
						? 'ld-logo-in 750ms cubic-bezier(0.34, 1.56, 0.64, 1) both'
						: undefined,
				}}
			/>
		</div>
	);
}
