import os
import uuid
import asyncio
import json
import time
import shutil
import zipfile
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

    result.append({
        "format_id": "audio_mp3",
        "ext": "mp3",
        "resolution": "audio",
        "filesize": None,
        "vcodec": "none",
        "acodec": "mp3",
        "label": "Audio MP3 (192kbps)",
    })
    result.append({
        "format_id": "audio_m4a",
        "ext": "m4a",
        "resolution": "audio",
        "filesize": None,
        "vcodec": "none",
        "acodec": "aac",
        "label": "Audio M4A (Original Quality)",
    })

    return result


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/analyze")
def analyze(request: AnalyzeRequest):
    opts = {
        "extract_flat": "in_playlist",
        "skip_download": True,
        "quiet": True,
        "no_warnings": True,
    }
    try:
        with YoutubeDL(opts) as ydl:
            info = ydl.extract_info(request.url, download=False)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not info:
        raise HTTPException(status_code=400, detail="Could not extract metadata from URL")

    is_playlist = info.get("_type") == "playlist" or "entries" in info

    if is_playlist:
        raw_entries = info.get("entries") or []
        entries = []
        for idx, entry in enumerate(raw_entries):
            if not entry:
                continue
            entry_id = entry.get("id") or str(idx + 1)
            thumb = entry.get("thumbnail") or ""
            if not thumb and entry.get("thumbnails"):
                thumb = entry["thumbnails"][-1].get("url", "")
            
            entry_url = entry.get("url") or entry.get("webpage_url")
            if not entry_url or not entry_url.startswith("http"):
                entry_url = f"https://www.youtube.com/watch?v={entry_id}"

            entries.append({
                "id": entry_id,
                "title": entry.get("title") or f"Video {idx + 1}",
                "duration": entry.get("duration") or 0,
                "thumbnail": thumb,
                "url": entry_url,
                "playlist_index": idx + 1,
            })

        return {
            "type": "playlist",
            "id": info.get("id", ""),
            "title": info.get("title") or "YouTube Playlist",
            "uploader": info.get("uploader") or info.get("channel") or "",
            "playlist_count": len(entries),
            "entries": entries,
        }

    return {
        "type": "video",
        "id": info.get("id", ""),
        "title": info.get("title", ""),
        "thumbnail": info.get("thumbnail", ""),
        "duration": info.get("duration", 0),
        "uploader": info.get("uploader", ""),
        "webpage_url": info.get("webpage_url", ""),
        "formats": build_format_list(info),
    }


@app.get("/api/download")
async def download(
    request: Request,
    url: str,
    format_id: str = "best",
    audio_only: bool = False,
    audio_format: str = "mp3",
    sponsorblock: bool = False,
    embed_subs: bool = False,
    video_ids: str = "",
):
    task_id = uuid.uuid4().hex[:8]
    task_dir = DOWNLOAD_DIR / task_id
    task_dir.mkdir(exist_ok=True)

    progress_state = {
        "percent": 0.0,
        "speed": "",
        "eta": "",
        "status": "downloading",
        "filename": "",
        "current_item": 1,
        "total_items": 1,
        "current_title": "",
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
            urls_to_download = []
            selected_ids = [vid.strip() for vid in video_ids.split(",") if vid.strip()] if video_ids else []

            if selected_ids:
                for vid in selected_ids:
                    if vid.startswith("http"):
                        urls_to_download.append(vid)
                    else:
                        urls_to_download.append(f"https://www.youtube.com/watch?v={vid}")
            else:
                urls_to_download = [url]

            progress_state["total_items"] = len(urls_to_download)

            base_postprocessors = []

            is_audio = audio_only or format_id.startswith("audio_") or format_id in ("audio_best", "audio_mp3", "audio_m4a")

            if is_audio:
                target_codec = "m4a" if (audio_format == "m4a" or format_id == "audio_m4a") else "mp3"
                format_str = "bestaudio[ext=m4a]/bestaudio/best" if target_codec == "m4a" else "bestaudio/best"
                base_postprocessors.append({
                    "key": "FFmpegExtractAudio",
                    "preferredcodec": target_codec,
                    "preferredquality": "192",
                })
            else:
                if format_id in ("best", "auto", ""):
                    format_str = "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
                else:
                    format_str = f"{format_id}+bestaudio/best"
                base_postprocessors.append({
                    "key": "FFmpegVideoConvertor",
                    "preferedformat": "mp4",
                })

            if sponsorblock:
                base_postprocessors.append({
                    "key": "SponsorBlock",
                    "categories": ["sponsor", "selfpromo", "interaction", "intro", "outro"],
                })

            if embed_subs and not is_audio:
                base_postprocessors.append({
                    "key": "FFmpegEmbedSubtitle",
                })

            common_opts = {
                "format": format_str,
                "outtmpl": str(task_dir / "%(title)s.%(ext)s"),
                "postprocessors": base_postprocessors,
                "progress_hooks": [progress_hook],
                "quiet": True,
                "no_warnings": True,
                "ignoreerrors": True,
            }

            if embed_subs and not is_audio:
                common_opts["writesubtitles"] = True
                common_opts["writeautomaticsub"] = True
                common_opts["subtitleslangs"] = ["en", "id", "all"]

            for i, target_url in enumerate(urls_to_download):
                progress_state["current_item"] = i + 1
                progress_state["status"] = "downloading"
                progress_state["percent"] = 0.0

                with YoutubeDL(common_opts) as ydl:
                    info = ydl.extract_info(target_url, download=True)
                    if info:
                        progress_state["current_title"] = info.get("title", f"Item {i + 1}")

            downloaded_files = [f for f in task_dir.iterdir() if f.is_file() and not f.name.endswith(".part") and not f.name.endswith(".temp")]

            if not downloaded_files:
                raise Exception("No media files were produced from the extraction.")

            if len(downloaded_files) == 1:
                progress_state["filename"] = downloaded_files[0].name
            else:
                zip_name = "youtube_playlist.zip"
                zip_path = task_dir / zip_name
                with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
                    for f in downloaded_files:
                        zipf.write(f, arcname=f.name)
                progress_state["filename"] = zip_name

            progress_state["percent"] = 100.0
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
                "current_item": progress_state["current_item"],
                "total_items": progress_state["total_items"],
                "current_title": progress_state["current_title"],
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