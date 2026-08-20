# YTdownloader

A clean, modern, and ad-free web interface for downloading YouTube videos and audio. Powered by `yt-dlp` and `FFmpeg` on the backend, this application provides limitless downloads without the pop-ups and malware risks of traditional downloader sites.

## Features

- **Sleek UI:** Built with React and Tailwind CSS, featuring a modern, fast, and responsive design.
- **Single & Playlist Downloads:** Download individual videos or entire YouTube playlists/mixes in a batch.
- **Format Selection:** Choose between various video resolutions (up to Best Quality) or extract audio directly (MP3/M4A).
- **Advanced Options:** 
  - Remove sponsorships automatically via SponsorBlock integration.
  - Embed subtitles into the downloaded videos.
- **Real-time Progress:** Live progress bars powered by Server-Sent Events (SSE) tracking the download and merging process.
- **History Management:** Locally stored download history without requiring user accounts or logins.
- **Auto-Cleanup Backend:** The stateless FastAPI backend automatically cleans up temporary files after one hour to preserve server storage.

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS + Lucide Icons
- LocalStorage for State/History

**Backend:**
- Python + FastAPI
- `yt-dlp` (Core downloading engine)
- `FFmpeg` (Video/Audio merging and conversion)
- Server-Sent Events (SSE)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.10+
- FFmpeg (Must be installed and available in system PATH)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   The API will be running at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The UI will be running at `http://localhost:5173`.

## Disclaimer

This tool is intended for personal use and downloading publicly available content that you have the right to download. Please respect YouTube's Terms of Service and creators' copyrights.
