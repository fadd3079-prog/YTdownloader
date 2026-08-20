import { useState, type FormEvent } from "react"
import { Loader2, ArrowRight, Link2 } from "lucide-react"

interface Props {
  onSubmit: (url: string) => void
  loading: boolean
}

export default function UrlInput({ onSubmit, loading }: Props) {
  const [url, setUrl] = useState("")

  function handle(e: FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <section className="w-full pt-12 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-white border border-neutral-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs font-medium text-neutral-600 tracking-tight">
            HIGH SPEED · NO ADS · 4K READY
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1] mb-4 sm:mb-6">
          Download YouTube media with precision.
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-neutral-500 max-w-xl mx-auto mb-8 sm:mb-10 font-normal leading-relaxed">
          Extract pristine 4K/HD video and high-bitrate audio directly from YouTube. Stateless, ad-free, and blazing fast.
        </p>

        <form onSubmit={handle} className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Link2 className="w-4 h-4" />
            </div>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube link here..."
              disabled={loading}
              className="w-full h-12 pl-10 pr-4 bg-white text-neutral-900 border border-neutral-200 rounded-xl text-sm placeholder:text-neutral-400 outline-none transition-all duration-200 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100 shadow-sm disabled:opacity-50 disabled:bg-neutral-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full sm:w-auto h-12 px-6 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
