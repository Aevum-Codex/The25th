import { cn } from "@/lib/utils";

export default function Feed({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="feed"
			className={cn(
				"bg-background text-foreground h-min-[1vh] flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
				className
			)}
			{...props}
		/>
	)
}