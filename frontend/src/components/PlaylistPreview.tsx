import { Download, Loader2, ListVideo, User, Film, Music, CheckSquare, Square } from "lucide-react"
import { formatDuration } from "../lib/utils"
import type { PlaylistMeta, AdvancedOptions } from "../types"
import AdvancedOptionsPanel from "./AdvancedOptionsPanel"
import { useState } from "react"

interface Props {
  meta: PlaylistMeta
  options: AdvancedOptions
  onOptionsChange: (opts: AdvancedOptions) => void
  onDownload: (videoIds: string[]) => void
  downloading: boolean
}

export default function PlaylistPreview({
  meta,
  options,
  onOptionsChange,
  onDownload,
  downloading,
}: Props) {
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(
    new Set(meta.entries.map((e) => e.id))
  )

  const toggleVideo = (id: string) => {
    const next = new Set(selectedVideos)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedVideos(next)
  }

  const toggleAll = () => {
    if (selectedVideos.size === meta.entries.length) {
      setSelectedVideos(new Set())
    } else {
      setSelectedVideos(new Set(meta.entries.map((e) => e.id)))
    }
  }

  return (
    <section className="w-full px-4 sm:px-6 pb-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        
        <div className="p-5 sm:p-6 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-200 flex flex-shrink-0 items-center justify-center text-neutral-500">
              <ListVideo className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug line-clamp-2 mb-2">
                {meta.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{meta.uploader}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Film className="w-4 h-4" />
                  <span>{meta.playlist_count} videos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-0 sm:p-0">
          <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-neutral-100">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              {selectedVideos.size === meta.entries.length ? (
                <CheckSquare className="w-4 h-4 text-neutral-900" />
              ) : (
                <Square className="w-4 h-4 text-neutral-400" />
              )}
              {selectedVideos.size === 0 ? "Select All" : `${selectedVideos.size} Selected`}
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto divide-y divide-neutral-100 bg-white">
            {meta.entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => !downloading && toggleVideo(entry.id)}
                className={`flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors cursor-pointer ${
                  downloading ? "opacity-60 cursor-not-allowed pointer-events-none" : ""
                }`}
              >
                <button
                  className="flex-shrink-0 text-neutral-400 focus:outline-none"
                  disabled={downloading}
                >
                  {selectedVideos.has(entry.id) ? (
                    <CheckSquare className="w-5 h-5 text-neutral-900" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div className="relative w-24 sm:w-32 aspect-video bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={entry.thumbnail}
                    alt={entry.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-medium">
                    {formatDuration(entry.duration)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2">
                    {entry.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">#{entry.playlist_index}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 bg-white border-t border-neutral-100">
          <AdvancedOptionsPanel options={options} onChange={onOptionsChange} disabled={downloading} />

          <div className="mt-6">
            <button
              onClick={() => onDownload(Array.from(selectedVideos))}
              disabled={downloading || selectedVideos.size === 0}
              className="w-full h-12 px-7 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download {selectedVideos.size} Video{selectedVideos.size !== 1 && "s"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
