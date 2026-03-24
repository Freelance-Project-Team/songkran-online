import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

// ─── Constants ──────────────────────────────────────────────────────────────

const W = 393;
const VISIBLE_H = 677; // export height (scene + banner)
const FULL_H = 852; // scene stretched to this, then clipped

const SCENES: Record<string, string> = {
	arun: 'assets/playsongkran/scenes/arun-bg.png',
	phakeaw: 'assets/playsongkran/scenes/phakeaw-bg.png',
	yaksuwan: 'assets/playsongkran/scenes/yaksuwan-bg.png',
	saochingcha: 'assets/playsongkran/scenes/saochingcha-bg.png',
};

const CHAR_IMG: Record<'boy' | 'girl', string> = {
	boy: 'assets/playsongkran/boy-player.png',
	girl: 'assets/playsongkran/women-player.png',
};

const LOCATION_NAMES: Record<string, { th: string; en: string }> = {
	arun: { th: 'วัดอรุณราชวราราม', en: 'Wat Arun' },
	phakeaw: { th: 'วัดพระแก้ว', en: 'Wat Phra Kaew' },
	yaksuwan: { th: 'วัดยักษ์สุวรรณ', en: 'Wat Yak Suwan' },
	saochingcha: { th: 'เสาชิงช้า', en: 'Sao Chingcha' },
};

// ─── Asset helpers ───────────────────────────────────────────────────────────

/** Read a public asset and return as a base64 data URL (no HTTP round-trip). */
function readPublicAsset(relativePath: string): string {
	const fullPath = path.join(process.cwd(), 'public', relativePath);
	const data = fs.readFileSync(fullPath);
	const ext = path.extname(relativePath).slice(1).toLowerCase();
	const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
	return `data:${mime};base64,${data.toString('base64')}`;
}

// ─── Font (loaded once at module init) ──────────────────────────────────────
// SF Pro (SFNS.ttf) is Apple proprietary — read from system path on macOS.
// On Linux servers, falls back to Sarabun for Latin characters too.

function readFontBuffer(filePath: string): ArrayBuffer {
	return fs.readFileSync(filePath).buffer.slice(0) as ArrayBuffer;
}

const SF_PRO_PATH = '/System/Library/Fonts/SFNS.ttf';

const fontLatin = fs.existsSync(SF_PRO_PATH)
	? readFontBuffer(SF_PRO_PATH)
	: readFontBuffer(path.join(process.cwd(), 'public/fonts/Sarabun-Bold-latin.woff2'));

const fontThai = readFontBuffer(
	path.join(process.cwd(), 'public/fonts/Sarabun-Bold-thai.woff2')
);

// ─── Route ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
	const { faceDataUrl, locationId, character, userName, lang } = (await req.json()) as {
		faceDataUrl: string;
		locationId: string;
		character: 'boy' | 'girl';
		userName: string;
		lang: 'th' | 'en';
	};

	const [sceneSrc, charSrc, robotSrc, logoSrc] = await Promise.all([
		readPublicAsset(SCENES[locationId] ?? SCENES.arun),
		readPublicAsset(CHAR_IMG[character]),
		readPublicAsset('assets/playsongkran/preview/aot-robot.png'),
		readPublicAsset('assets/login/logo.png'),
	]);

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
		(
			<div
				style={{
					width: W,
					height: VISIBLE_H,
					position: 'relative',
					overflow: 'hidden',
					display: 'flex',
					fontFamily: 'SF Pro, Sarabun',
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
							style={{ color: 'white', fontWeight: 700, fontSize: 17, lineHeight: '22px' }}
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
			</div>
		),
		{
			width: W,
			height: VISIBLE_H,
			fonts: [
				// SF Pro for Latin/English (macOS only — falls back to Sarabun on Linux)
				{ name: 'SF Pro', data: fontLatin, weight: 700, style: 'normal' },
				// Sarabun for Thai glyphs
				{ name: 'Sarabun', data: fontThai, weight: 700, style: 'normal' },
			],
		}
	);
}
