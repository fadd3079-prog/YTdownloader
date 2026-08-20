import type { HistoryEntry } from "./types"

const STORAGE_KEY = "yt_dl_history"
const MAX_ENTRIES = 50

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addHistory(entry: Omit<HistoryEntry, "id" | "date">): void {
  const history = getHistory()
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  }
  history.unshift(newEntry)
  if (history.length > MAX_ENTRIES) history.pop()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
