import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	outputFileTracingIncludes: {
		'/api/water-play/generate-photo': ['./public/fonts/**/*'],
	},
};

export default nextConfig;
