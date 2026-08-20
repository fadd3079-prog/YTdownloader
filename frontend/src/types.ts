export interface VideoMeta {
  title: string
  thumbnail: string
  duration: number
  uploader: string
  webpage_url: string
  formats: FormatOption[]
}

export interface FormatOption {
  format_id: string
  ext: string
  resolution: string
  filesize: number | null
  vcodec: string
  acodec: string
  label: string
}

export interface DownloadProgress {
  status: "downloading" | "merging" | "done" | "error"
  percent: number
  speed: string
  eta: string
  filename: string
}

export interface HistoryEntry {
  id: string
  title: string
  url: string
  format: string
  date: string
  thumbnail: string
}
