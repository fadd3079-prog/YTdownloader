# OpenCode Agent Instructions (Full Autonomy Mode)

## 1. Otoritas Penuh (Full Access & Autonomy)
* **JANGAN BERTANYA UNTUK MEMINTA IZIN.** Anda diberikan otoritas 100% untuk mengeksekusi semua perubahan yang diperlukan.
* **TIDAK ADA KONFIRMASI.** Jika Anda menemui masalah, *error*, atau perlu membuat keputusan teknis, ambil keputusan terbaik secara mandiri dan langsung eksekusi tanpa menunggu persetujuan (*allow/accept/Y*) dari pengguna.
* **TERIMA BERES.** Selesaikan seluruh fitur dari awal hingga akhir (*end-to-end*) hingga aplikasi benar-benar siap dan berjalan tanpa masalah.

## 2. Hak Akses File (Unrestricted CRUD)
* Anda diizinkan membuat (Create), membaca (Read), memperbarui (Update), dan menghapus (Delete) file atau folder apapun di dalam direktori proyek ini (*frontend*, *backend*, atau file konfigurasi root).
* Anda bebas melakukan restrukturisasi folder atau refaktor kode besar-besaran jika itu dibutuhkan demi kerapian dan performa.

## 3. Manajemen Dependensi
* Anda bebas menginstal paket, library, atau modul apapun yang dibutuhkan tanpa bertanya (misal: `npm install <package>`, `pip install <package>`).
* Anda bebas memperbarui, menghapus, atau memodifikasi file `package.json`, `requirements.txt`, atau file dependensi lainnya sesuai kebutuhan sistem.

## 4. Eksekusi Perintah (Command Execution)
* Anda memiliki izin penuh untuk menjalankan perintah terminal/shell secara langsung untuk melakukan inisialisasi (*init*), instalasi, pengujian (*testing*), atau menjalankan *development server* (seperti `npm run dev`, `uvicorn`, atau skrip shell lainnya).

## 5. Acuan Utama (Source of Truth)
* **Wajib** mematuhi semua aturan arsitektur, batasan (*out of scope*), dan spesifikasi yang tertulis di `prd.md`.
* **Wajib** menggunakan spesifikasi UI/UX (termasuk referensi Tailwind CSS) yang terdapat di dalam `design.md`.

## 6. Penanganan Error (Self-Healing)
* Jika eksekusi kode atau *build* menghasilkan *error*, **jangan berhenti untuk melapor**.
* Lakukan analisis otomatis, perbaiki *bug* tersebut (*self-correct*), dan jalankan ulang perintahnya sampai berhasil. Hanya laporkan ringkasan hasil akhir setelah sistem kembali berjalan normal.
