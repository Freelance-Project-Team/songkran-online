'use client';

import { useEffect, useState } from 'react';

export function useMobile(breakpoint = 1024): boolean {
	const [isMobile, setIsMobile] = useState(true);

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
		setIsMobile(mql.matches);

		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	}, [breakpoint]);

	return isMobile;
}

/**
 * Returns a CSS transform scale so that a fixed-size design canvas (default 393×852)
 * fills the entire viewport — equivalent to object-fit: cover.
 * The design always fills edge-to-edge; content that exceeds the viewport is clipped.
 * Defaults to 1 on the server.
 */
export function useDesignScale(designWidth = 393, designHeight = 852): number {
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const update = () => {
			setScale(Math.max(
				window.innerWidth / designWidth,
				window.innerHeight / designHeight,
			));
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, [designWidth, designHeight]);

	return scale;
}
