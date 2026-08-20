import { Trash2, ExternalLink, History as HistoryIcon } from "lucide-react"
import { clearHistory } from "../storage"
import { timeAgo } from "../lib/utils"
import type { HistoryEntry } from "../types"

interface Props {
  entries: HistoryEntry[]
  onClear: () => void
}

export default function History({ entries, onClear }: Props) {
  if (entries.length === 0) return null

  function handleClear() {
    clearHistory()
    onClear()
  }

  return (
    <section className="w-full px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-neutral-500" />
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
              Download History
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-mono font-medium">
              {entries.length}
            </span>
          </div>

          <button
            onClick={handleClear}
            className="text-xs font-medium text-neutral-500 hover:text-red-600 transition-colors duration-150 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group bg-white rounded-xl border border-neutral-200 p-3 sm:p-3.5 flex items-center gap-3.5 hover:border-neutral-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-20 sm:w-24 aspect-video rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-100">
                <img
                  src={entry.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-neutral-900 truncate group-hover:text-neutral-700 transition-colors">
                  {entry.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[11px] font-medium text-neutral-600 uppercase">
                    {entry.format}
                  </span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-[11px] text-neutral-400">
                    {timeAgo(entry.date)}
                  </span>
                </div>
              </div>

              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-150 shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
