import { Download, Loader2, Clock, User } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select"
import { formatDuration, formatBytes } from "../lib/utils"
import type { VideoMeta } from "../types"

interface Props {
  meta: VideoMeta
  selectedFormat: string
  onFormatChange: (id: string) => void
  onDownload: () => void
  downloading: boolean
}

export default function VideoPreview({
  meta,
  selectedFormat,
  onFormatChange,
  onDownload,
  downloading,
}: Props) {
  const selectedFmt = meta.formats.find((f) => f.format_id === selectedFormat)

  return (
    <section className="px-6 pb-8 animate-fade-up">
      <div className="max-w-2xl mx-auto bg-canvas rounded-[12px] shadow-level-4 overflow-hidden">
        <div className="relative aspect-video bg-canvas-soft-2 group">
          <img
            src={meta.thumbnail}
            alt={meta.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Badge>
              <Clock className="w-3 h-3" />
              {formatDuration(meta.duration)}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3">
            <Badge>
              <User className="w-3 h-3" />
              {meta.uploader}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-[20px] font-semibold leading-[28px] tracking-[-0.6px] text-ink text-left line-clamp-2">
            {meta.title}
          </h2>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Select value={selectedFormat} onValueChange={onFormatChange}>
              <SelectTrigger id="format-select" className="flex-1" disabled={downloading}>
                <SelectValue>
                  {selectedFmt
                    ? `${selectedFmt.label}${selectedFmt.filesize ? ` · ${formatBytes(selectedFmt.filesize)}` : ""}`
                    : "Select format"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {meta.formats.map((f) => (
                  <SelectItem key={f.format_id} value={f.format_id}>
                    {f.label}
                    {f.filesize ? ` · ${formatBytes(f.filesize)}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              id="download-btn"
              onClick={onDownload}
              disabled={downloading}
              size="md"
              className="shrink-0 min-w-[140px]"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-[spin_1s_linear_infinite]" />
                  Downloading
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
