/**
 * @description
 * Environment variables used in the application
 */
const env = {
	// API Configuration
	API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3020",
	API_TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 15000),
};

export default env;
