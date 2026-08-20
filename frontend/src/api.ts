const API = "/api"

export async function fetchMeta(url: string) {
  const res = await fetch(`${API}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Network error" }))
    throw new Error(err.detail || "Failed to analyze URL")
  }
  return res.json()
}

export function startDownloadSSE(
  url: string,
  formatId: string,
  advancedOptions: {
    audioOnly: boolean
    audioFormat: "mp3" | "m4a"
    sponsorblock: boolean
    embedSubs: boolean
  },
  videoIds: string[],
  onProgress: (data: Record<string, unknown>) => void,
  onDone: (data: Record<string, unknown>) => void,
  onError: (msg: string) => void
): () => void {
  const query = new URLSearchParams()
  query.append("url", url)
  query.append("format_id", formatId)
  if (advancedOptions.audioOnly) query.append("audio_only", "true")
  if (advancedOptions.audioFormat !== "mp3") query.append("audio_format", advancedOptions.audioFormat)
  if (advancedOptions.sponsorblock) query.append("sponsorblock", "true")
  if (advancedOptions.embedSubs) query.append("embed_subs", "true")
  if (videoIds.length > 0) query.append("video_ids", videoIds.join(","))

  const eventSource = new EventSource(`${API}/download?${query.toString()}`)

  eventSource.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (data.status === "done") {
      onDone(data)
      eventSource.close()
    } else if (data.status === "error") {
      onError(data.message || "Download failed")
      eventSource.close()
    } else {
      onProgress(data)
    }
  }

  eventSource.onerror = () => {
    onError("Connection lost")
    eventSource.close()
  }

  return () => eventSource.close()
}
