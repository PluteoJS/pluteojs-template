import Image from "next/image";

import CodeBlock from "@/components/CodeBlock";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/lib/shadcn/ui/card";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 container max-w-5xl py-12 md:py-24 mx-auto px-4">
				{/* Hero Section with PluteoJS Branding */}
				<div className="text-center space-y-6 mb-16">
					<Image
						src="/images/pluteo-js-logo-transparent.svg"
						alt="PluteoJS Logo"
						width={120}
						height={120}
						className="mx-auto"
						priority
					/>
					<div className="space-y-2">
						<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
							PluteoJS Template
						</h1>
						<p className="text-sm text-muted-foreground">
							Created by{" "}
							<a
								href="https://swalahamani.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline font-medium"
							>
								Muhammad Swalah
							</a>{" "}
							at{" "}
							<a
								href="https://heedlabs.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline font-medium"
							>
								HeedLabs
							</a>
						</p>
					</div>
					<p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
						A full-stack TypeScript monorepo template for building scalable
						applications with Next.js, Express, and shared packages.
					</p>
				</div>

				{/* Key Features */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 mx-auto">
					<Card>
						<CardHeader>
							<CardTitle>Turborepo Monorepo</CardTitle>
						</CardHeader>
						<CardContent>
							<p>
								Organized codebase with shared packages, optimized builds, and
								seamless development workflow across apps.
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Full-Stack TypeScript</CardTitle>
						</CardHeader>
						<CardContent>
							<p>
								End-to-end type safety with shared types between frontend and
								backend via @pluteojs/api-types package.
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Modern Stack</CardTitle>
						</CardHeader>
						<CardContent>
							<p>
								Next.js 16, React 19, Redux Toolkit, Express API, Drizzle ORM,
								and shadcn/ui components.
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Monorepo Structure */}
				<div className="my-16 mx-auto">
					<h2 className="text-3xl font-bold mb-6 text-center">
						Monorepo Structure
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Apps</CardTitle>
							</CardHeader>
							<CardContent className="text-sm space-y-2">
								<p>
									<strong>@pluteojs/next-web</strong> - Next.js frontend
								</p>
								<p>
									<strong>@pluteojs/express-api-server</strong> - Express API
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Packages</CardTitle>
							</CardHeader>
							<CardContent className="text-sm space-y-2">
								<p>
									<strong>@pluteojs/api-types</strong> - Shared Zod schemas
								</p>
								<p>
									<strong>@pluteojs/database</strong> - Drizzle ORM setup
								</p>
								<p>
									<strong>@pluteojs/email-templates</strong> - React Email
								</p>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Development Commands */}
				<div className="my-16 mx-auto">
					<h2 className="text-3xl font-bold mb-6 text-center">
						Development Commands
					</h2>
					<div className="space-y-8 max-w-3xl mx-auto">
						<div>
							<h3 className="text-xl font-semibold mb-2">Development Server</h3>
							<CodeBlock className="text-sm mb-4 p-4 block">
								pnpm --filter @pluteojs/next-web dev
							</CodeBlock>
							<p className="text-muted-foreground text-sm">
								Starts the development server with Turbopack for faster
								refreshes at http://localhost:4000
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2">
								Build for Production
							</h3>
							<CodeBlock className="text-sm mb-4 p-4 block">
								pnpm --filter @pluteojs/next-web build
							</CodeBlock>
							<p className="text-muted-foreground text-sm">
								Creates an optimized production build in the .next folder
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2">Run All Apps</h3>
							<CodeBlock className="text-sm mb-4 p-4 block">pnpm dev</CodeBlock>
							<p className="text-muted-foreground text-sm">
								Starts all apps in the monorepo simultaneously using Turborepo
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2">
								Code Quality Checks
							</h3>
							<CodeBlock className="text-sm mb-4 p-4 block">
								pnpm lint && pnpm check-types
							</CodeBlock>
							<p className="text-muted-foreground text-sm">
								Runs ESLint and TypeScript checks across all packages
							</p>
						</div>
					</div>
				</div>

				{/* Working with shadcn/ui */}
				<div className="my-16 mx-auto">
					<h2 className="text-3xl font-bold mb-6 text-center">
						Working with shadcn/ui
					</h2>
					<div className="space-y-8 max-w-3xl mx-auto">
						<div>
							<h3 className="text-xl font-semibold mb-2">
								Install a Component
							</h3>
							<CodeBlock className="text-sm mb-4 p-4 block">
								npx shadcn-ui@latest add button
							</CodeBlock>
							<p className="text-muted-foreground text-sm">
								Components are styled with Tailwind CSS and use Radix UI for
								accessibility
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2">
								Component Import Path
							</h3>
							<CodeBlock className="text-sm mb-4 p-4 block">
								{`import { Button } from "@/components/lib/shadcn/ui/button"`}
							</CodeBlock>
							<p className="text-muted-foreground text-sm">
								Import components according to the configured aliases in
								components.json
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2">
								Available Components
							</h3>
							<p className="text-muted-foreground mb-2">
								Run one of these commands to add more components:
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								<CodeBlock className="text-xs p-2 block">
									npx shadcn-ui@latest add alert
								</CodeBlock>
								<CodeBlock className="text-xs p-2 block">
									npx shadcn-ui@latest add dialog
								</CodeBlock>
								<CodeBlock className="text-xs p-2 block">
									npx shadcn-ui@latest add dropdown-menu
								</CodeBlock>
								<CodeBlock className="text-xs p-2 block">
									npx shadcn-ui@latest add form
								</CodeBlock>
							</div>
						</div>
					</div>
				</div>

				{/* Using Static Assets */}
				<div className="my-16 mx-auto">
					<h2 className="text-3xl font-bold mb-6 text-center">
						Using Static Assets
					</h2>
					<div className="space-y-8 max-w-3xl mx-auto">
						<div>
							<h3 className="text-xl font-semibold mb-2">
								Next.js Image Component
							</h3>
							<CodeBlock className="text-sm mb-4 p-4 block whitespace-pre">
								{`import Image from "next/image";

<Image
  src="/images/pluteo-js-logo-transparent.svg"
  alt="PluteoJS Logo"
  width={120}
  height={120}
/>`}
							</CodeBlock>
							<p className="text-muted-foreground text-sm">
								Place static assets in the <code>public/</code> folder and
								reference them with absolute paths. The Next.js Image component
								provides automatic optimization.
							</p>
						</div>
						<div>
							<h3 className="text-xl font-semibold mb-2">File Structure</h3>
							<CodeBlock className="text-sm mb-4 p-4 block whitespace-pre">
								{`public/
├── images/
│   └── pluteo-js-logo-transparent.svg
├── favicon.ico
└── site.webmanifest`}
							</CodeBlock>
							<p className="text-muted-foreground text-sm">
								Organize assets in subdirectories within <code>public/</code>{" "}
								for better maintainability
							</p>
						</div>
					</div>
				</div>

				{/* Tech Stack Features */}
				<div className="my-16 mx-auto">
					<h2 className="text-3xl font-bold mb-6 text-center">
						Built-in Features
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Type Safety</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Catch errors during development with TypeScript&apos;s static
									type-checking and intelligent code completion.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Server Components</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Build faster, more responsive apps with Next.js React Server
									Components and server-side rendering.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Redux Toolkit</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Pre-configured state management with typed hooks, example
									slices, and Redux DevTools integration.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Axios Services</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									API service architecture with request/response interceptors
									for authentication and error handling.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Shared Configs</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Centralized ESLint and TypeScript configurations shared across
									all apps and packages.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>shadcn/ui</CardTitle>
							</CardHeader>
							<CardContent>
								<p>
									Beautiful, accessible components built with Radix UI and
									Tailwind CSS for consistent design.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>

			<footer className="border-t py-8">
				<div className="container flex flex-col items-center gap-6 mx-auto px-4">
					<div className="flex flex-col md:flex-row items-center justify-between w-full">
						<p className="text-sm text-muted-foreground">
							PluteoJS - Built for scalable full-stack applications.
						</p>
						<div className="flex gap-6 mt-4 md:mt-0">
							<a
								href="https://nextjs.org"
								className="text-sm text-muted-foreground hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								Next.js
							</a>
							<a
								href="https://typescriptlang.org"
								className="text-sm text-muted-foreground hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								TypeScript
							</a>
							<a
								href="https://turbo.build"
								className="text-sm text-muted-foreground hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								Turborepo
							</a>
							<a
								href="https://ui.shadcn.com"
								className="text-sm text-muted-foreground hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								shadcn/ui
							</a>
						</div>
					</div>
					<div className="flex items-center gap-2 pt-4 border-t w-full justify-center flex-wrap">
						<span className="text-sm text-muted-foreground">Created by</span>
						<a
							href="https://swalahamani.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm font-medium hover:underline"
						>
							Muhammad Swalah
						</a>
						<span className="text-sm text-muted-foreground">at</span>
						<a
							href="https://heedlabs.com"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 hover:opacity-80 transition-opacity"
						>
							<Image
								src="/images/HeedLabs-Logo.avif"
								alt="HeedLabs Logo"
								width={24}
								height={24}
								className="rounded"
							/>
							<span className="text-sm font-medium">HeedLabs</span>
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
