import { Skeleton } from "./ui/skeleton"

export default function VideoSkeleton() {
  return (
    <section className="px-6 pb-8 animate-fade-up">
      <div className="max-w-2xl mx-auto bg-canvas rounded-[12px] shadow-level-4 overflow-hidden">
        <Skeleton className="aspect-video w-full rounded-none" />
        <div className="p-6 space-y-4">
          <Skeleton variant="text" className="h-5 w-3/4" />
          <Skeleton variant="text" className="h-4 w-1/3" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32 rounded-[100px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
