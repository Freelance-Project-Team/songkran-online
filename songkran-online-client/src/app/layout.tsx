import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import AuthGuard from '@/src/shared/components/AuthGuard';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Songkran Festival AOTSVB',
	description: 'Experience the joy of Songkran with AOTSVB',
	icons: {
		icon: '/logo.png',
		apple: '/logo.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
			>
				<AuthGuard>{children}</AuthGuard>
			</body>
		</html>
	);
}
