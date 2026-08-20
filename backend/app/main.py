import os
import uuid
import asyncio
import json
import time
import shutil
import threading
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel
from yt_dlp import YoutubeDL


DOWNLOAD_DIR = Path("downloads")
DOWNLOAD_DIR.mkdir(exist_ok=True)
FILE_TTL_SECONDS = 3600

active_downloads: dict[str, dict] = {}


def cleanup_old_files():
    while True:
        time.sleep(300)
        now = time.time()
        try:
            for p in DOWNLOAD_DIR.iterdir():
                if p.is_file() and (now - p.stat().st_mtime) > FILE_TTL_SECONDS:
                    p.unlink(missing_ok=True)
                elif p.is_dir() and (now - p.stat().st_mtime) > FILE_TTL_SECONDS:
                    shutil.rmtree(p, ignore_errors=True)
        except Exception:
            pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    t = threading.Thread(target=cleanup_old_files, daemon=True)
    t.start()
    yield


app = FastAPI(title="YT Downloader API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    url: str


def build_format_list(info: dict) -> list[dict]:
    seen = set()
    result = []
    formats = info.get("formats") or []

    video_formats = []
    for f in formats:
        vcodec = f.get("vcodec", "none")
        acodec = f.get("acodec", "none")
        height = f.get("height")
        ext = f.get("ext", "")

        if vcodec != "none" and height and ext in ("mp4", "webm"):
            video_formats.append(f)

    height_map: dict[int, dict] = {}
    for f in video_formats:
        h = f.get("height", 0)
        tbr = f.get("tbr") or 0
        if h not in height_map or tbr > (height_map[h].get("tbr") or 0):
            height_map[h] = f

    for h in sorted(height_map.keys(), reverse=True):
        f = height_map[h]
        fid = f["format_id"]
        if fid in seen:
            continue
        seen.add(fid)
        result.append({
            "format_id": fid,
            "ext": "mp4",
            "resolution": f"{h}p",
            "filesize": f.get("filesize") or f.get("filesize_approx"),
            "vcodec": f.get("vcodec", ""),
            "acodec": f.get("acodec", ""),
            "label": f"MP4 {h}p",
        })

    audio_best = None
    for f in formats:
        vcodec = f.get("vcodec", "none")
        acodec = f.get("acodec", "none")
        abr = f.get("abr") or 0
        if vcodec == "none" and acodec != "none" and abr > 0:
            if audio_best is None or abr > (audio_best.get("abr") or 0):
                audio_best = f

    if audio_best:
        result.append({
            "format_id": "audio_best",
            "ext": "mp3",
            "resolution": "audio",
            "filesize": audio_best.get("filesize") or audio_best.get("filesize_approx"),
            "vcodec": "none",
            "acodec": audio_best.get("acodec", ""),
            "label": "MP3 Audio",
        })

    return result


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/analyze")
def analyze(request: AnalyzeRequest):
    opts = {
        "quiet": True,
        "no_warnings": True,
        "skip_download": True,
    }
    try:
        with YoutubeDL(opts) as ydl:
            info = ydl.extract_info(request.url, download=False)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "title": info.get("title", ""),
        "thumbnail": info.get("thumbnail", ""),
        "duration": info.get("duration", 0),
        "uploader": info.get("uploader", ""),
        "webpage_url": info.get("webpage_url", ""),
        "formats": build_format_list(info),
    }


@app.get("/api/download")
async def download(request: Request, url: str, format_id: str):
    task_id = uuid.uuid4().hex[:8]
    task_dir = DOWNLOAD_DIR / task_id
    task_dir.mkdir(exist_ok=True)

    progress_state = {
        "percent": 0.0,
        "speed": "",
        "eta": "",
        "status": "downloading",
        "filename": "",
        "error": "",
    }

    def progress_hook(d):
        if d["status"] == "downloading":
            total = d.get("total_bytes") or d.get("total_bytes_estimate") or 0
            downloaded = d.get("downloaded_bytes", 0)
            if total > 0:
                progress_state["percent"] = (downloaded / total) * 100
            speed = d.get("speed")
            if speed:
                if speed > 1024 * 1024:
                    progress_state["speed"] = f"{speed / (1024*1024):.1f} MB/s"
                else:
                    progress_state["speed"] = f"{speed / 1024:.0f} KB/s"
            eta = d.get("eta")
            if eta is not None:
                progress_state["eta"] = f"{eta}s"
        elif d["status"] == "finished":
            progress_state["percent"] = 100
            progress_state["status"] = "merging"

    def run_download():
        try:
            if format_id == "audio_best":
                opts = {
                    "format": "bestaudio/best",
                    "outtmpl": str(task_dir / "%(title)s.%(ext)s"),
                    "postprocessors": [{
                        "key": "FFmpegExtractAudio",
                        "preferredcodec": "mp3",
                        "preferredquality": "192",
                    }],
                    "progress_hooks": [progress_hook],
                    "quiet": True,
                    "no_warnings": True,
                }
            else:
                opts = {
                    "format": f"{format_id}+bestaudio/best",
                    "merge_output_format": "mp4",
                    "outtmpl": str(task_dir / "%(title)s.%(ext)s"),
                    "postprocessors": [{
                        "key": "FFmpegVideoConvertor",
                        "preferedformat": "mp4",
                    }],
                    "progress_hooks": [progress_hook],
                    "quiet": True,
                    "no_warnings": True,
                }

            with YoutubeDL(opts) as ydl:
                ydl.download([url])

            for f in task_dir.iterdir():
                if f.suffix in (".mp4", ".mp3", ".webm", ".mkv"):
                    progress_state["filename"] = f.name
                    break

            progress_state["status"] = "done"
        except Exception as e:
            progress_state["status"] = "error"
            progress_state["error"] = str(e)

    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, run_download)

    async def event_stream():
        while True:
            if await request.is_disconnected():
                break
            data = json.dumps({
                "status": progress_state["status"],
                "percent": round(progress_state["percent"], 1),
                "speed": progress_state["speed"],
                "eta": progress_state["eta"],
                "filename": progress_state["filename"],
                "message": progress_state["error"],
            })
            yield f"data: {data}\n\n"
            if progress_state["status"] in ("done", "error"):
                break
            await asyncio.sleep(0.5)

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.get("/api/file/{filename:path}")
async def serve_file(filename: str):
    for task_dir in DOWNLOAD_DIR.iterdir():
        if not task_dir.is_dir():
            continue
        target = task_dir / filename
        if target.exists():
            return FileResponse(
                path=str(target),
                filename=filename,
                media_type="application/octet-stream",
            )
    raise HTTPException(status_code=404, detail="File not found")