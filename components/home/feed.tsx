import { cn } from "@/lib/utils";

export default function Feed({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="feed"
			className={cn(
				"bg-background text-foreground h-min-[1vh] flex flex-col gap-2 md:gap-4 lg:gap-6 border py-2 md:py-4 lg:py-6 shadow-sm",
				className
			)}
			{...props}
		/>
	)
}