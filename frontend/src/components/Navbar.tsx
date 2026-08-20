export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-5xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
        <a href="/" className="group inline-flex items-center gap-2 transition-opacity duration-150">
          <span className="text-base sm:text-lg font-black tracking-tight text-neutral-900 font-sans">
            YT Downloader
          </span>
          <div className="w-5 h-5 rounded-md bg-neutral-900 flex items-center justify-center text-white shadow-sm group-hover:bg-neutral-800 transition-colors">
            <svg
              className="w-2.5 h-2.5 fill-current ml-0.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.5 4.25C5.5 3.3 6.55 2.73 7.35 3.25L19.35 11.0C20.08 11.48 20.08 12.52 19.35 13.0L7.35 20.75C6.55 21.27 5.5 20.7 5.5 19.75V4.25Z" />
            </svg>
          </div>
        </a>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/fadd3079-prog/YTdownloader.git"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-3.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 active:scale-[0.98] flex items-center gap-1.5 transition-all duration-150"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  )
}
