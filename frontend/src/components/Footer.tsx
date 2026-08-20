import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold tracking-tight text-neutral-900 font-sans">
              YT Downloader
            </span>
            <div className="w-4 h-4 rounded bg-neutral-900 flex items-center justify-center text-white">
              <svg className="w-2 h-2 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M5.5 4.25C5.5 3.3 6.55 2.73 7.35 3.25L19.35 11.0C20.08 11.48 20.08 12.52 19.35 13.0L7.35 20.75C6.55 21.27 5.5 20.7 5.5 19.75V4.25Z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-neutral-400">
            Engineered with FastAPI, yt-dlp, FFmpeg & React.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <a
            href="https://github.com/fadd3079-prog/YTdownloader.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-all duration-150"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>

          <a
            href="https://www.instagram.com/fadd.fadhol"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-all duration-150"
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span>Instagram</span>
          </a>

          <a
            href="https://www.tiktok.com/@fadd.graphics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-all duration-150"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .594.045.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.86-4.49V8.58a8.28 8.28 0 0 0 4.91 1.6V6.69z" />
            </svg>
            <span>TikTok</span>
          </a>

          <a
            href="https://tako.id/fadhol_pemula"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-all duration-150"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Donate</span>
          </a>
        </div>

        <div className="flex items-center">
          <span className="font-mono text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
            FADD GRAPHICS
          </span>
        </div>
      </div>
    </footer>
  )
}
