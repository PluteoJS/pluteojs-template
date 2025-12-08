import {HTMLAttributes, forwardRef} from "react";

import {cn} from "@/components/lib/shadcn/lib/utils";

type iCodeBlockProps = HTMLAttributes<HTMLPreElement>;

const CodeBlock = forwardRef<HTMLPreElement, iCodeBlockProps>(
	({className, ...props}, ref) => {
		return (
			<pre
				ref={ref}
				className={cn(
					"rounded-md bg-muted px-4 py-3 font-mono text-sm",
					className
				)}
				{...props}
			/>
		);
	}
);

CodeBlock.displayName = "CodeBlock";

export default CodeBlock;
