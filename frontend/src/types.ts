export interface VideoMeta {
  type: "video"
  id?: string
  title: string
  thumbnail: string
  duration: number
  uploader: string
  webpage_url: string
  formats: FormatOption[]
}

export interface PlaylistEntry {
  id: string
  title: string
  duration: number
  thumbnail: string
  url: string
  playlist_index: number
}

export interface PlaylistMeta {
  type: "playlist"
  id: string
  title: string
  uploader: string
  playlist_count: number
  entries: PlaylistEntry[]
}

export type MediaAnalysis = VideoMeta | PlaylistMeta

export interface FormatOption {
  format_id: string
  ext: string
  resolution: string
  filesize: number | null
  vcodec: string
  acodec: string
  label: string
}

export interface AdvancedOptions {
  audioOnly: boolean
  audioFormat: "mp3" | "m4a"
  sponsorblock: boolean
  embedSubs: boolean
}

export interface DownloadProgress {
  status: "downloading" | "merging" | "done" | "error"
  percent: number
  speed: string
  eta: string
  filename: string
  currentItem?: number
  totalItems?: number
  currentTitle?: string
}

export interface HistoryEntry {
  id: string
  title: string
  url: string
  format: string
  date: string
  thumbnail: string
}
