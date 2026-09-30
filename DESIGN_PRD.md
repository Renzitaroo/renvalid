# PRD Desain UI/UX: CekValid
## "Editorial Truth & Verification Terminal"
**Versi**: 1.0 (Design System & UX Specification)  
**Status**: Ready for Frontend Implementation  
**Tanggal**: 30 September 2026  

---

## 1. Visi Desain & Atmosfer Visual

### 1.1 Filosofi Desain
CekValid dirancang dengan gaya **"Editorial Truth & Swiss Verification Terminal"**.  
Aplikasi ini bukan sekadar alat AI biasa, melainkan **asisten verifikasi fakta yang berwibawa, objektif, tenang, dan transparan** (seperti perpaduan antara ruang redaksi jurnalisme investigasi *New York Times Fact Check* dengan kesederhanaan utilitas modern *Linear/Perplexity*).

### 1.2 Skala Karakteristik Desain
- **Density (Kerapatan)**: `5 / 10` — *Daily App Balanced*. Lapang, tidak sesak, ruang napas (whitespace) cukup untuk membaca teks investigasi dengan nyaman.
- **Variance (Variasi Layout)**: `6 / 10` — *Offset Editorial*. Layout tidak simetris membosankan, menggunakan kartu berhierarki dan pembagian dua kolom asimetris di desktop.
- **Motion (Dinamika Gerak)**: `5 / 10` — *Fluid & Weighted Spring*. Transisi halus tanpa efek berlebihan yang mengganggu konsentrasi membaca.

---

## 2. Color Palette & Semantic Tokens

Desain menghindari estetika murahan ala AI template (tidak ada neon ungu, tidak ada gradient lebay, tidak ada hitam pekat `#000000`).

### 2.1 Warna Netral (Background & Surfaces)
| Token Name | Hex Code | Penggunaan |
| :--- | :--- | :--- |
| **Canvas Background** | `#F8FAFC` (Slate-50) | Warna latar belakang aplikasi |
| **Card Surface** | `#FFFFFF` (Pure White) | Kontainer kartu konten, modal, dan panel |
| **Ink Primary** | `#0F172A` (Slate-900) | Teks utama, judul, dan angka verdict |
| **Ink Secondary** | `#475569` (Slate-600) | Teks penjelasan, narasi, dan label |
| **Ink Muted** | `#94A3B8` (Slate-400) | Timestamp, placeholder, dan metadata |
| **Border Subtle** | `#E2E8F0` (Slate-200) | Garis pemisah kartu (1px border) |

### 2.2 Token Semantik Verdict (Status Kebenaran)
Setiap status memiliki 3 level warna: **Solid** (Badge & Icon), **Soft Surface** (Latar Box), dan **Border** (Garis Tepi).

```
🔴 SALAH / HOAKS:
   - Solid: #DC2626 (Crimson Red)
   - Background: #FEF2F2
   - Border: #FECACA

🟢 BENAR / FAKTA:
   - Solid: #16A34A (Emerald Green)
   - Background: #F0FDF4
   - Border: #BBF7D0

🟡 MERAGUKAN / KURANG KONTEKS:
   - Solid: #D97706 (Amber Gold)
   - Background: #FFFBEB
   - Border: #FDE68A

⚪ OPINI SUBJEKTIF:
   - Solid: #475569 (Slate Blue)
   - Background: #F8FAFC
   - Border: #CBD5E1
```

### 2.3 Warna Aksen (Brand Authority)
- **Primary Brand Accent**: `#2563EB` (Cobalt Royal Blue) — Melambangkan kredibilitas dan ketenangan institusional.
- **Accent Hover / Active**: `#1D4ED8` (Deep Blue).

---

## 3. Arsitektur Tipografi

Menggunakan font bernuansa geometris humanis kontemporer yang sangat terbaca di layar HP maupun desktop.

* **Primary Sans (Headings & UI)**: `Plus Jakarta Sans` / `Cabinet Grotesk`
  - *Hero Title*: 32px / 2rem, Weight 800, Letter-spacing -0.03em.
  - *Verdict Title*: 26px / 1.625rem, Weight 800, Letter-spacing -0.02em.
  - *Section Headings*: 18px / 1.125rem, Weight 700.
  - *Body Text*: 15px / 0.95rem, Weight 400, Line-height 1.6, Max 65 karakter per baris.
* **Monospace (Data & Metrik)**: `JetBrains Mono` / `Geist Mono`
  - Digunakan untuk: Skor Kepercayaan (`99%`), Timestamp pengecekan, dan indikator URL sumber.

---

## 4. Struktur Layar & Wireframe Alur (Information Architecture)

Aplikasi mengadopsi prinsip **Progressive Disclosure**: Pengguna langsung disuguhkan hasil inti dalam 1 detik, lalu bisa membaca detail mendalam jika diperlukan.

```
┌─────────────────────────────────────────────────────────────┐
│ 🛡️ CekValid                      [⚙️ Status Model: Aktif]   │
│ Asisten Verifikasi Fakta & Anti-Hoaks Independen            │
├─────────────────────────────────────────────────────────────┤
│ [📝 Teks Bebas]   [🔗 Link URL Berita]   [🖼️ Scan Gambar]   │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Input Box (Pesan WA / Link / File Dropzone)             │ │
│ └─────────────────────────────────────────────────────────┘ │
│ [ 🔴 Contoh: Jokowi Medan ]  [ 🔴 Bansos 5 Jt ]  [ 🟢 Sains ]│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │          🔍 [ PERIKSA KEBERANAN INFORMASI ]             │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ HASIL PEMERIKSAAN FAKTA (Muncul Halus via Fade-In)          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔴 SALAH / HOAKS                        [ Skor: 99% ]   │ │
│ │ Fakta: Jokowi lahir di Solo, relasi Medan via menantu   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌──────────────────────────────┐ ┌────────────────────────┐ │
│ │ 📌 Poin Kunci Fakta          │ │ 🔗 Bukti Terverifikasi │ │
│ │ • Lahir di Surakarta, Jateng │ │ [Wikipedia] [Setkab]   │ │
│ │ • Menantu menjabat di Medan  │ │ [Detik.com]            │ │
│ └──────────────────────────────┘ └────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 💬 DRAF BANTAHAN WHATSAPP (1-CLICK COPY)                │ │
│ │ [ *[CEK FAKTA]* Info ini SALAH karena... ]             │ │
│ │ [ 📋 Salin Pesan Bantahan ke Clipboard ]                │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Spesifikasi Komponen & Interaksi

### 5.1 Input Component (3 Modus Tab)
1. **Tab 1: Teks Bebas / Chat WhatsApp**
   - Textarea dengan auto-expand, border 1px Slate-200.
   - Focus state: Ring halus 2px Cobalt Blue (`#2563EB`) tanpa drop-shadow berlebih.
   - Quick sample chips: Pill button rounded-full, click langsung mengisi form.
2. **Tab 2: Cek Link URL Artikel**
   - Single-line input dengan auto-strip protokol `https://`.
   - Tombol "Ambil & Analisis Artikel".
   - Preview kartu mini berisi judul berita yang terdeteksi sebelum proses verifikasi.
3. **Tab 3: Upload Screenshot / Dokumen Gambar**
   - Dropzone area dengan border putus-putus (*dashed*) 2px.
   - Thumbnail preview gambar yang rapi di sisi kiri dengan tombol hapus (silang).

### 5.2 Verdict Hero Banner
- Komponen paling penting di layar: Pengguna harus tahu jawabannya dalam < 1 detik.
- Badge berukuran besar dengan ikon tebal (🔴, 🟢, 🟡, ⚪).
- Background tint lembut sesuai warna verdict (tidak menyilaukan mata).
- Teks ringkasan fakta 1-2 kalimat dengan font bold tebal.

### 5.3 Evidence Cards (Kartu Sumber Rujukan)
- Grid kartu bukti interaktif (maksimal 3 kartu di layar).
- Badge kategori sumber: *"Basis Pengetahuan Resmi"*, *"Media Terdaftar Dewan Pers"*, *"Database Cek Fakta"*.
- Kutipan kalimat relevan dari artikel asli.
- Tautan keluar dengan icon `↗` yang membuka tab baru ke website sumber resmi.

### 5.4 1-Click WhatsApp Debunker Box
- Kotak khusus bertema WhatsApp (background abu-abu lembut dengan aksen hijau WhatsApp lembut `#25D366` pada tombol).
- Area teks monospace siap salin.
- Tombol **"📋 Salin Pesan WhatsApp"** yang memberikan micro-feedback haptic/visual: berubah menjadi *"✅ Tersalin ke Clipboard!"* selama 2 detik.

---

## 6. Motion Philosophy & Micro-Interactions

1. **State Loading (Skeleton Shimmer)**:
   - DILARANG menggunakan spinner lingkaran berputar biasa yang membosankan.
   - Gunakan **Skeleton Shimmer** bergradasi abu-abu muda (`#E2E8F0` ke `#F1F5F9`) dengan bentuk kotak verdict dan kartu bukti yang berdenyut lembut selama AI mencari data.
2. **Result Reveal**:
   - Fade-in dengan sedikit pergeseran vertikal (Translate Y: 8px -> 0px) menggunakan kurva spring physics (`cubic-bezier(0.16, 1, 0.3, 1)`).
3. **Button Hover & Active**:
   - Hover: Transform translateY(-1px), shadow bertambah lembut.
   - Active (ditekan): Transform translateY(1px).

---

## 7. Desain Responsif & Mobile-First (WhatsApp User Behavior)

Mengingat 80%+ pengguna menerima pesan hoaks di smartphone:
1. **Layar < 768px (Mobile)**:
   - Seluruh grid asimetris otomatis runtuh menjadi satu kolom (*single-column flow*).
   - Tombol aksi utama "Periksa Kebenaran" melekat lebar penuh (*full-width touch target 48px*).
   - Tombol salin WhatsApp diletakkan di jangkauan jempol bawah layar.
2. **Layar >= 1024px (Desktop)**:
   - Lebar maksimum kontainer dibatasi pada `1100px` (terpusat) agar teks tidak melar terlalu panjang dan tetap nyaman dibaca.

---

## 8. Anti-Patterns (Aturan Terlarang)

* ❌ **Dilarang menggunakan warna neon/glow**: Tidak ada efek glow ungu ala fiksi ilmiah murahan.
* ❌ **Dilarang alarmis**: Desain tidak boleh membuat pengguna panik (hindari font merah berkedip atau kata-kata kasar).
* ❌ **Dilarang menyembunyikan link sumber**: Setiap status wajib didukung minimal satu tautan rujukan nyata.
* ❌ **Dilarang layout card-inside-card berulang**: Maksimal 2 level hierarki visual.
