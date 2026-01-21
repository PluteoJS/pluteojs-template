export interface iApiVersionDoc {
	version: string;
	status: "current" | "deprecated" | "beta";
	apiDocsPath: string;
	authDocsPath: string;
	description?: string;
}

export const apiDocsConfig: iApiVersionDoc[] = [
	{
		version: "v1",
		status: "current",
		apiDocsPath: "/api/v1/docs",
		authDocsPath: "/api/v1/auth/reference",
		description: "Current stable API version",
	},
	// Future versions added here:
	// {
	//   version: "v2",
	//   status: "beta",
	//   apiDocsPath: "/api/v2/docs",
	//   authDocsPath: "/api/v2/auth/reference",
	//   description: "Next generation API (beta)",
	// },
];
