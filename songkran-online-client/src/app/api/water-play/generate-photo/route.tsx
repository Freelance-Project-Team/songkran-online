import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';

// ─── Constants ──────────────────────────────────────────────────────────────

const W = 393;
const VISIBLE_H = 677;
const FULL_H = 852;

const SCENES: Record<string, string> = {
	arun: '/assets/playsongkran/scenes/arun-bg.png',
	phakeaw: '/assets/playsongkran/scenes/phakeaw-bg.png',
	airport: '/assets/playsongkran/scenes/airport-bg.png',
	saochingcha: '/assets/playsongkran/scenes/saochingcha-bg.png',
};

const CHAR_IMG: Record<'boy' | 'girl', string> = {
	boy: '/assets/playsongkran/boy-player.png',
	girl: '/assets/playsongkran/women-player.png',
};

const LOCATION_NAMES: Record<string, { th: string; en: string }> = {
	arun: { th: 'วัดอรุณราชวราราม', en: 'Wat Arun' },
	phakeaw: { th: 'วัดพระแก้ว', en: 'Wat Phra Kaew' },
	airport: { th: 'สนามบินสุวรรณภูมิ', en: 'Suvarnabhumi Airport' },
	saochingcha: { th: 'เสาชิงช้า', en: 'Sao Chingcha' },
};

// ─── Origin helper ───────────────────────────────────────────────────────────

function getOrigin(req: NextRequest): string {
	// Use the request's host header to get the actual domain (e.g. custom domain)
	// instead of VERCEL_URL which points to the deployment URL behind Deployment Protection
	const host = req.headers.get('host');
	if (host) return `https://${host}`;
	if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
		return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
	return new URL(req.url).origin;
}

// ─── Font cache (read from filesystem, cached in memory) ─────────────────────

let fontThaiCache: ArrayBuffer | null = null;
let fontLatinCache: ArrayBuffer | null = null;

async function getFonts() {
	if (fontThaiCache && fontLatinCache) {
		return { fontThai: fontThaiCache, fontLatin: fontLatinCache };
	}
	const fontsDir = join(process.cwd(), 'public', 'fonts');
	const [fontThai, fontLatin] = await Promise.all([
		readFile(join(fontsDir, 'Sarabun-Bold-thai.woff2')),
		readFile(join(fontsDir, 'Sarabun-Bold-latin.woff2')),
	]);
	fontThaiCache = fontThai.buffer.slice(fontThai.byteOffset, fontThai.byteOffset + fontThai.byteLength);
	fontLatinCache = fontLatin.buffer.slice(fontLatin.byteOffset, fontLatin.byteOffset + fontLatin.byteLength);
	return { fontThai: fontThaiCache, fontLatin: fontLatinCache };
}

// ─── Route ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
	try {
		const { faceDataUrl, locationId, character, userName, lang } = (await req.json()) as {
			faceDataUrl: string;
			locationId: string;
			character: 'boy' | 'girl';
			userName: string;
			lang: 'th' | 'en';
		};

		const origin = getOrigin(req);
		const { fontThai, fontLatin } = await getFonts();

		const sceneSrc = `${origin}${SCENES[locationId] ?? SCENES.arun}`;
		const charSrc = `${origin}${CHAR_IMG[character]}`;
		const robotSrc = `${origin}/assets/playsongkran/preview/aot-robot.png`;
		const logoSrc = `${origin}/assets/login/logo.png`;

		const location = LOCATION_NAMES[locationId] ?? LOCATION_NAMES.arun;

		const infoLines =
			lang === 'th'
				? [`คุณ ${userName}`, 'ได้มาร่วมเล่นน้ำสงกรานต์', `ที่${location.th}`]
				: [userName, 'joined Songkran water play', `at ${location.en}`];

		const bannerLines =
			lang === 'th'
				? [
						'ท่าอากาศยานสุวรรณภูมิขอเชิญทุกท่าน',
						'ร่วมสนุกเทศกาลสงกรานต์',
						'สาดสุขแบบไทยสไตล์ร่วมสมัย',
					]
				: [
						'Suvarnabhumi Airport invites everyone',
						'to join Songkran Festival',
						'Splash happiness Thai style',
					];

		return new ImageResponse(
			<div
				style={{
					width: W,
					height: VISIBLE_H,
					position: 'relative',
					overflow: 'hidden',
					display: 'flex',
					fontFamily: 'Sarabun',
				}}
			>
				{/* Scene — stretched to FULL_H, clips at VISIBLE_H via overflow:hidden */}
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={sceneSrc}
					alt=""
					style={{ position: 'absolute', top: 0, left: 0, width: W, height: FULL_H }}
				/>

				{/* Robot */}
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={robotSrc}
					alt=""
					style={{ position: 'absolute', left: -12, top: 462, width: 238 }}
				/>

				{/* Character */}
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={charSrc}
					alt=""
					style={{
						position: 'absolute',
						left: 163,
						top: 208,
						width: 276,
						height: 494,
						objectFit: 'contain',
						objectPosition: 'bottom center',
					}}
				/>

				{/* Face circle */}
				{faceDataUrl && (
					<div
						style={{
							position: 'absolute',
							left: 256,
							top: 265,
							width: 108,
							height: 108,
							borderRadius: 54,
							overflow: 'hidden',
							border: '3px solid rgba(255,255,255,0.9)',
							display: 'flex',
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={faceDataUrl}
							alt=""
							style={{ width: '100%', height: '100%', objectFit: 'cover' }}
						/>
					</div>
				)}

				{/* Info text box */}
				<div
					style={{
						position: 'absolute',
						left: 13,
						top: 340,
						width: 205,
						height: 110,
						background: 'rgba(0,85,165,0.70)',
						borderRadius: 20,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 2,
					}}
				>
					{infoLines.map((line, i) => (
						<span key={i} style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
							{line}
						</span>
					))}
				</div>

				{/* Banner */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 597,
						width: W,
						height: 80,
						background: '#0055A5',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-end',
						justifyContent: 'center',
						paddingRight: 16,
					}}
				>
					{bannerLines.map((line, i) => (
						<span
							key={i}
							style={{
								color: 'white',
								fontWeight: 700,
								fontSize: 17,
								lineHeight: '22px',
							}}
						>
							{line}
						</span>
					))}
				</div>

				{/* Logo */}
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={logoSrc}
					alt=""
					style={{ position: 'absolute', left: -33, top: 569, width: 208 }}
				/>
			</div>,
			{
				width: W,
				height: VISIBLE_H,
				fonts: [
					{ name: 'Sarabun', data: fontThai, weight: 700, style: 'normal' },
					{ name: 'Sarabun', data: fontLatin, weight: 700, style: 'normal' },
				],
			}
		);
	} catch (err) {
		console.error('[generate-photo]', err);
		return new Response(
			JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
