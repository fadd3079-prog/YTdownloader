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
  onProgress: (data: Record<string, unknown>) => void,
  onDone: (data: Record<string, unknown>) => void,
  onError: (msg: string) => void
): () => void {
  const eventSource = new EventSource(
    `${API}/download?url=${encodeURIComponent(url)}&format_id=${encodeURIComponent(formatId)}`
  )

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
