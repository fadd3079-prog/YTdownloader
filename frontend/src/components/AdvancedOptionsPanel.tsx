import { ChevronDown, Settings2 } from "lucide-react"
import { useState } from "react"
import type { AdvancedOptions } from "../types"

interface Props {
  options: AdvancedOptions
  onChange: (options: AdvancedOptions) => void
  disabled?: boolean
}

export default function AdvancedOptionsPanel({ options, onChange, disabled }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full mt-4 border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
          <Settings2 className="w-4 h-4 text-neutral-500" />
          Advanced Options
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="p-4 space-y-4 border-t border-neutral-200">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-neutral-700">Audio Only</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={options.audioOnly}
                onChange={(e) => onChange({ ...options, audioOnly: e.target.checked })}
                disabled={disabled}
              />
              <div
                className={`block w-10 h-6 rounded-full transition-colors ${
                  options.audioOnly ? "bg-neutral-900" : "bg-neutral-300"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  options.audioOnly ? "translate-x-4" : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>

          {options.audioOnly && (
            <div className="flex flex-col gap-2 pl-4 border-l-2 border-neutral-200">
              <span className="text-xs font-medium text-neutral-500 uppercase">Audio Format</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="audioFormat"
                    value="mp3"
                    checked={options.audioFormat === "mp3"}
                    onChange={() => onChange({ ...options, audioFormat: "mp3" })}
                    disabled={disabled}
                    className="text-neutral-900 focus:ring-neutral-900"
                  />
                  <span className="text-sm text-neutral-700">MP3</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="audioFormat"
                    value="m4a"
                    checked={options.audioFormat === "m4a"}
                    onChange={() => onChange({ ...options, audioFormat: "m4a" })}
                    disabled={disabled}
                    className="text-neutral-900 focus:ring-neutral-900"
                  />
                  <span className="text-sm text-neutral-700">M4A (Original)</span>
                </label>
              </div>
            </div>
          )}

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex flex-col">
              <span className="text-sm text-neutral-700">Remove Sponsors (SponsorBlock)</span>
              <span className="text-xs text-neutral-500">Automatically skip in-video sponsors</span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={options.sponsorblock}
                onChange={(e) => onChange({ ...options, sponsorblock: e.target.checked })}
                disabled={disabled}
              />
              <div
                className={`block w-10 h-6 rounded-full transition-colors ${
                  options.sponsorblock ? "bg-neutral-900" : "bg-neutral-300"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  options.sponsorblock ? "translate-x-4" : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex flex-col">
              <span className="text-sm text-neutral-700">Embed Subtitles</span>
              <span className="text-xs text-neutral-500">Include captions in the final file (Video only)</span>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={options.embedSubs}
                onChange={(e) => onChange({ ...options, embedSubs: e.target.checked })}
                disabled={disabled || options.audioOnly}
              />
              <div
                className={`block w-10 h-6 rounded-full transition-colors ${
                  options.embedSubs && !options.audioOnly ? "bg-neutral-900" : "bg-neutral-300"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  options.embedSubs && !options.audioOnly ? "translate-x-4" : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>
        </div>
      )}
    </div>
  )
}
