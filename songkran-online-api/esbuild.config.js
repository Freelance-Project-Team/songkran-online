const { build } = require('esbuild');
const fs = require('fs');
const path = require('path');

function findTs(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? findTs(full) : full.endsWith('.ts') ? [full] : [];
	});
}

const files = findTs('src');

build({
	entryPoints: files,
	bundle: false,
	platform: 'node',
	target: 'node22',
	format: 'cjs',
	outdir: 'dist',
	outbase: 'src',
}).then(() => {
	console.log('Build complete');
}).catch(() => process.exit(1));
