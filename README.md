# Masjid Assalam

Project backend Flask untuk aplikasi web Masjid Assalam.

## Docker

Build image (root Dockerfile):

```bash
docker build -t masjid-assalam .
```

Run:

```bash
docker run -p 5000:5000 masjid-assalam
```

Alternatif dengan Docker Compose:

```bash
docker compose build
```

Run:

```bash
docker compose up
```

Run di background:

```bash
docker compose up -d
```

## Environment

Salin file contoh:

```bash
cp backend/.env.example backend/.env
```

Isi `backend/.env` dengan:

```env
SECRET_KEY=your-secret-key
```

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
