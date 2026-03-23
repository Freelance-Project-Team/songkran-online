'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CallbackHandler() {
	const router = useRouter();
	const params = useSearchParams();

	useEffect(() => {
		const token = params.get('token');
		if (!token) {
			router.replace('/auth/error?message=No+token+received');
			return;
		}
		localStorage.setItem('auth_token', token);

		const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
		fetch(`${API_URL}/auth/me`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((r) => r.json())
			.then((user) => {
				if (user?.name) localStorage.setItem('user_name', user.name);
				if (user?.avatar) localStorage.setItem('user_avatar', user.avatar);
			})
			.catch(() => {})
			.finally(() => router.replace('/home'));
	}, [params, router]);

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-sky-100">
			<div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
		</div>
	);
}

export default function AuthCallbackPage() {
	return (
		<Suspense>
			<CallbackHandler />
		</Suspense>
	);
}
