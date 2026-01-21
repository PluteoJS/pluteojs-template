import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import globals from "globals";

/**
 * ESLint configuration for Express.js applications.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
	js.configs.recommended,
	eslintConfigPrettier,
	...tseslint.configs.recommended,
	{
		plugins: {
			turbo: turboPlugin,
		},
		rules: {
			"turbo/no-undeclared-env-vars": "warn",
		},
	},
	{
		plugins: {
			onlyWarn,
		},
	},
	{
		ignores: ["dist/**", "build/**"],
	},
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			// Enforce === and !== to avoid unexpected type coercion
			eqeqeq: ["error", "always"],

			// Always use curly braces for clarity and consistency
			curly: ["error", "all"],

			// Disallow multiple spaces
			"no-multi-spaces": "error",

			// Nested ternaries are hard to read
			"no-nested-ternary": "error",

			// Encourage using object shorthand
			"object-shorthand": ["error", "always"],

			// Prevent reassigning parameters (allow Express req/res modifications)
			"no-param-reassign": [
				"error",
				{
					props: true,
					ignorePropertyModificationsFor: ["req", "res", "next"],
				},
			],

			// Use double quotes consistently
			quotes: ["error", "double", {allowTemplateLiterals: true}],

			// Always end lines with semicolons
			semi: ["error", "always"],

			// Use tabs for indentation
			indent: ["error", "tab", {SwitchCase: 1}],

			// Allow tabs for indentation only
			"no-tabs": ["error", {allowIndentationTabs: true}],

			// Allow console logs for backend debugging
			"no-console": "off",

			// Always use parentheses with arrow functions
			"arrow-parens": ["error", "always"],

			// Use braces in arrow function bodies
			"arrow-body-style": ["error", "always"],

			// TypeScript handles unused vars
			"no-unused-vars": "off",

			// Turned off because TypeScript handles undefined variable checks
			"no-undef": "off",

			// TypeScript specific rules
			"@typescript-eslint/no-use-before-define": ["error"],

			// Discourage use of `any`
			"@typescript-eslint/no-explicit-any": [
				"error",
				{
					fixToUnknown: false,
					ignoreRestArgs: false,
				},
			],

			// Enforce no unused variables but allow _ignored args
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					vars: "all",
					args: "after-used",
					ignoreRestSiblings: false,
					argsIgnorePattern: "^_|next",
				},
			],

			// Enforce consistent naming conventions (without type checking requirements)
			"@typescript-eslint/naming-convention": [
				"error",
				{selector: "variableLike", format: ["camelCase"]},
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

			// Use `import type` consistently
			"@typescript-eslint/consistent-type-imports": "error",
		},
	},
	// TypeScript-specific overrides
	{
		files: ["**/*.ts", "**/*.tsx"],
		rules: {
			"@typescript-eslint/no-shadow": ["error"],
			"no-shadow": "off",
			"@typescript-eslint/explicit-module-boundary-types": ["error"],
			"@typescript-eslint/explicit-function-return-type": ["error"],
		},
	},
	// Database files - allow param reassignment for pg-promise extensions
	{
		files: ["**/db/index.ts"],
		rules: {
			"no-param-reassign": "off",
			"@typescript-eslint/no-use-before-define": "off",
		},
	},
	// Repository files - allow useless constructors for pg-promise pattern
	{
		files: ["**/db/repositories/**"],
		rules: {
			"no-useless-constructor": "off",
		},
	},
	// Route and loader files
	{
		files: ["**/loaders/*.ts", "**/api/routes/**"],
		rules: {
			"no-useless-return": "off",
		},
	},
];
