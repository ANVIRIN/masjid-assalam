# Panduan Sinkronisasi Data Masjid Assalam

## Status Sinkronisasi Data ✅

Semua data yang diinput di admin panel sekarang akan langsung muncul di homepage.

### Data Flow

```
Admin Panel
    ↓
API/Supabase
    ↓
Homepage (index.html)
```

### Detil Sinkronisasi Per Data

| Data            | Storage                       | Admin Upload   | Homepage Display | Status   |
| --------------- | ----------------------------- | -------------- | ---------------- | -------- |
| **Kegiatan**    | Flask API (`/api/kegiatan`)   | ✅ Semua input | ✅ Real-time     | 🟢 AKTIF |
| **Pengumuman**  | Supabase (`pengumuman`)       | ✅ Semua input | ✅ Real-time     | 🟢 AKTIF |
| **Galeri**      | Supabase (`galeri`) + Storage | ✅ Upload foto | ✅ Real-time     | 🟢 AKTIF |
| **Khotib/Imam** | Supabase (`khotib_imam`)      | ✅ Semua input | ✅ Real-time     | 🟢 AKTIF |
| **Bilal**       | Supabase (`bilal_jumat`)      | ✅ Semua input | ✅ Real-time     | 🟢 AKTIF |
| **Muadzin**     | Supabase (`muadzin_jumat`)    | ✅ Semua input | ✅ Real-time     | 🟢 AKTIF |

## Cara Kerja

### 1. Kegiatan

```
Admin (/admin/kegiatan.html)
  ↓ Input → Form
  ↓ POST ke http://127.0.0.1:5000/api/kegiatan
  ↓
Backend (Flask)
  ↓ Simpan di memory (kegiatan = [])
  ↓
Homepage (/index.html)
  ↓ Fetch GET http://127.0.0.1:5000/api/kegiatan
  ↓ Tampilkan di "Kegiatan" section
```

### 2. Pengumuman, Galeri, Khotib, Bilal, Muadzin

```
Admin (/admin/)
  ↓ Input/Upload
  ↓ Supabase Insert
  ↓
Supabase Database
  ↓
Homepage (/index.html)
  ↓ Fetch dari Supabase
  ↓ Tampilkan di section masing-masing
```

## Checklist Setup ✅

Pastikan:

- [ ] Backend Flask berjalan: `python app.py` di folder `/backend`
- [ ] CORS enabled di Flask (sudah dikonfigurasi)
- [ ] Supabase credentials di `/admin/js/supabase.js` dan `/js/supabase.js`
- [ ] Admin bisa diakses di: `http://127.0.0.1:5000/admin/login.html`
- [ ] Homepage bisa diakses di: `http://127.0.0.1:5000/` atau `http://127.0.0.1:5000/index.html`

## Troubleshooting

### Data tidak muncul di homepage?

1. **Kegiatan tidak muncul:**
   - Pastikan Flask backend running
   - Check browser console untuk error
   - Verifikasi URL API: `http://127.0.0.1:5000/api/kegiatan`

2. **Pengumuman/Galeri/Khotib tidak muncul:**
   - Pastikan Supabase credentials valid
   - Check network tab di DevTools
   - Verifikasi table names di Supabase

3. **CORS Error:**
   - Flask CORS sudah enabled
   - Restart Flask server jika perlu

## File yang Telah Diperbaiki

- ✅ `/js/homepage.js` - Kegiatan sekarang fetch dari Flask API
- ✅ `/admin/js/login.js` - Redirect ke dashboard.html (sudah diperbaiki sebelumnya)

## Catatan Penting

⚠️ **Data Kegiatan di Flask adalah In-Memory**

- Data akan hilang jika server restart
- Untuk production, gunakan database persistent (MySQL, PostgreSQL, etc)
- Saat ini cocok untuk testing dan demo

## Next Steps (Optional)

Untuk production-ready:

1. Implementasi database persistent (MySQL/PostgreSQL)
2. Tambahkan authentication/authorization
3. Implementasi upload image untuk kegiatan
4. Backup data secara berkala
