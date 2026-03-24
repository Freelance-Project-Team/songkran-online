'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_PATHS = ['/login', '/auth/callback', '/auth/error'];

function isPublicPath(pathname: string): boolean {
	return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/')) ||
		pathname.startsWith('/share/');
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		if (isPublicPath(pathname)) {
			setChecked(true);
			return;
		}

		const token = localStorage.getItem('auth_token');
		if (!token) {
			router.replace('/login');
		} else {
			setChecked(true);
		}
	}, [pathname, router]);

	if (!checked && !isPublicPath(pathname)) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-sky-100">
				<div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	return <>{children}</>;
}
