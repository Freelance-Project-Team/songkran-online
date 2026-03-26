import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getAuth() {
	const email = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL;
	const rawKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

	if (!email || !rawKey) {
		throw new Error('Missing GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL or GOOGLE_SHEETS_PRIVATE_KEY');
	}

	const privateKey = rawKey.replace(/\\n/g, '\n');

	return new google.auth.JWT({ email, key: privateKey, scopes: SCOPES });
}

/**
 * Overwrites a range in Google Sheets with the given rows.
 * Rows is a 2D array: [[col1, col2, ...], [col1, col2, ...], ...]
 */
export async function writeRange(range: string, rows: (string | number)[][]) {
	const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
	if (!spreadsheetId) throw new Error('Missing GOOGLE_SHEETS_SPREADSHEET_ID');

	const auth = getAuth();
	const sheets = google.sheets({ version: 'v4', auth });

	await sheets.spreadsheets.values.update({
		spreadsheetId,
		range,
		valueInputOption: 'RAW',
		requestBody: { values: rows },
	});
}
