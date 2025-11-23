// eslint.config.mjs
import {defineConfig, globalIgnores} from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default defineConfig([
	globalIgnores(["**/build", "**/strapi-admin"]),

	{
		files: ["**/*.{js,ts,jsx,tsx}"],
		languageOptions: {
			parser: tsParser,
			sourceType: "module",
			ecmaVersion: "latest",
			parserOptions: {
				project: "./tsconfig.json",
				ecmaFeatures: {
					modules: true,
					templateStrings: true,
				},
				createDefaultProgram: true,
			},
			globals: {
				...globals.node,
			},
		},

		plugins: {
			"@typescript-eslint": tsPlugin,
			prettier: prettierPlugin,
			import: importPlugin,
		},

		settings: {
			"import/resolver": {
				typescript: {
					project: "./tsconfig.json",
				},
				node: {
					extensions: [".js", ".ts"],
				},
			},
		},

		rules: {
			// Run Prettier as an ESLint rule
			"prettier/prettier": [
				"error",
				{
					singleQuote: false,
					bracketSameLine: false,
					endOfLine: "auto",
				},
			],
			// Disable any conflicting formatting rules
			...prettierConfig.rules,

			// Enforce === and !== to avoid unexpected type coercion
			eqeqeq: ["error", "always"],

			// Always use curly braces for clarity and consistency
			curly: ["error", "all"],

			// Disallow multiple spaces (except in comments or alignment)
			"no-multi-spaces": "error",

			// Nested ternaries are hard to read — better to use if-else or helper functions
			"no-nested-ternary": "error",

			// Encourage using object shorthand: { name } instead of { name: name }
			"object-shorthand": ["error", "always"],

			// Prevent reassigning parameters — it's cleaner and safer to create a new variable
			"no-param-reassign": ["error", {props: true}],

			// Use double quotes consistently (except for template literals)
			quotes: ["error", "double", {allowTemplateLiterals: true}],

			// Always end lines with semicolons — avoids ambiguity
			semi: ["error", "always"],

			// Use tabs for indentation (helps in accessibility, screen readers, and personal preference)
			indent: ["error", "tab", {SwitchCase: 1}],

			// Prevent unnecessary tabs unless used for indentation
			"no-tabs": ["error", {allowIndentationTabs: true}],

			// We don’t need dangling commas — let Prettier handle formatting
			"comma-dangle": "off",

			// Shadowed variables are handled by TS instead of plain ESLint
			"no-shadow": "off",

			// Allow console logs — useful for backend debugging (you can later restrict in prod)
			"no-console": "off",

			// Always use parentheses with arrow functions for consistency
			"arrow-parens": ["error", "always"],

			// Use braces in arrow function bodies always — improves readability
			"arrow-body-style": ["error", "always"],

			// We’re not enforcing comment spacing through lint — optional via Prettier
			"spaced-comment": [0, "always"],

			// Import rules — don't allow extensions in import paths (except JSON)
			"import/extensions": [
				"error",
				"never",
				{
					js: "never",
					jsx: "never",
					ts: "never",
					tsx: "never",
					json: "always",
				},
			],

			// Allow named exports — don't force default exports
			"import/prefer-default-export": "off",

			// Don’t require class methods to always use `this`
			"class-methods-use-this": "off",

			// Don't use variables before they are defined (functions/classes/vars)
			"no-use-before-define": [
				"error",
				{
					functions: true,
					classes: true,
					variables: true,
				},
			],

			// Turned off because TypeScript handles undefined variable checks
			"no-undef": "off",

			// TypeScript specific rules

			// Type-aware version of `no-use-before-define`
			"@typescript-eslint/no-use-before-define": ["error"],

			// Prefer explicit return types only in specific contexts (e.g., public APIs)
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",

			// Discourage use of `any` to promote type safety
			"@typescript-eslint/no-explicit-any": [
				"error",
				{
					fixToUnknown: false,
					ignoreRestArgs: false,
				},
			],

			// TS handles unused vars better than plain ESLint
			"no-unused-vars": "off",

			// Enforce no unused variables but allow _ignored args
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					vars: "all",
					args: "after-used",
					ignoreRestSiblings: false,
					argsIgnorePattern: "next",
				},
			],

			// Don’t ban all types — we’re OK with things like `{}` in some cases
			"@typescript-eslint/ban-types": "off",

			// Enforce consistent naming — esp. for booleans and interfaces
			"@typescript-eslint/naming-convention": [
				"error",
				{selector: "variableLike", format: ["camelCase"]},
				{
					selector: "variable",
					types: ["boolean"],
					format: ["PascalCase"],
					prefix: ["is", "should", "has", "can", "did", "will"],
				},
				{
					selector: "variable",
					modifiers: ["const"],
					format: ["UPPER_CASE", "PascalCase", "camelCase"],
				},
				{selector: "function", format: ["PascalCase", "camelCase"]},
				{
					selector: "interface",
					format: ["camelCase"],
					custom: {regex: "^i[A-Z]", match: true},
				},
			],

			// Use `import type` consistently when importing only types
			"@typescript-eslint/consistent-type-imports": "error",

			// Don’t let promises go unhandled — this prevents subtle bugs
			"@typescript-eslint/no-floating-promises": "error",

			// Prefer `readonly` for props that are never reassigned
			"@typescript-eslint/prefer-readonly": "error",
		},
	},

	// Override specifically for TypeScript files
	{
		files: ["**/*.ts", "**/*.tsx"],
		rules: {
			"@typescript-eslint/no-shadow": ["error"],
			"no-shadow": "off",
			"no-undef": "off",
			"@typescript-eslint/explicit-module-boundary-types": ["error"],
			"@typescript-eslint/explicit-function-return-type": ["error"],
		},
	},

	// Disable certain rules for this file only (internal DB logic that mutates params)
	{
		files: ["./src/db/index.ts"],
		rules: {
			"no-param-reassign": "off",
			"no-use-before-define": "off",
			"@typescript-eslint/no-use-before-define": "off",
		},
	},

	{
		files: ["./src/db/repositories/*"],
		rules: {
			"no-useless-constructor": "off",
		},
	},

	{
		files: ["./src/loaders/expressLoader.ts", "src/api/routes/*Route.ts"],
		rules: {
			"no-useless-return": "off",
		},
	},
]);
