import { cn } from "@/lib/utils";

export default function Landing({ className }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="landing"
      className={cn(
        "bg-background text-foreground h-min-[1vh] flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
    >
        <div id="carousel" className="relative w-full overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out">
            {/* Carousel items go here */}
          </div>
        </div>
        <div id="splash" className="text-center p-4">
            <h2 className="text-3xl font-bold mb-2">&quot;Put your best foot forward&quot;</h2>
            <p className="text-lg">Join us on taking a look back at our journey.</p>
        </div>
    </div>
  )
}