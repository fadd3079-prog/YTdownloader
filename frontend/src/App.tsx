import { useState, useRef, useCallback, useEffect } from "react"
import { Toaster, toast } from "sonner"
import Navbar from "./components/Navbar"
import UrlInput from "./components/UrlInput"
import VideoSkeleton from "./components/VideoSkeleton"
import VideoPreview from "./components/VideoPreview"
import DownloadProgress from "./components/ProgressBar"
import History from "./components/History"
import { fetchMeta, startDownloadSSE } from "./api"
import { getHistory, addHistory } from "./storage"
import type { VideoMeta, HistoryEntry } from "./types"

interface Progress {
  percent: number
  speed: string
  eta: string
  status: string
}

export default function App() {
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState<VideoMeta | null>(null)
  const [selectedFormat, setSelectedFormat] = useState("")
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>(getHistory)
  const [currentUrl, setCurrentUrl] = useState("")
  const closeSSE = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => { closeSSE.current?.() }
  }, [])

  const handleAnalyze = useCallback(async (url: string) => {
    setLoading(true)
    setMeta(null)
    setProgress(null)
    setCurrentUrl(url)
    try {
      const data = await fetchMeta(url)
      setMeta(data)
      if (data.formats?.length) {
        setSelectedFormat(data.formats[0].format_id)
      }
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDownload = useCallback(() => {
    if (!meta || !selectedFormat) return
    setDownloading(true)
    setProgress({ percent: 0, speed: "", eta: "", status: "downloading" })

    closeSSE.current?.()
    closeSSE.current = startDownloadSSE(
      currentUrl,
      selectedFormat,
      (data) => {
        setProgress({
          percent: (data.percent as number) || 0,
          speed: (data.speed as string) || "",
          eta: (data.eta as string) || "",
          status: (data.status as string) || "downloading",
        })
      },
      (data) => {
        setDownloading(false)
        setProgress(null)

        const filename = (data.filename as string) || "file"
        const downloadUrl = `/api/file/${encodeURIComponent(filename)}`
        const a = document.createElement("a")
        a.href = downloadUrl
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()

        const fmt = meta.formats.find((f) => f.format_id === selectedFormat)
        addHistory({
          title: meta.title,
          url: currentUrl,
          format: fmt?.label || selectedFormat,
          thumbnail: meta.thumbnail,
        })
        setHistory(getHistory())
        toast.success("Download complete")
      },
      (msg) => {
        setDownloading(false)
        setProgress(null)
        toast.error(msg)
      }
    )
  }, [meta, selectedFormat, currentUrl])

  return (
    <div className="min-h-screen bg-canvas-soft">
      <Navbar />

      <main className="relative">
        <UrlInput onSubmit={handleAnalyze} loading={loading} />

        {loading && <VideoSkeleton />}

        {meta && !loading && (
          <VideoPreview
            meta={meta}
            selectedFormat={selectedFormat}
            onFormatChange={setSelectedFormat}
            onDownload={handleDownload}
            downloading={downloading}
          />
        )}

        {progress && (
          <DownloadProgress
            percent={progress.percent}
            speed={progress.speed}
            eta={progress.eta}
            status={progress.status}
          />
        )}

        <History entries={history} onClear={() => setHistory([])} />
      </main>

      <footer className="border-t border-hairline py-8 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-[12px] leading-[16px] text-mute">
            Built with yt-dlp · FFmpeg · FastAPI · React
          </span>
          <span className="font-mono text-[12px] leading-[16px] text-mute">
            FADD GRAPHICS
          </span>
        </div>
      </footer>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            border: "1px solid #ebebeb",
            boxShadow: "0px 1px 1px rgba(0,0,0,0.02), 0px 8px 16px -4px rgba(0,0,0,0.04), 0px 24px 32px -8px rgba(0,0,0,0.06)",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "Inter, system-ui, sans-serif",
            color: "#171717",
          },
        }}
      />
    </div>
  )
}
