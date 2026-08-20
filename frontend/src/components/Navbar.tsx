import { Download } from "lucide-react"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-canvas/80 backdrop-blur-xl border-b border-hairline">
      <div className="max-w-[1200px] mx-auto h-full flex items-center px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-ink flex items-center justify-center shadow-level-2">
            <Download className="w-4 h-4 text-on-primary" strokeWidth={2.5} />
          </div>
          <span className="text-[14px] font-semibold tracking-[-0.28px] text-ink select-none">
            YT Downloader
          </span>
        </div>

        <nav className="ml-auto flex items-center gap-1">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-3 rounded-full text-[14px] leading-[20px] tracking-[-0.28px] text-body hover:text-ink hover:bg-canvas-soft-2 flex items-center transition-colors duration-150"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
