import { Zap, Gauge } from "lucide-react"
import { ProgressBar } from "./ui/progress"

interface Props {
  percent: number
  speed: string
  eta: string
  status: string
}

export default function DownloadProgress({ percent, speed, eta, status }: Props) {
  const isMerging = status === "merging"
  const displayPercent = Math.min(100, Math.max(0, percent))

  return (
    <section className="px-6 pb-8 animate-fade-up">
      <div className="max-w-2xl mx-auto bg-canvas rounded-[12px] shadow-level-3 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-canvas-soft-2 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-ink" />
            </div>
            <span className="text-[14px] font-medium tracking-[-0.28px] text-ink">
              {isMerging ? "Merging audio + video…" : "Downloading…"}
            </span>
          </div>
          <span className="font-mono text-[12px] leading-[16px] text-mute tabular-nums">
            {isMerging ? "FFmpeg" : `${displayPercent.toFixed(1)}%`}
          </span>
        </div>

        <ProgressBar
          value={displayPercent}
          variant={isMerging ? "indeterminate" : "gradient"}
        />

        {!isMerging && (speed || eta) && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-hairline">
            <div className="flex items-center gap-1.5 text-mute">
              <Gauge className="w-3.5 h-3.5" />
              <span className="font-mono text-[12px] leading-[16px] tabular-nums">
                {speed || "—"}
              </span>
            </div>
            <span className="font-mono text-[12px] leading-[16px] text-mute tabular-nums">
              ETA {eta || "—"}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
