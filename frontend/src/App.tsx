import { useState, useRef, useCallback, useEffect } from "react"
import { Toaster, toast } from "sonner"
import Navbar from "./components/Navbar"
import UrlInput from "./components/UrlInput"
import VideoSkeleton from "./components/VideoSkeleton"
import VideoPreview from "./components/VideoPreview"
import PlaylistPreview from "./components/PlaylistPreview"
import DownloadProgress from "./components/ProgressBar"
import History from "./components/History"
import Footer from "./components/Footer"
import { fetchMeta, startDownloadSSE } from "./api"
import { getHistory, addHistory } from "./storage"
import type { MediaAnalysis, HistoryEntry, AdvancedOptions } from "./types"

interface Progress {
  percent: number
  speed: string
  eta: string
  status: string
  currentItem?: number
  totalItems?: number
  currentTitle?: string
}

export default function App() {
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState<MediaAnalysis | null>(null)
  const [selectedFormat, setSelectedFormat] = useState("")
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    audioOnly: false,
    audioFormat: "mp3",
    sponsorblock: false,
    embedSubs: false,
  })
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
      if (data.type === "video" && data.formats?.length) {
        setSelectedFormat(data.formats[0].format_id)
      }
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDownload = useCallback((videoIds: string[] = []) => {
    if (!meta) return
    setDownloading(true)
    setProgress({ percent: 0, speed: "", eta: "", status: "downloading" })

    closeSSE.current?.()
    closeSSE.current = startDownloadSSE(
      currentUrl,
      selectedFormat || "best",
      advancedOptions,
      videoIds,
      (data) => {
        setProgress({
          percent: (data.percent as number) || 0,
          speed: (data.speed as string) || "",
          eta: (data.eta as string) || "",
          status: (data.status as string) || "downloading",
          currentItem: (data.current_item as number) || undefined,
          totalItems: (data.total_items as number) || undefined,
          currentTitle: (data.current_title as string) || undefined,
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

        const formatLabel = advancedOptions.audioOnly 
          ? `Audio ${advancedOptions.audioFormat.toUpperCase()}`
          : (meta.type === "video" ? (meta.formats.find((f) => f.format_id === selectedFormat)?.label || selectedFormat) : selectedFormat)
          
        addHistory({
          title: meta.title,
          url: currentUrl,
          format: formatLabel,
          thumbnail: meta.type === "video" ? meta.thumbnail : (meta.entries?.[0]?.thumbnail || ""),
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
  }, [meta, selectedFormat, currentUrl, advancedOptions])

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between selection:bg-neutral-900 selection:text-white">
      <Navbar />

      <main className="w-full flex-1">
        <UrlInput onSubmit={handleAnalyze} loading={loading} />

        {loading && <VideoSkeleton />}

        {meta && !loading && meta.type === "video" && (
          <VideoPreview
            meta={meta}
            selectedFormat={selectedFormat}
            onFormatChange={setSelectedFormat}
            options={advancedOptions}
            onOptionsChange={setAdvancedOptions}
            onDownload={() => handleDownload([])}
            downloading={downloading}
          />
        )}
        
        {meta && !loading && meta.type === "playlist" && (
          <PlaylistPreview
            meta={meta}
            options={advancedOptions}
            onOptionsChange={setAdvancedOptions}
            onDownload={(ids) => handleDownload(ids)}
            downloading={downloading}
          />
        )}

        {progress && (
          <DownloadProgress
            percent={progress.percent}
            speed={progress.speed}
            eta={progress.eta}
            status={progress.status}
            currentItem={progress.currentItem}
            totalItems={progress.totalItems}
            currentTitle={progress.currentTitle}
          />
        )}

        <History entries={history} onClear={() => setHistory([])} />
      </main>

      <Footer />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            border: "1px solid #e5e5e5",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "500",
            fontFamily: "Inter, system-ui, sans-serif",
            color: "#171717",
          },
        }}
      />
    </div>
  )
}
