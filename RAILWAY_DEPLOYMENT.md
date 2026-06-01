# Railway Deployment Guide

## Overview

Proyek ini dikonfigurasi untuk deployment di Railway menggunakan `railway.json` dan Docker.

## File Konfigurasi

### railway.json

File ini berisi konfigurasi untuk Railway:

- **builder**: DOCKERFILE
- **dockerfilePath**: backend/Dockerfile

Railway akan membangun aplikasi menggunakan `backend/Dockerfile` dengan context dari root project.

## Docker Configuration

### Dockerfile (backend/Dockerfile)

Dockerfile ini:

1. Menggunakan Python 3.11-slim sebagai base image
2. Menginstall dependencies dari `backend/requirements.txt`
3. Mengcopy file backend app (`app.py`)
4. Mengcopy semua file statis frontend (css, js, images, admin, index.html)
5. Membuat directory `uploads` untuk user-uploaded files
6. Menjalankan aplikasi dengan Gunicorn

### Environment Variables (Railway Dashboard)

Set variabel berikut di Railway dashboard:

- `PORT`: Port aplikasi (default: 5000)
- `SECRET_KEY`: Flask secret key untuk session encryption
- `DATABASE_PATH`: Path untuk SQLite database (optional, default: /app/data.db)
- `UPLOAD_FOLDER`: Path untuk folder upload (optional, default: /app/uploads)

## Deployment Steps

1. Push kode ke GitHub repository
2. Buat project baru di Railway
3. Connect ke GitHub repository Anda
4. Railway akan otomatis detect dan menggunakan `railway.json`
5. Set environment variables di Railway dashboard
6. Deploy akan berjalan otomatis

## Application Structure

```
/app (Docker WORKDIR)
├── app.py                 # Flask aplikasi
├── index.html             # Homepage
├── css/                   # CSS files
├── js/                    # JavaScript files
├── images/                # Image files
├── admin/                 # Admin dashboard
├── uploads/               # User-uploaded files
└── data.db               # SQLite database
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/status` - Status backend
- `GET/POST/PUT/DELETE /api/kegiatan` - Kegiatan management
- `GET/POST/DELETE /api/pengumuman` - Pengumuman management
- `GET/POST/DELETE /api/galeri` - Galeri management
- `GET/POST /api/khotib` - Jadwal khotib management
- `POST /api/upload` - Upload file

## Troubleshooting

### 404 Errors

Jika mendapat 404 untuk `/api/*` endpoints atau file statis:

1. Periksa bahwa semua file ter-copy dengan benar di Docker image
2. Pastikan `PROJECT_ROOT` terdeteksi dengan benar
3. Check logs di Railway dashboard

### Database Errors

Jika database tidak ditemukan:

1. Aplikasi akan otomatis membuat database pada startup
2. Database akan tersimpan di `/app/data.db` dalam container
3. Pastikan directory `/app` memiliki write permission

### Static Files Not Loading

1. Pastikan file statis ada di paths yang benar (css/, js/, images/, admin/)
2. Pastikan `index.html` ada di root project
3. Check Flask routes untuk `/css/<path:filename>`, `/js/<path:filename>`, etc.

## Local Development

Untuk testing lokal sebelum push ke Railway:

```bash
# Build Docker image
docker build -f backend/Dockerfile -t masjid-assalam .

# Run container
docker run -p 5000:5000 \
  -e SECRET_KEY=dev-secret \
  -e PORT=5000 \
  masjid-assalam

# Access aplikasi
# Homepage: http://localhost:5000
# Health: http://localhost:5000/health
# API Status: http://localhost:5000/api/status
```

## Files Modified/Created

- `railway.json` - Konfigurasi Railway (NEW)
- `backend/Dockerfile` - Updated untuk copy semua file statis
- `Dockerfile` - Updated untuk konsistensi
- `backend/app.py` - Updated:
  - Better PROJECT_ROOT detection
  - Automatic DATABASE path configuration untuk Docker
  - Error handling untuk static file routes
- `.env.example` - Environment variables template (NEW)

## Next Steps

Setelah deployment:

1. Test API endpoints via `/health` dan `/api/status`
2. Verify database initialization berhasil
3. Test upload functionality
4. Monitor logs di Railway dashboard untuk errors
