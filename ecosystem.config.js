module.exports = {
	apps: [
		{
			name: 'songkran-api',
			cwd: './songkran-online-api',
			script: 'dist/server.js',
			env: {
				NODE_ENV: 'production',
				PORT: 4000,
			},
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '512M',
			error_file: './logs/api-error.log',
			out_file: './logs/api-out.log',
			merge_logs: true,
			time: true,
		},
	],
};
