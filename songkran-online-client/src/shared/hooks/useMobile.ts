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
