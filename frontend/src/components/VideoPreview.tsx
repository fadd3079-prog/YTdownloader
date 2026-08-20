import { Download, Loader2, Clock, User, Film, Music } from "lucide-react"
import { formatDuration, formatBytes } from "../lib/utils"
import type { VideoMeta, AdvancedOptions } from "../types"
import AdvancedOptionsPanel from "./AdvancedOptionsPanel"

interface Props {
  meta: VideoMeta
  selectedFormat: string
  onFormatChange: (id: string) => void
  options: AdvancedOptions
  onOptionsChange: (opts: AdvancedOptions) => void
  onDownload: () => void
  downloading: boolean
}

export default function VideoPreview({
  meta,
  selectedFormat,
  onFormatChange,
  options,
  onOptionsChange,
  onDownload,
  downloading,
}: Props) {
  const isAudioOnly = options.audioOnly || selectedFormat === "audio_best"

  return (
    <section className="w-full px-4 sm:px-6 pb-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
          <img
            src={meta.thumbnail}
            alt={meta.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-white text-xs font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDuration(meta.duration)}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-white text-xs font-medium max-w-[50%] truncate">
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{meta.uploader}</span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug line-clamp-2 mb-6">
            {meta.title}
          </h2>

          <div className="flex flex-col gap-4">
            {!options.audioOnly && (
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Film className="w-4 h-4" />
                </div>
                <select
                  id="format-select"
                  value={selectedFormat}
                  onChange={(e) => onFormatChange(e.target.value)}
                  disabled={downloading}
                  className="w-full h-12 pl-10 pr-10 bg-neutral-50 hover:bg-white text-neutral-900 border border-neutral-200 rounded-xl text-sm font-medium outline-none transition-all duration-200 focus:border-neutral-900 focus:bg-white focus:ring-4 focus:ring-neutral-100 shadow-sm appearance-none cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23737373' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                  }}
                >
                  {meta.formats.filter(f => f.resolution !== "audio").map((f) => (
                    <option key={f.format_id} value={f.format_id}>
                      {f.label} {f.filesize ? `(${formatBytes(f.filesize)})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <AdvancedOptionsPanel options={options} onChange={onOptionsChange} disabled={downloading} />

            <button
              id="download-btn"
              onClick={onDownload}
              disabled={downloading}
              className="w-full h-12 px-7 mt-2 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
