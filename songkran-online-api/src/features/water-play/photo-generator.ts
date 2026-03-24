import { Resvg } from '@resvg/resvg-js';
import { existsSync } from 'fs';
import { join } from 'path';
import axios from 'axios';

// ─── Constants ──────────────────────────────────────────────────────────────

const W = 393;
const H = 677;

const SCENES: Record<string, string> = {
	arun: '/assets/playsongkran/scenes/arun-bg.png',
	phakeaw: '/assets/playsongkran/scenes/phakeaw-bg.png',
	yaksuwan: '/assets/playsongkran/scenes/yaksuwan-bg.png',
	saochingcha: '/assets/playsongkran/scenes/saochingcha-bg.png',
};

const CHAR_IMG: Record<string, string> = {
	boy: '/assets/playsongkran/boy-player.png',
	girl: '/assets/playsongkran/women-player.png',
};

const LOCATION_NAMES: Record<string, { th: string; en: string }> = {
	arun: { th: 'วัดอรุณราชวราราม', en: 'Wat Arun' },
	phakeaw: { th: 'วัดพระแก้ว', en: 'Wat Phra Kaew' },
	yaksuwan: { th: 'วัดยักษ์สุวรรณ', en: 'Wat Yak Suwan' },
	saochingcha: { th: 'เสาชิงช้า', en: 'Sao Chingcha' },
};

// ─── Caches ─────────────────────────────────────────────────────────────────

const imageCache = new Map<string, string>();

// ─── Font file paths ────────────────────────────────────────────────────────

const FONTS_DIR = join(process.cwd(), 'assets', 'fonts');
const FONT_FILE = join(FONTS_DIR, 'Sarabun-Bold.ttf');

// ─── Helpers ────────────────────────────────────────────────────────────────

async function fetchImageAsDataUri(clientUrl: string, path: string): Promise<string> {
	const cached = imageCache.get(path);
	if (cached) return cached;

	const url = `${clientUrl}${path}`;
	const response = await axios.get(url, { responseType: 'arraybuffer' });
	const contentType = response.headers['content-type'] || 'image/png';
	const base64 = Buffer.from(response.data).toString('base64');
	const dataUri = `data:${contentType};base64,${base64}`;
	imageCache.set(path, dataUri);
	return dataUri;
}

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

// ─── Main generator ─────────────────────────────────────────────────────────

export interface GeneratePhotoParams {
	faceDataUrl: string;
	locationId: string;
	character: 'boy' | 'girl';
	userName: string;
	lang: 'th' | 'en';
}

export async function generatePhoto(params: GeneratePhotoParams): Promise<Buffer> {
	const { faceDataUrl, locationId, character, userName, lang } = params;

	// CLIENT_URL may be comma-separated (for CORS). Use only the first for image fetching.
	const clientUrl = (process.env.CLIENT_URL || '').split(',')[0].trim();

	// Fetch all static images in parallel (cached after first call)
	const scenePath = SCENES[locationId] ?? SCENES.arun;
	const charPath = CHAR_IMG[character];
	const robotPath = '/assets/playsongkran/preview/aot-robot.png';
	const logoPath = '/assets/login/logo.png';

	const [sceneUri, charUri, robotUri, logoUri] = await Promise.all([
		fetchImageAsDataUri(clientUrl, scenePath),
		fetchImageAsDataUri(clientUrl, charPath),
		fetchImageAsDataUri(clientUrl, robotPath),
		fetchImageAsDataUri(clientUrl, logoPath),
	]);

	const location = LOCATION_NAMES[locationId] ?? LOCATION_NAMES.arun;

	const infoLines =
		lang === 'th'
			? [`คุณ ${userName}`, 'ได้มาร่วม น้ำสงกรานต์', `ที่${location.th}`]
			: [userName, 'joined Songkran water play', `at ${location.en}`];

	const bannerLines =
		lang === 'th'
			? ['ท่าอากาศยานสุวรรณภูมิขอเชิญทุกท่าน', 'ร่วมสนุกเทศกาลสงกรานต์', 'สาดสุขแบบไทยสไตล์ร่วมสมัย']
			: [
				'Suvarnabhumi Airport',
				'invites everyone to join Songkran Festival',
				'Splash happiness Thai style',
			];

	// ── Build SVG ────────────────────────────────────────────────────────────

	const faceSection = faceDataUrl
		? `
		<defs>
			<clipPath id="face-clip">
				<circle cx="310" cy="319" r="54"/>
			</clipPath>
		</defs>
		<image href="${faceDataUrl}" x="256" y="265" width="108" height="108"
		       preserveAspectRatio="xMidYMid slice" clip-path="url(#face-clip)"/>
		<circle cx="310" cy="319" r="55" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="3"/>
		`
		: '';

	// Banner: y=597, h=80 → 3 lines, font-size 14 (Sarabun renders wider than SF Pro)
	// line spacing 18px, total 3×18=54, padding-top = (80-54)/2 = 13 → first baseline at 597+13+14=624
	const bY = [624, 642, 660];

	const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

	<!-- Scene background -->
	<image href="${sceneUri}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none"/>

	<!-- Robot -->
	<image href="${robotUri}" x="-12" y="462" width="238" height="250" preserveAspectRatio="xMidYMin meet"/>

	<!-- Character -->
	<image href="${charUri}" x="163" y="208" width="276" height="494" preserveAspectRatio="xMidYMax meet"/>

	${faceSection}

	<!-- Info text box -->
	<rect x="13" y="340" width="205" height="110" rx="20" fill="rgba(0,85,165,0.70)"/>
	<text x="115.5" y="377" text-anchor="middle" font-family="Sarabun" font-weight="700" font-size="${lang === 'th' ? 14 : 15}" letter-spacing="${lang === 'th' ? 0.5 : 0}" fill="white">${escapeXml(infoLines[0])}</text>
	<text x="115.5" y="395" text-anchor="middle" font-family="Sarabun" font-weight="700" font-size="${lang === 'th' ? 14 : 15}" letter-spacing="${lang === 'th' ? 0.5 : 0}" fill="white">${escapeXml(infoLines[1])}</text>
	<text x="115.5" y="413" text-anchor="middle" font-family="Sarabun" font-weight="700" font-size="${lang === 'th' ? 14 : 15}" letter-spacing="${lang === 'th' ? 0.5 : 0}" fill="white">${escapeXml(infoLines[2])}</text>

	<!-- Banner -->
	<rect x="0" y="597" width="${W}" height="80" fill="#0055A5"/>
	<text x="377" y="${bY[0]}" text-anchor="end" font-family="Sarabun" font-weight="700" font-size="${lang === 'th' ? 14 : 15}" letter-spacing="${lang === 'th' ? 0.5 : 0}" fill="white">${escapeXml(bannerLines[0])}</text>
	<text x="377" y="${bY[1]}" text-anchor="end" font-family="Sarabun" font-weight="700" font-size="${lang === 'th' ? 14 : 15}" letter-spacing="${lang === 'th' ? 0.5 : 0}" fill="white">${escapeXml(bannerLines[1])}</text>
	<text x="377" y="${bY[2]}" text-anchor="end" font-family="Sarabun" font-weight="700" font-size="${lang === 'th' ? 14 : 15}" letter-spacing="${lang === 'th' ? 0.5 : 0}" fill="white">${escapeXml(bannerLines[2])}</text>

	<!-- Logo -->
	<image href="${logoUri}" x="-33" y="569" width="208" height="108" preserveAspectRatio="xMidYMid meet"/>

</svg>`;

	// ── Render SVG → PNG ─────────────────────────────────────────────────────

	if (!existsSync(FONT_FILE)) {
		console.error(`[generate-photo] Font file not found: ${FONT_FILE}`);
	} else {
		console.log(`[generate-photo] Font file OK: ${FONT_FILE}`);
	}

	const resvg = new Resvg(svg, {
		font: {
			fontFiles: [FONT_FILE],
			fontDirs: [FONTS_DIR],
			defaultFontFamily: 'Sarabun',
			loadSystemFonts: false,
		},
	});

	const pngData = resvg.render();
	return Buffer.from(pngData.asPng());
}
