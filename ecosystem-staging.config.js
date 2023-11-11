module.exports = {
	apps: [
		{
			name: "PLUTEOJS-Staging-Server",
			script: "./build/src/App.js",
			env: {
				NODE_ENV: "staging",
			},
		},
	],
};
