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

## 5. Persyaratan Fungsional (Functional Requirements)
* **Metadata Fetching:** Backend harus mengekstrak metadata URL menggunakan `yt-dlp` secara cepat.
* **Format Selection:** Dropdown untuk memilih resolusi video atau ekstraksi audio saja.
* **Real-time Progress:** Backend harus memancarkan Server-Sent Events (SSE) yang membaca `progress_hooks` dari `yt-dlp` untuk mengabari persentase ke Frontend.
* **History Management:** Frontend menyimpan riwayat unduhan (Judul, URL, Format, Tanggal) ke dalam Local Storage browser.
* **Auto-Cleanup:** Backend memiliki *scheduler/background task* sederhana untuk menghapus file di direktori sementara (misal `/downloads`) setelah 1 jam untuk menghemat *storage* server.

## 6. Persyaratan Non-Fungsional (Non-Functional Requirements)
* **Stack UI:** React + TypeScript + Tailwind CSS + Vite (Hosting: Vercel).
* **Stack API:** Python + FastAPI + yt-dlp + FFmpeg (Hosting: Docker/PaaS seperti Railway/Render).
* **State Management:** React Hooks sederhana tanpa Redux.
* **Database:** TIDAK ADA DATABASE (Stateless backend, Local Storage frontend).
* **Desain UI/UX:** WAJIB mengacu penuh pada file `DESIGN.md` yang ada di root direktori.

## 7. Cakupan (Scope)
* **In Scope:** Unduh satu video (single URL), ekstraksi audio, pilihan resolusi, SSE progress bar, riwayat unduhan lokal.
* **Out of Scope (Ditunda):** Autentikasi/Login pengguna, unduh playlist *batch* (bulk download), cloud database, sistem *multi-user* dengan *rate limiting*.