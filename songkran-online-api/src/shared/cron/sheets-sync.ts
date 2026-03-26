import cron from 'node-cron';
import { ActivityService } from '../../entities/activity/service';
import { WaterPlayService } from '../../entities/water-play/service';
import { writeRange } from '../services/google-sheets.service';

const LOCATION_LABELS: Record<string, string> = {
	arun: 'วัดอรุณ',
	phakeaw: 'วัดพระแก้ว',
	yaksuwan: 'ยักษ์สุวรรณ',
	saochingcha: 'เสาชิงช้า',
};

const LOCATION_ORDER = ['arun', 'phakeaw', 'yaksuwan', 'saochingcha'];

async function getActivityCount(envKey: string): Promise<number> {
	const id = parseInt(process.env[envKey] ?? '', 10);
	if (isNaN(id)) return 0;
	const stats = await ActivityService.getStats(id);
	return stats.accessCount;
}

export async function syncToSheets() {
	const now = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
	console.log(`[sheets-sync] Starting sync at ${now}`);

	const [waterPlayStats, newSongkranCount, rodnamdumhuaCount, songnamphaCount] =
		await Promise.all([
			WaterPlayService.getStats(),
			getActivityCount('ACTIVITY_ID_NEW_SONGKRAN'),
			getActivityCount('ACTIVITY_ID_RODNAMDUMHUA'),
			getActivityCount('ACTIVITY_ID_SONGNAMPHA'),
		]);

	// ─── Sheet 1: Summary ───────────────────────────────────────────────────────
	const summaryRows: (string | number)[][] = [
		['ประเภท', 'จำนวน', 'อัปเดตล่าสุด'],
		['เล่นน้ำสงกรานต์', waterPlayStats.total, now],
		['สงกรานต์วิถีใหม่', newSongkranCount, now],
		['รดน้ำดำหัวผู้ใหญ่', rodnamdumhuaCount, now],
		['สรงน้ำพระ', songnamphaCount, now],
	];

	// ─── Sheet 2: Water Play by Location ────────────────────────────────────────
	const locationMap = new Map(
		waterPlayStats.byLocation.map((l) => [l.locationId, l.count]),
	);

	const waterPlayRows: (string | number)[][] = [
		['สถานที่', 'จำนวน', 'อัปเดตล่าสุด'],
		...LOCATION_ORDER.map((id) => [
			LOCATION_LABELS[id] ?? id,
			locationMap.get(id) ?? 0,
			now,
		]),
	];

	await Promise.all([
		writeRange('Summary!A1:C5', summaryRows),
		writeRange('WaterPlay!A1:C5', waterPlayRows),
	]);

	console.log(`[sheets-sync] Done — waterPlay=${waterPlayStats.total}, newSongkran=${newSongkranCount}, rodnamdumhua=${rodnamdumhuaCount}, songnampha=${songnamphaCount}`);
}

export function startSheetsSyncCron() {
	const schedule = process.env.SHEETS_SYNC_CRON ?? '0 * * * *'; // default: every hour

	if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
		console.log('[sheets-sync] GOOGLE_SHEETS_SPREADSHEET_ID not set — skipping cron');
		return;
	}

	// Run once on startup
	syncToSheets().catch((err) => console.error('[sheets-sync] Initial sync failed:', err));

	cron.schedule(schedule, () => {
		syncToSheets().catch((err) => console.error('[sheets-sync] Sync failed:', err));
	});

	console.log(`[sheets-sync] Cron scheduled: "${schedule}"`);
}
