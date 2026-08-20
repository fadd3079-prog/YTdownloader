# Product Requirements Document (PRD): YouTube Downloader UI

## 1. Pernyataan Masalah (Problem Statement)
Pengguna membutuhkan antarmuka yang bersih, cepat, dan bebas iklan untuk mengunduh video atau audio dari YouTube. Web downloader yang ada saat ini dipenuhi iklan *pop-up* yang mengganggu dan rentan *malware*. Diperlukan aplikasi mandiri berbasis `yt-dlp` dengan antarmuka modern.

## 2. Tujuan (Goals)
* Membangun UI berbasis web yang intuitif untuk mengeksekusi *command* `yt-dlp`.
* Menyediakan *feedback real-time* (progress bar) saat proses unduhan berlangsung.
* Memisahkan beban kerja: UI yang statis/ringan dan backend pemroses media yang independen.

## 3. Target Pengguna (Target Users)
Pengguna umum dan *power user* yang menginginkan alat ekstraksi media YouTube yang cepat, andal, dan tanpa batasan (*limitless*).

## 4. Cerita Pengguna (User Stories)
* Sebagai pengguna, saya ingin menempelkan (paste) URL YouTube agar sistem dapat langsung menampilkan *preview* (judul, thumbnail, durasi).
* Sebagai pengguna, saya ingin memilih format unduhan (Video MP4 atau Audio MP3) dan resolusi.
* Sebagai pengguna, saya ingin melihat *progress bar* secara *real-time* saat video sedang diunduh dan digabungkan (merge) oleh FFmpeg.
* Sebagai pengguna, saya ingin melihat riwayat unduhan saya sebelumnya tanpa harus *login*.
* Sebagai pengguna, saya ingin menempelkan URL YouTube Playlist/Mix dan memilih video yang ingin diunduh atau mengunduh seluruh playlist sekaligus.
* Sebagai pengguna, saya ingin opsi lanjutan (SponsorBlock removal, embed subtitle, format audio MP3/M4A).

## 5. Persyaratan Fungsional (Functional Requirements)
* **Metadata Fetching:** Backend mengekstrak metadata single video dan playlist/mix menggunakan `yt-dlp` secara cepat.
* **Format Selection & Advanced Options:** Pemilihan resolusi, opsi audio-only (MP3/M4A), SponsorBlock removal, dan embed subtitles.
* **Batch / Playlist Download:** Unduh seluruh playlist atau video terpilih dengan bundling zip otomatis.
* **Real-time Progress:** Backend memancarkan Server-Sent Events (SSE) yang membaca `progress_hooks` dari `yt-dlp` mengabari persentase, status file, dan progress playlist ke Frontend.
* **History Management:** Frontend menyimpan riwayat unduhan (Judul, URL, Format, Tanggal) ke dalam Local Storage browser.
* **Auto-Cleanup:** Backend memiliki *scheduler/background task* sederhana untuk menghapus file di direktori sementara (misal `/downloads`) setelah 1 jam untuk menghemat *storage* server.

## 6. Persyaratan Non-Fungsional (Non-Functional Requirements)
* **Stack UI:** React + TypeScript + Tailwind CSS + Vite (Hosting: Vercel).
* **Stack API:** Python + FastAPI + yt-dlp + FFmpeg (Hosting: Docker/PaaS seperti Railway/Render).
* **State Management:** React Hooks sederhana tanpa Redux.
* **Database:** TIDAK ADA DATABASE (Stateless backend, Local Storage frontend).
* **Desain UI/UX:** WAJIB mengacu penuh pada file `DESIGN.md` yang ada di root direktori.

## 7. Cakupan (Scope)
* **In Scope:** Unduh satu video (single URL), YouTube Playlist & Mix batch download, seleksi video playlist, ekstraksi audio (MP3/M4A), pilihan resolusi, SponsorBlock removal, embed subtitle, SSE progress bar per video dan batch, riwayat unduhan lokal.
* **Out of Scope (Ditunda):** Autentikasi/Login pengguna, cloud database, sistem *multi-user* dengan *rate limiting*.