import type {NextConfig} from "next";

const nextConfig: NextConfig = {
	// Enable transpilation of workspace packages
	transpilePackages: ["@pluteojs/api-types"],
};

export default nextConfig;
