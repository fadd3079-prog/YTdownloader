import { Zap, Gauge, RefreshCw, ListVideo } from "lucide-react"

interface Props {
  percent: number
  speed: string
  eta: string
  status: string
  currentItem?: number
  totalItems?: number
  currentTitle?: string
}

export default function DownloadProgress({ 
  percent, 
  speed, 
  eta, 
  status,
  currentItem,
  totalItems,
  currentTitle
}: Props) {
  const isMerging = status === "merging"
  const isPlaylist = totalItems && totalItems > 1
  const clampedPercent = Math.min(100, Math.max(0, percent))

  return (
    <section className="w-full px-4 sm:px-6 pb-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              {isMerging ? (
                <RefreshCw className="w-4 h-4 animate-spin text-neutral-700" />
              ) : isPlaylist ? (
                <ListVideo className="w-4 h-4 text-neutral-700" />
              ) : (
                <Zap className="w-4 h-4 text-neutral-700" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                {isMerging 
                  ? "Merging video and audio via FFmpeg..." 
                  : isPlaylist && currentItem && totalItems
                    ? `Downloading ${currentItem} of ${totalItems}: ${currentTitle || 'Media'}`
                    : currentTitle || "Downloading media stream..."}
              </p>
              <p className="text-xs text-neutral-500">
                {isMerging ? "Encoding target format" : "Direct stream extraction"}
              </p>
            </div>
          </div>

          <span className="font-mono text-sm font-bold text-neutral-900 tabular-nums shrink-0">
            {isMerging ? "100%" : `${clampedPercent.toFixed(1)}%`}
          </span>
        </div>

        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden mb-4">
          {isMerging ? (
            <div className="w-full h-full bg-neutral-900 rounded-full animate-pulse" />
          ) : (
            <div
              className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${clampedPercent}%` }}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-neutral-400" />
            <span>Speed: {speed || "Calculating..."}</span>
          </div>
          <span>ETA: {eta || "--"}</span>
        </div>
      </div>
    </section>
  )
}
