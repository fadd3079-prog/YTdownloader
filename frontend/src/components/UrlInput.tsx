import { useState, type FormEvent } from "react"
import { Loader2, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { InputLg } from "./ui/input"

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
    <section className="relative pt-28 pb-20 px-6 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,124,240,0.12) 0%, rgba(0,223,216,0.08) 25%, rgba(121,40,202,0.08) 50%, rgba(255,0,128,0.06) 75%, transparent 100%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-canvas-soft-2 border border-hairline">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="font-mono text-[12px] leading-[16px] text-mute uppercase tracking-normal">
            yt-dlp + FFmpeg
          </span>
        </div>

        <h1 className="text-[48px] font-semibold leading-[48px] tracking-[-2.4px] text-ink mb-5">
          Download YouTube media.
        </h1>

        <p className="text-[18px] leading-[28px] text-body mb-12 max-w-md mx-auto">
          Paste a URL, pick a format, get your file. No ads, no trackers, no limits.
        </p>

        <form onSubmit={handle} className="flex gap-3 max-w-xl mx-auto">
          <InputLg
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            disabled={loading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading || !url.trim()}
            size="lg"
            className="shrink-0 min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-[spin_1s_linear_infinite]" />
                <span>Analyzing</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}
