# Masjid Assalam

Project backend Flask untuk aplikasi web Masjid Assalam.

## Docker
## Railway Deployment

Proyek ini dikonfigurasi untuk deployment di Railway. Lihat [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) untuk panduan lengkap.

### Quick Start Railway
1. Push ke GitHub
2. Buat project baru di Railway dan connect ke repo
3. Set environment variables di Railway dashboard
4. Railway akan otomatis build dan deploy menggunakan `railway.json`


Build image (root Dockerfile):

```bash
docker build -t masjid-assalam .
```

Run:
Build dengan backend Dockerfile:

```bash
docker build -f backend/Dockerfile -t masjid-assalam .
```


```bash
docker run -p 5000:5000 masjid-assalam
docker run -p 5000:5000 \
	-e SECRET_KEY=your-secret-key \
	-e PORT=5000 \
	masjid-assalam

Alternatif dengan Docker Compose:
Dengan Docker Compose:
```bash
docker compose build
```
```

Run di background:

```bash
docker compose up -d
```

## Environment

Salin file contoh:
Buat file `.env` di root project atau set environment variables:
```bash
cp backend/.env.example backend/.env
cp .env.example .env

Isi `backend/.env` dengan:
Isi `.env` dengan:
```env
SECRET_KEY=your-secret-key
SECRET_KEY=your-secret-key-here
PORT=5000
DATABASE_PATH=data.db
UPLOAD_FOLDER=uploads


## Recent Changes (Fix Session)

### Files Modified
- **backend/Dockerfile**: Updated untuk copy semua file statis frontend
- **Dockerfile**: Updated untuk konsistensi dengan backend/Dockerfile
- **backend/app.py**: 
	- Better PROJECT_ROOT detection (handles Docker environment)
	- Automatic database path configuration
	- Improved error handling untuk static file routes dengan try-except

### Files Created
- **railway.json**: Konfigurasi Railway deployment
- **.env.example**: Template untuk environment variables
- **RAILWAY_DEPLOYMENT.md**: Panduan lengkap Railway deployment

### Key Fixes
1. ✅ Static files (CSS, JS, Images) now properly copied to Docker image
2. ✅ Better handling of file paths in Docker vs local development
3. ✅ API endpoints (/api/kegiatan, /api/status, /health) properly routed
4. ✅ Error handling untuk missing files returns proper 404 responses
5. ✅ Database configuration works correctly in Docker environment
## Endpoint penting

- `GET /health` (health check)
- `GET /api/status`
- `GET /api/kegiatan`
- `GET /api/pengumuman`
- `GET /api/galeri`
- `GET /api/khotib`

## Catatan

- Backend sekarang menggunakan SQLite untuk menyimpan data.
- Upload gambar disimpan di `backend/uploads`.
- Jangan commit `backend/.env`, `.venv`, atau `uploads/`.
