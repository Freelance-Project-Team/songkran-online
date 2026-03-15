module.exports = {
	apps: [
		{
			name: 'songkran-client',
			cwd: './songkran-online-client',
			script: 'node_modules/.bin/next',
			args: 'start -p 3000',
			env: {
				NODE_ENV: 'production',
				PORT: 3000,
			},
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '512M',
			error_file: './logs/client-error.log',
			out_file: './logs/client-out.log',
			merge_logs: true,
			time: true,
		},
		{
			name: 'songkran-api',
			cwd: './songkran-online-api',
			script: 'src/server.js',
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
