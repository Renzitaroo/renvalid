# Product Requirements Document (PRD)
## Produk: CekValid (Web Platform Deteksi Validitas Informasi & Anti-Hoaks)
**Versi**: 1.0 (MVP)  
**Status**: Ready for Development  
**Tanggal**: 30 September 2026  

---

## 1. Latar Belakang & Problem Statement

### 1.1 Masalah Riil Pengguna
1. **Banjir Informasi & Hoaks Cepat Tersebar**: Pengguna internet di Indonesia terpapar ratusan klaim, berita sensasional, dan pesan berantai (terutama di WhatsApp, Telegram, X, TikTok, dan Facebook) setiap hari.
2. **Friksi Verifikasi Manual yang Tinggi**:
   - Untuk mengetahui apakah suatu informasi hoaks atau valid, pengguna harus membuka banyak tab pencarian.
   - Harus membandingkan sumber satu per satu dan menyaring portal berita abal-abal vs portal kredibel.
   - Memeriksa database cek fakta (seperti TurnBackHoax / CekFakta / Kominfo) secara manual sering kali sulit karena kata kunci pencarian yang tidak pas.
3. **Ketiadaan Bukti Siap Pakai untuk Menjawab Hoaks**: Saat pengguna tahu informasi tersebut mencurigakan, mereka kesulitan menyusun argumen bantahan yang ringkas, objektif, dan berdasar tautan resmi untuk dikirim kembali ke grup obrolan.

### 1.2 Solusi yang Ditawarkan
Sebuah platform web berbasis AI dan mesin penelusur fakta terverifikasi (**CekValid**) di mana pengguna cukup menempelkan teks/pesan berantai atau tautan artikel, lalu sistem secara otomatis:
- Mengurai klaim fakta utama (memisahkan opini dari fakta).
- Melacak silang (cross-check) klaim tersebut ke database cek fakta, portal berita kredibel Dewan Pers, dan situs resmi pemerintah/institusi.
- Memberikan penilaian validitas dengan indikator warna yang tegas (Valid, Hoaks, Meragukan/Kurang Konteks, atau Opini).
- Menyediakan **"Counter-Message Generator" (1-Click Copy)** untuk langsung membantah hoaks di WhatsApp dengan sopan dan berbasis data.

---

## 2. Visi Produk & Target Persona

### 2.1 Visi Produk
Menjadi asisten verifikasi informasi instan paling terpercaya dan paling mudah digunakan masyarakat Indonesia untuk memerangi disinformasi tanpa friksi teknis.

### 2.2 Persona Pengguna
1. **Persona A: "Rian - Pencari Kebenaran Praktis" (22 - 35 tahun)**
   - *Pain Point*: Sering membaca berita viral di medsos, curiga isinya dipotong (out of context), tapi malas baca klarifikasi panjang 5 halaman.
   - *Kebutuhan*: Tahu dalam < 5 detik apakah berita itu benar, apa konteks aslinya, dan link beritanya dari mana.
2. **Persona B: "Ibu Maya - Penjaga Grup Keluarga" (40 - 55 tahun)**
   - *Pain Point*: Sering menerima broadcast kesehatan atau info bantuan sosial palsu di grup WhatsApp keluarga, bingung cara mengonfirmasinya.
   - *Kebutuhan*: Tinggal copas chat WA, langsung tahu apakah itu hoaks, dan ada teks bantahan siap kirim yang sopan.
3. **Persona C: "Dina - Mahasiswa / Content Creator" (18 - 25 tahun)**
   - *Pain Point*: Takut menyebarkan info salah yang bisa merusak reputasi akademik atau akun medsosnya.
   - *Kebutuhan*: Pengecekan berbasis kutipan referensi ilmiah dan media terverifikasi.

---

## 3. Fitur Utama & Spesifikasi Fungsional

### 3.1 Input Modality (MVP)
1. **Direct Text / Broadcast Input**: Input textarea responsif dengan auto-detect panjang karakter (mendukung teks panjang hingga 5.000 kata).
2. **Quick Samples**: Tombol contoh kasus riil (contoh pesan hoaks bansos, hoaks kesehatan, dan berita fakta valid) agar pengguna baru bisa langsung mencoba tanpa mengetik.
3. **URL Link Input (Opsional MVP / Fase 1.1)**: Pengguna memasukkan link berita -> sistem otomatis melakukan web-scraping isi artikel dan mengecek klaim utamanya.

### 3.2 Mesin Verifikasi & Pipeline Cek Fakta
Alur otomatis ketika tombol **"Periksa Informasi"** ditekan:
```
Teks Input Pengguna 
   ↓
Claim Extractor (Pisahkan Opini vs Klaim Faktual) 
   ↓
Multi-Source Search Engine (TurnBackHoax, CekFakta, Kominfo, Media Tier 1-2, Portal Resmi .go.id) 
   ↓
Stance & Fact Verifier Engine 
   ↓
Kalkulasi Skor Validitas & Klasifikasi 
   ↓
Laporan Visual Interaktif + Counter-Hoax Generator
```

1. **Claim Extraction**: Memecah paragraf menjadi butir-butir klaim spesifik (misal: subjek, tindakan, angka, tahun, lokasi).
2. **Credible Source Retrieval**:
   - Querying ke sumber cek fakta Indonesia (TurnBackHoax API/RSS, CekFakta, database hoaks Kominfo).
   - Real-time search engine yang mengutamakan domain terverifikasi (Kompas, Detik, Tempo, Antara, CNN Indonesia, BBC Indonesia, situs kementerian/lembaga resmi berakhiran `.go.id`).
3. **Verdict Classification (4 Level)**:
   - 🟢 **VALID / FAKTA**: Didukung oleh bukti konsisten dari berbagai sumber kredibel.
   - 🔴 **HOAKS / DISINFORMASI**: Bertentangan langsung dengan klarifikasi resmi, sudah pernah dibantah institusi terkait, atau terdaftar sebagai hoaks.
   - 🟡 **MERAGUKAN / KURANG KONTEKS**: Sebagian kalimat benar tapi dipelintir, judul klikbait menyesatkan, atau bukti belum konklusif.
   - ⚪ **OPINI / TIDAK DAPAT DIVERIFIKASI**: Kalimat bersifat opini subjektif, spekulasi masa depan, atau klaim personal yang tidak memiliki basis fakta umum.

### 3.3 Tampilan Hasil (Result Screen)
1. **Banner Status Utama**:
   - Badge warna mencolok + headline kesimpulan bahasa awam (Contoh: *"🔴 Peringatan: Klaim Pendaftaran Bantuan Tunai Ini Adalah HOAKS"*).
2. **Skor Kepercayaan (Credibility Score)**: Persentase probabilitas keabsahan informasi (0% - 100%).
3. **Poin-poin Fakta Sebenarnya (What Really Happened)**:
   - 3 - 4 poin ringkas fakta sebenarnya yang meluruskan klaim.
4. **Bukti & Sumber Rujukan (Evidence Cards)**:
   - Nama media/situs sumber (dengan label kredibilitas, misal: *Tier 1 Media Nasional* atau *Situs Resmi Pemerintah*).
   - Cuplikan kalimat kutipan dari artikel rujukan.
   - Link tombol *"Buka Sumber Asli"* ke halaman terkait.
5. **Fitur "Salin Bantahan WhatsApp" (1-Click WA Debunker)**:
   - Satu tombol untuk meng-copy template teks rapi:
     ```text
     [KLARIFIKASI CEK FAKTA]
     Mengenai informasi: "...[cuplikan teks]..."
     
     Status: ❌ HOAKS / TIDAK BENAR
     Penjelasan: [Ringkasan 2 kalimat kenapa itu salah]
     Sumber resmi: [URL Berita Klarifikasi]
     
     Dicek via CekValid.id
     ```

---

## 4. Kebutuhan Non-Fungsional (NFR)

1. **Kecepatan & Responsivitas (Performance)**:
   - Waktu respons verifikasi total < 4-6 detik untuk teks berukuran standar.
   - Menampilkan *interactive skeleton loading* / progres bertahap (Tahap 1: Mengekstrak klaim -> Tahap 2: Mencari sumber terpercaya -> Tahap 3: Menganalisis kebenaran).
2. **Transparansi & Tanpa Halusinasi (Anti-Slop AI)**:
   - AI tidak boleh mengarang sumber link atau mengklaim fakta tanpa rujukan yang terbukti ada di hasil pencarian.
   - Setiap verdict wajib menyertakan minimal 1 tautan URL aktif.
3. **Desain Mobile-First**:
   - 80%+ pengguna mengakses via smartphone saat menerima chat WhatsApp, layout harus seamless di layar HP.
4. **Keamanan & Privasi**:
   - Teks yang dimasukkan pengguna tidak dijadikan materi publik tanpa izin. Tidak ada penyimpanan data sensitif (PII).

---

## 5. Arsitektur Teknis yang Direkomendasikan

Pendekatan *pragmatis & anti over-engineering* (cepat dibangun, murah operasionalnya, mudah di-deploy):

| Layer | Teknologi yang Dipilih | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Frontend & UI** | Next.js (Tailwind + Lucide Icons) ATAU Streamlit / FastAPI UI | UI bersih, interaktif, responsif HP, mudah dipakai orang awam. |
| **Backend / API** | FastAPI (Python) | Kecepatan tinggi (async), modular, mudah dihubungkan dengan scraping & LLM. |
| **Search Engine** | DuckDuckGo Search API / Tavily API / Wikipedia API | Akses data real-time ke web tanpa scraping rapuh. |
| **Reasoning Engine** | Gemini 1.5 Flash / Groq LLaMA 3.3 | Latensi inferensi sub-detik, gratis/murah tier, kemampuan penalaran Bahasa Indonesia yang fasih. |

---

## 6. Roadmap Pengembangan (Milestones)

### Fase 1: MVP Cepat (Target: 3 Hari Kerja)
- [x] Dokumen PRD dan perumusan alur verifikasi.
- [ ] Setup backend FastAPI + integrasi live search engine (Wikipedia ID + DuckDuckGo/Tavily).
- [ ] Pembuatan prompt reasoning verifier (Klaim -> Bukti -> Verdict -> Ringkasan Penjelasan).
- [ ] Frontend clean & responsif (Input box, kartu hasil verifikasi, indikator warna, tombol salin WA).
- [ ] Pengujian pada 20 contoh kasus hoaks nyata dan berita valid.

### Fase 2: Peningkatan Fitur (Target: Minggu ke-2)
- [ ] Pengecekan langsung via link artikel URL (Auto-scraper reader).
- [ ] Halaman "Hoaks Populer Minggu Ini" (Trending Hoax Tracker).
- [ ] Dukungan upload gambar/screenshot (OCR).

---

## 7. Metrik Keberhasilan (KPI)
1. **Akurasi Verdict**: $\ge 90\%$ akurasi pada klaim yang sudah memiliki verifikasi di portal resmi.
2. **Latency**: Rata-rata waktu pemrosesan $\le 5$ detik.
3. **Utility Rate**: Pengguna menggunakan tombol "Salin Bantahan WhatsApp" pada $\ge 30\%$ pengecekan yang berstatus hoaks.
