import app from './app/index';
import { startSheetsSyncCron } from './shared/cron/sheets-sync';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	startSheetsSyncCron();
});
