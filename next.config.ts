import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	compiler: {
		styledComponents: true,
	},
	images: {
		remotePatterns: [
		{
			protocol: 'https',
			hostname: 'seuservidor.com',
		},
		],
		unoptimized: true,
	},
	/* config options here */
};

export default nextConfig;
