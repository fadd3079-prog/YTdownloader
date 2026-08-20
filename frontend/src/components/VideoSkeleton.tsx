export default function VideoSkeleton() {
  return (
    <section className="w-full px-4 sm:px-6 pb-8 animate-pulse">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="aspect-video w-full bg-neutral-100" />
        <div className="p-5 sm:p-6 space-y-4">
          <div className="h-5 bg-neutral-100 rounded-md w-3/4" />
          <div className="h-4 bg-neutral-100 rounded-md w-1/3" />
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="h-12 bg-neutral-100 rounded-xl flex-1" />
            <div className="h-12 bg-neutral-100 rounded-xl w-full sm:w-36" />
          </div>
        </div>
      </div>
    </section>
  )
}
