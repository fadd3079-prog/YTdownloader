import { Trash2, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
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
    <section className="px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[24px] font-semibold leading-[32px] tracking-[-0.96px] text-ink">
              Recent downloads.
            </h2>
            <p className="text-[14px] leading-[20px] text-mute mt-1">
              {entries.length} {entries.length === 1 ? "item" : "items"} in local history
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-mute hover:text-error"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </Button>
        </div>

        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div
              key={entry.id}
              className="group bg-canvas rounded-[8px] shadow-level-2 hover:shadow-level-3 transition-shadow duration-200 p-4 flex gap-4 items-center animate-fade-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
            >
              <div className="w-[72px] h-[42px] rounded-[4px] overflow-hidden bg-canvas-soft-2 shrink-0">
                <img
                  src={entry.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0 text-left">
                <p className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-ink truncate">
                  {entry.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[12px] leading-[16px] text-mute">
                    {entry.format}
                  </span>
                  <span className="text-hairline-strong">·</span>
                  <span className="text-[12px] leading-[16px] text-mute">
                    {timeAgo(entry.date)}
                  </span>
                </div>
              </div>

              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-mute hover:text-ink p-2"
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
