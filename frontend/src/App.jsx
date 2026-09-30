import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Link2, 
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Terminal
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'url' | 'image'
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [apiOnline, setApiOnline] = useState(false);

  // Check backend health
  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'healthy') setApiOnline(true);
      })
      .catch(() => setApiOnline(false));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const executeVerify = async (claimText) => {
    setLoading(true);
    setError('');
    setResult(null);
    setLoadingStep('Menghubungkan ke basis data resmi & menarik bukti...');

    try {
      const res = await fetch(`${API_BASE}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: claimText })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error (${res.status})`);
      }

      const data = await res.json();
      data.checked_claim = claimText;
      setResult(data);
      setHistory(prev => [{ claim: claimText, verdict: data.verdict }, ...prev.slice(0, 9)]);
    } catch (err) {
      setError(err.message || 'Gagal memverifikasi informasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    executeVerify(inputText.trim());
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setLoadingStep('Mengunduh dan mengekstrak isi artikel berita...');

    try {
      const scrapeRes = await fetch(`${API_BASE}/api/scrape-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() })
      });

      if (!scrapeRes.ok) {
        throw new Error('Gagal mengambil isi dari URL tersebut.');
      }

      const article = await scrapeRes.json();
      const combinedClaim = `Judul: ${article.title}. Ringkasan: ${article.content.slice(0, 450)}`;
      executeVerify(combinedClaim);
    } catch (err) {
      setError(err.message || 'Gagal memproses tautan berita.');
      setLoading(false);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;
    setLoading(true);
    setError('');
    setResult(null);
    setLoadingStep('Sistem Neural Vision sedang membaca narasi dokumen...');

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const scanRes = await fetch(`${API_BASE}/api/scan-image`, {
        method: 'POST',
        body: formData
      });

      if (!scanRes.ok) {
        throw new Error('Gagal membaca gambar.');
      }

      const scanData = await scanRes.json();
      if (!scanData.extracted_claim) {
        throw new Error('Tidak ditemukan teks klaim yang jelas pada gambar.');
      }

      executeVerify(scanData.extracted_claim);
    } catch (err) {
      setError(err.message || 'Gagal memindai gambar.');
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const quickSamples = [
    { label: '🔴 Jokowi orang medan', val: 'Jokowi orang medan' },
    { label: '🔴 Bansos Rp 5 Juta Bitly', val: 'Pemerintah bagikan bantuan tunai bansos Rp 5 juta langsung cair daftar lewat link bitly/bansos2026' },
    { label: '🟢 Bumi keliling matahari', val: 'Bumi berputar mengelilingi matahari dalam waktu satu tahun' },
    { label: '🟡 Air hangat bunuh virus', val: 'Minum air hangat setiap 15 menit dapat membunuh semua jenis virus di tenggorokan' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Telemetry Top Bar */}
      <div className="flex items-center justify-between border-b border-borderHairline pb-3 mb-6 font-mono text-[11px] uppercase tracking-wider text-slateMuted">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-ink" />
          <span>[SYS: RENVALID_FORENSIC]</span>
          <span className="hidden sm:inline">[ENGINE: VERITAS_SPO_CORE]</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${apiOnline ? 'bg-forestGreen' : 'bg-hazardRed animate-pulse'}`}></span>
          <span>{apiOnline ? 'CORE ONLINE' : 'BACKEND DISCONNECTED'}</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink mb-2">
          RENVALID
        </h1>
        <p className="text-slateMuted text-base md:text-lg max-w-2xl leading-relaxed">
          Terminal verifikasi keabsahan fakta dan penangkal disinformasi mandiri. 
          Didukung bukti ensiklopedia resmi, pelacakan real-time, dan pembongkaran bias asosiasi semantik.
        </p>
      </div>

      {/* Input Modality Tabs */}
      <div className="flex border-b border-borderHairline mb-6 gap-2">
        <button
          onClick={() => { setActiveTab('text'); setResult(null); }}
          className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'text'
              ? 'border-ink text-ink bg-white'
              : 'border-transparent text-slateMuted hover:text-ink'
          }`}
        >
          <FileText size={14} /> [01] Teks / Chat WA
        </button>
        <button
          onClick={() => { setActiveTab('url'); setResult(null); }}
          className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'url'
              ? 'border-ink text-ink bg-white'
              : 'border-transparent text-slateMuted hover:text-ink'
          }`}
        >
          <Link2 size={14} /> [02] Cek Link Berita
        </button>
        <button
          onClick={() => { setActiveTab('image'); setResult(null); }}
          className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'image'
              ? 'border-ink text-ink bg-white'
              : 'border-transparent text-slateMuted hover:text-ink'
          }`}
        >
          <ImageIcon size={14} /> [03] Scan Screenshot
        </button>
      </div>

      {/* Quick Sample Chips */}
      {activeTab === 'text' && (
        <div className="mb-4">
          <div className="font-mono text-[11px] text-slateMuted uppercase tracking-wider mb-2">Contoh Klaim Cepat:</div>
          <div className="flex flex-wrap gap-2">
            {quickSamples.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(s.val)}
                className="chip-btn"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form Containers */}
      <div className="tactile-box p-5 md:p-6 mb-8">
        {activeTab === 'text' && (
          <form onSubmit={handleTextSubmit}>
            <label className="block font-mono text-xs uppercase tracking-wider text-slateMuted mb-2 font-semibold">
              Tempelkan Kalimat, Isu Viral, atau Pesan Broadcast:
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Contoh: 'Jokowi orang medan' atau tempelkan pesan rantai panjang dari WhatsApp..."
              className="w-full p-3.5 bg-[#FAF9F6] border border-borderHairline font-sans text-ink text-base rounded-none focus:outline-none focus:border-ink mb-4 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="tactile-btn w-full md:w-auto px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
              {loading ? 'MEMVERIFIKASI...' : 'PERIKSA KEBENARAN INFORMASI'}
            </button>
          </form>
        )}

        {activeTab === 'url' && (
          <form onSubmit={handleUrlSubmit}>
            <label className="block font-mono text-xs uppercase tracking-wider text-slateMuted mb-2 font-semibold">
              Masukkan Tautan Berita Online / Portal Web:
            </label>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://news.detik.com/... atau https://kompas.com/..."
              className="w-full p-3.5 bg-[#FAF9F6] border border-borderHairline font-sans text-ink text-sm rounded-none focus:outline-none focus:border-ink mb-4"
            />
            <button
              type="submit"
              disabled={loading || !inputUrl.trim()}
              className="tactile-btn w-full md:w-auto px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Link2 size={14} />}
              {loading ? 'MENGAMBIL & MENGANALISIS...' : 'AMBIL & PERIKSA BERITA'}
            </button>
          </form>
        )}

        {activeTab === 'image' && (
          <form onSubmit={handleImageSubmit}>
            <label className="block font-mono text-xs uppercase tracking-wider text-slateMuted mb-2 font-semibold">
              Unggah Tangkapan Layar (Screenshot WA / Flyer Hoaks):
            </label>
            <div className="border-2 border-dashed border-borderHairline p-6 text-center bg-[#FAF9F6] mb-4 hover:border-ink transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img src={imagePreview} alt="Preview" className="max-h-48 rounded border border-borderHairline mb-2" />
                  <span className="font-mono text-xs text-slateMuted">Klik untuk mengganti gambar</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slateMuted">
                  <ImageIcon size={32} className="mb-2 text-ink" />
                  <span className="font-medium text-ink text-sm mb-1">Pilih file gambar atau seret ke sini</span>
                  <span className="font-mono text-[11px]">PNG, JPG, JPEG, atau WEBP</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !imageFile}
              className="tactile-btn w-full md:w-auto px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <ImageIcon size={14} />}
              {loading ? 'MEMINDAI DOKUMEN...' : 'PINDAI & CEK FAKTA GAMBAR'}
            </button>
          </form>
        )}
      </div>

      {/* Loading Progress State */}
      {loading && (
        <div className="tactile-box p-6 mb-8 text-center bg-white">
          <div className="inline-block p-3 rounded-full bg-[#FAF9F6] border border-borderHairline mb-3 animate-pulse">
            <RefreshCw size={24} className="animate-spin text-ink" />
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-slateMuted mb-1">[PROSES TELEMETRI]</div>
          <div className="font-bold text-ink text-base">{loadingStep}</div>
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="p-4 mb-8 bg-[#FEF2F2] border-l-4 border-hazardRed text-hazardRed font-medium text-sm">
          <strong>Kesalahan:</strong> {error}
        </div>
      )}

      {/* Results View - Swiss Forensic Sheet */}
      {result && (
        <div className="space-y-6">
          {/* Header Stamp Card */}
          <div className="tactile-box p-6 md:p-8 bg-white relative">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderHairline pb-4 mb-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-slateMuted block mb-1">
                  Klaim Yang Dievaluasi:
                </span>
                <span className="font-bold text-ink text-sm italic">
                  "{result.checked_claim || inputText}"
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[11px] uppercase tracking-wider text-slateMuted block mb-0.5">
                  Tingkat Keyakinan:
                </span>
                <span className="font-mono font-extrabold text-base text-ink">
                  {result.confidence_score || 95}%
                </span>
              </div>
            </div>

            {/* The Rubber Stamp */}
            <div className="my-4">
              {result.verdict?.includes('SALAH') || result.verdict?.includes('HOAKS') ? (
                <div className="forensic-stamp stamp-danger">
                  🔴 [ STATUS: TERBUKTI HOAKS / SALAH ]
                </div>
              ) : result.verdict?.includes('BENAR') || result.verdict?.includes('FAKTA') ? (
                <div className="forensic-stamp stamp-success">
                  🟢 [ STATUS: TERVERIFIKASI FAKTA ]
                </div>
              ) : result.verdict?.includes('MERAGUKAN') || result.verdict?.includes('KONTEKS') ? (
                <div className="forensic-stamp stamp-warning">
                  🟡 [ STATUS: MERAGUKAN / KURANG KONTEKS ]
                </div>
              ) : (
                <div className="forensic-stamp stamp-neutral">
                  ⚪ [ STATUS: OPINI SUBJEKTIF ]
                </div>
              )}
            </div>

            {/* Verdict Lead Statement */}
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-ink mt-3 mb-2 leading-snug">
              {result.ringkasan_fakta}
            </h2>
          </div>

          {/* Key Points & Deep Analysis Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="tactile-card p-5 bg-white">
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-slateMuted mb-3 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-forestGreen" /> Poin Kunci Fakta
              </h3>
              <ul className="space-y-2 text-sm text-ink leading-relaxed">
                {result.poin_kunci && result.poin_kunci.length > 0 ? (
                  result.poin_kunci.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono font-bold text-slateMuted">•</span>
                      <span>{p}</span>
                    </li>
                  ))
                ) : (
                  <li>{result.detail_koreksi}</li>
                )}
              </ul>
            </div>

            <div className="tactile-card p-5 bg-white">
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-slateMuted mb-3 flex items-center gap-1.5">
                <FileText size={14} className="text-cobaltBlue" /> Analisis Koreksi Lengkap
              </h3>
              <p className="text-sm text-slateMuted leading-relaxed">
                {result.detail_koreksi}
              </p>
            </div>
          </div>

          {/* Evidence Cards */}
          {result.sumber_rujukan && result.sumber_rujukan.length > 0 && (
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-slateMuted mb-3">
                [ DOKUMEN SUMBER & BUKTI RUJUKAN ]
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {result.sumber_rujukan.map((src, idx) => (
                  <div key={idx} className="tactile-card p-4 bg-white flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-cobaltBlue block mb-1">
                        BUKTI #{idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-ink mb-1 line-clamp-1">{src.nama}</h4>
                      <p className="text-xs text-slateMuted line-clamp-3 mb-3">
                        {src.keterangan || src.kutipan || 'Data pendukung terverifikasi.'}
                      </p>
                    </div>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs font-bold text-ink underline inline-flex items-center gap-1 hover:text-cobaltBlue"
                      >
                        Buka Sumber Asli <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1-Click WhatsApp Debunker (Killer Feature) */}
          {result.pesan_whatsapp && (
            <div className="tactile-box p-6 bg-[#FAF9F6] border-dashed border-slateMuted">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-wider font-bold text-forestGreen flex items-center gap-1.5">
                  💬 [DRAF BANTAHAN WHATSAPP (1-CLICK COPY)]
                </span>
                <button
                  onClick={() => copyToClipboard(result.pesan_whatsapp)}
                  className="tactile-btn px-3 py-1.5 text-[11px] flex items-center gap-1.5 bg-forestGreen border-forestGreen hover:bg-green-700"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'TERBAIK! TERSALIN' : 'SALIN PESAN WA'}
                </button>
              </div>
              <p className="text-xs text-slateMuted mb-3">
                Pesan sopan dan objektif berikut sudah diformat dengan tanda tebal khas WhatsApp, siap kamu kirim ke grup chat keluarga atau teman:
              </p>
              <div className="p-3.5 bg-white border border-borderHairline font-sans text-xs md:text-sm text-ink whitespace-pre-line leading-relaxed selection:bg-slate-200">
                {result.pesan_whatsapp}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Session History */}
      {history.length > 0 && (
        <div className="mt-12 pt-6 border-t border-borderHairline">
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-slateMuted mb-3">
            [ RIWAYAT PENGECEKAN SESI INI ]
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <span
                key={i}
                onClick={() => { setInputText(h.claim); setActiveTab('text'); }}
                className="chip-btn cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>{h.verdict?.includes('SALAH') ? '🔴' : '🟢'}</span>
                <span className="truncate max-w-[200px]">{h.claim}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-borderHairline text-center font-mono text-[11px] text-slateMuted">
        <div>RENVALID &bull; DOKUMENTASI FORENSIK FAKTA &bull; VERSI 1.0</div>
        <div className="mt-1 text-slate-400">Didukung oleh Basis Pengetahuan Ensiklopedia & Penelusuran Bukti Real-Time</div>
      </footer>
    </div>
  );
}
