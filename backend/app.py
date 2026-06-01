from flask import Flask, jsonify, request, send_from_directory, g
from flask_cors import CORS
from werkzeug.utils import secure_filename
import jsonS
import os
from supabase import create_client
from dotenv import load_dotenv
load_dotenv()
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("https://unyxfbgwozuxhuzpsfli.supabase.co")
SUPABASE_KEY = os.getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVueXhmYmd3b3p1eGh1enBzZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5Njc4NjMsImV4cCI6MjA5NTU0Mzg2M30.p4xOiYO84BA9oeOfrzVrLi4dz298MQ970nL5vqwJdrg")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE env belum diisi")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Determine PROJECT_ROOT dynamically
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
APP_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))
ROOT_DIR = os.path.abspath(os.path.join(APP_DIR, '..'))

# Try to find project root by looking for index.html or using APP_DIR
if os.path.exists(os.path.join(APP_DIR, 'index.html')):
    PROJECT_ROOT = APP_DIR
elif os.path.exists(os.path.join(ROOT_DIR, 'index.html')):
    PROJECT_ROOT = ROOT_DIR
else:
    PROJECT_ROOT = APP_DIR  # Fallback to APP_DIR

app = Flask(__name__, static_folder=None)
app.config['JSON_AS_ASCII'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'masjid-assalam-secret')
CORS(app)

PORT = int(os.getenv('PORT', 8080))
UPLOAD_FOLDER = os.path.abspath(os.getenv('UPLOAD_FOLDER', os.path.join(PROJECT_ROOT, 'uploads')))

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/api/kegiatan', methods=['GET'])
def get_kegiatan():
    response = supabase.table("kegiatan").select("*").execute()
    records = response.data or []
    for record in records:
        if "nama_kegiatan" in record and "nama" not in record:
            record["nama"] = record.get("nama_kegiatan")
    return jsonify(records)


@app.route('/api/kegiatan', methods=['POST'])
def tambah_kegiatan():
    data = request.json
    nama_value = data.get("nama") or data.get("nama_kegiatan")

    response = supabase.table("kegiatan").insert({
        "nama_kegiatan": nama_value,
        "hari": data.get("hari"),
        "waktu": data.get("waktu"),
        "deskripsi": data.get("deskripsi")
    }).execute()

    inserted = response.data or []
    if inserted:
        inserted[0]["nama"] = inserted[0].get("nama_kegiatan")
    return jsonify(inserted)


@app.route('/api/kegiatan/<int:id>', methods=['PUT'])
def edit_kegiatan(id):
    data = request.json
    nama_value = data.get("nama") or data.get("nama_kegiatan")

    response = supabase.table("kegiatan").update({
        "nama_kegiatan": nama_value,
        "hari": data.get("hari"),
        "waktu": data.get("waktu"),
        "deskripsi": data.get("deskripsi")
    }).eq("id", id).execute()

    updated = response.data or []
    for record in updated:
        if "nama_kegiatan" in record and "nama" not in record:
            record["nama"] = record.get("nama_kegiatan")
    return jsonify(updated)


@app.route('/api/kegiatan/<int:id>', methods=['DELETE'])
def hapus_kegiatan(id):
    response = supabase.table("kegiatan").delete().eq("id", id).execute()
    return jsonify({"message": "deleted"})


@app.route('/api/pengumuman', methods=['GET'])
def get_pengumuman():
    response = supabase.table("pengumuman").select("*").execute()
    return jsonify(response.data)


@app.route('/api/pengumuman', methods=['POST'])
def tambah_pengumuman():
    data = request.json

    response = supabase.table("pengumuman").insert({
        "judul": data.get("judul"),
        "isi": data.get("isi"),
        "tanggal": data.get("tanggal")
    }).execute()

    return jsonify(response.data)


@app.route('/api/pengumuman/<int:id>', methods=['DELETE'])
def hapus_pengumuman(id):
    supabase.table("pengumuman").delete().eq("id", id).execute()

    return jsonify({
        "message": "deleted"
    })


@app.route('/api/galeri', methods=['GET'])
def get_galeri():
    response = supabase.table("galeri").select("*").execute()
    return jsonify(response.data)


@app.route('/api/galeri', methods=['POST'])
def upload_galeri():
    data = request.json

    response = supabase.table("galeri").insert({
        "judul": data.get("judul"),
        "gambar": data.get("gambar")
    }).execute()

    return jsonify(response.data)


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except:
        return jsonify({'error': 'File not found'}), 404


@app.route('/api/galeri/<int:id>', methods=['DELETE'])
def hapus_galeri(id):
    supabase.table("galeri").delete().eq("id", id).execute()

    return jsonify({
        "message": "deleted"
    })


@app.route('/api/khotib', methods=['GET'])
def get_khotib():
    response = supabase.table("khotib_imam").select("*").execute()
    return jsonify(response.data)

@app.route('/api/khotib', methods=['POST'])
def tambah_khotib():
    data = request.json

    response = supabase.table("khotib_imam").insert({
        "tanggal": data.get("tanggal"),
        "khotib": data.get("khotib"),
        "imam": data.get("imam")
    }).execute()

    return jsonify(response.data)


@app.route('/css/<path:filename>')
def css_files(filename):
    try:
        return send_from_directory(os.path.join(PROJECT_ROOT, 'css'), filename)
    except:
        return jsonify({'error': 'CSS file not found'}), 404


@app.route('/js/<path:filename>')
def js_files(filename):
    try:
        return send_from_directory(os.path.join(PROJECT_ROOT, 'js'), filename)
    except:
        return jsonify({'error': 'JS file not found'}), 404


@app.route('/images/<path:filename>')
def image_files(filename):
    try:
        return send_from_directory(os.path.join(PROJECT_ROOT, 'images'), filename)
    except:
        return jsonify({'error': 'Image file not found'}), 404


@app.route('/admin/<path:filename>')
def admin_files(filename):
    try:
        return send_from_directory(os.path.join(PROJECT_ROOT, 'admin'), filename)
    except:
        return jsonify({'error': 'Admin file not found'}), 404


@app.route('/index.html')
def index_html():
    try:
        return send_from_directory(PROJECT_ROOT, 'index.html')
    except:
        return jsonify({'error': 'Index file not found'}), 404


@app.route('/')
def home():
    return send_from_directory(PROJECT_ROOT, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(PROJECT_ROOT, path)

@app.route('/health')
def health():
    return {'status': 'ok'}

@app.route('/api/status')
def status():
    payload = {
        'message': 'Backend Masjid Besar Assalam Aktif'
    }
    return app.response_class(json.dumps(payload, ensure_ascii=False), mimetype='application/json; charset=utf-8')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
