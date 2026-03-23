'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
	const params = useSearchParams();
	const router = useRouter();
	const message = params.get('message') || 'Something went wrong';

	return (
		<div className="fixed inset-0 flex flex-col items-center justify-center bg-sky-100 px-8 gap-6">
			<p className="text-[#4b4137] text-center text-sm">{message}</p>
			<button
				onClick={() => router.replace('/login')}
				className="bg-[#4da8fe] text-white text-sm font-semibold px-8 py-3 rounded-[15px] hover:bg-[#3a97ed] active:scale-95 transition-all cursor-pointer"
			>
				Back to Login
			</button>
		</div>
	);
}

export default function AuthErrorPage() {
	return (
		<Suspense>
			<ErrorContent />
		</Suspense>
	);
}
