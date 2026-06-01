from flask import Flask, jsonify, request, send_from_directory, g
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sqlite3
from werkzeug.utils import secure_filename
import json

load_dotenv()
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PROJECT_ROOT = BASE_DIR
if not os.path.exists(os.path.join(PROJECT_ROOT, 'index.html')):
    PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..'))
if not os.path.exists(PROJECT_ROOT):
    PROJECT_ROOT = BASE_DIR

app = Flask(__name__, static_folder=None)
app.config['JSON_AS_ASCII'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'masjid-assalam-secret')
CORS(app)

PORT = int(os.getenv('PORT', 5000))
DATABASE = os.path.abspath(os.getenv('DATABASE_PATH', 'data.db'))
UPLOAD_FOLDER = os.path.abspath(os.getenv('UPLOAD_FOLDER', 'uploads'))

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE, check_same_thread=False)
        g.db.row_factory = sqlite3.Row
    return g.db


def init_db():
    db = sqlite3.connect(DATABASE)
    cursor = db.cursor()
    cursor.execute(
        '''CREATE TABLE IF NOT EXISTS kegiatan (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT NOT NULL,
            hari TEXT,
            waktu TEXT,
            deskripsi TEXT
        )'''
    )
    cursor.execute(
        '''CREATE TABLE IF NOT EXISTS pengumuman (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            judul TEXT NOT NULL,
            isi TEXT,
            tanggal TEXT
        )'''
    )
    cursor.execute(
        '''CREATE TABLE IF NOT EXISTS galeri (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            judul TEXT NOT NULL,
            gambar TEXT NOT NULL
        )'''
    )
    cursor.execute(
        '''CREATE TABLE IF NOT EXISTS khotib (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tanggal TEXT NOT NULL,
            khotib TEXT NOT NULL,
            imam TEXT NOT NULL
        )'''
    )
    db.commit()
    db.close()


@app.teardown_appcontext
def close_db(exception=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()


def row_to_dict(row):
    return dict(row) if row else None


@app.route('/api/kegiatan', methods=['GET'])
def get_kegiatan():
    db = get_db()
    cursor = db.execute('SELECT * FROM kegiatan ORDER BY id')
    rows = cursor.fetchall()
    return jsonify([row_to_dict(row) for row in rows])


@app.route('/api/kegiatan', methods=['POST'])
def tambah_kegiatan():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        'INSERT INTO kegiatan (nama, hari, waktu, deskripsi) VALUES (?, ?, ?, ?)',
        (data.get('nama'), data.get('hari'), data.get('waktu'), data.get('deskripsi'))
    )
    db.commit()
    item_id = cursor.lastrowid
    cursor = db.execute('SELECT * FROM kegiatan WHERE id = ?', (item_id,))
    return jsonify({
        'message': 'Kegiatan berhasil ditambahkan',
        'data': row_to_dict(cursor.fetchone())
    })


@app.route('/api/kegiatan/<int:id>', methods=['PUT', 'PATCH'])
def edit_kegiatan(id):
    data = request.json
    db = get_db()
    cursor = db.execute('SELECT * FROM kegiatan WHERE id = ?', (id,))
    item = cursor.fetchone()
    if item is None:
        return jsonify({'message': 'Kegiatan tidak ditemukan'}), 404

    updated = {
        'nama': data.get('nama', item['nama']),
        'hari': data.get('hari', item['hari']),
        'waktu': data.get('waktu', item['waktu']),
        'deskripsi': data.get('deskripsi', item['deskripsi'])
    }
    db.execute(
        'UPDATE kegiatan SET nama = ?, hari = ?, waktu = ?, deskripsi = ? WHERE id = ?',
        (updated['nama'], updated['hari'], updated['waktu'], updated['deskripsi'], id)
    )
    db.commit()
    cursor = db.execute('SELECT * FROM kegiatan WHERE id = ?', (id,))
    return jsonify({
        'message': 'Kegiatan berhasil diupdate',
        'data': row_to_dict(cursor.fetchone())
    })


@app.route('/api/kegiatan/<int:id>', methods=['DELETE'])
def hapus_kegiatan(id):
    db = get_db()
    db.execute('DELETE FROM kegiatan WHERE id = ?', (id,))
    db.commit()
    return jsonify({'message': 'Kegiatan berhasil dihapus'})


@app.route('/api/pengumuman', methods=['GET'])
def get_pengumuman():
    db = get_db()
    cursor = db.execute('SELECT * FROM pengumuman ORDER BY id')
    return jsonify([row_to_dict(row) for row in cursor.fetchall()])


@app.route('/api/pengumuman', methods=['POST'])
def tambah_pengumuman():
    data = request.json
    db = get_db()
    db.execute(
        'INSERT INTO pengumuman (judul, isi, tanggal) VALUES (?, ?, ?)',
        (data.get('judul'), data.get('isi'), data.get('tanggal'))
    )
    db.commit()
    return jsonify({'message': 'Pengumuman berhasil ditambahkan'})


@app.route('/api/pengumuman/<int:id>', methods=['DELETE'])
def hapus_pengumuman(id):
    db = get_db()
    db.execute('DELETE FROM pengumuman WHERE id = ?', (id,))
    db.commit()
    return jsonify({'message': 'Pengumuman berhasil dihapus'})


@app.route('/api/galeri', methods=['GET'])
def get_galeri():
    db = get_db()
    cursor = db.execute('SELECT * FROM galeri ORDER BY id')
    return jsonify([row_to_dict(row) for row in cursor.fetchall()])


@app.route('/api/galeri', methods=['POST'])
def upload_galeri():
    file = request.files.get('gambar')
    judul = request.form.get('judul')
    if not file or not judul:
        return jsonify({'message': 'Gambar dan judul diperlukan'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    db = get_db()
    db.execute(
        'INSERT INTO galeri (judul, gambar) VALUES (?, ?)',
        (judul, f'/uploads/{filename}')
    )
    db.commit()
    return jsonify({'message': 'Galeri berhasil ditambahkan'})


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/api/galeri/<int:id>', methods=['DELETE'])
def hapus_galeri(id):
    db = get_db()
    cursor = db.execute('SELECT gambar FROM galeri WHERE id = ?', (id,))
    row = cursor.fetchone()
    if row:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], os.path.basename(row['gambar']))
        if os.path.exists(file_path):
            os.remove(file_path)
    db.execute('DELETE FROM galeri WHERE id = ?', (id,))
    db.commit()
    return jsonify({'message': 'Galeri berhasil dihapus'})


@app.route('/api/khotib', methods=['GET'])
def get_khotib():
    db = get_db()
    cursor = db.execute('SELECT * FROM khotib ORDER BY id')
    return jsonify([row_to_dict(row) for row in cursor.fetchall()])


@app.route('/api/khotib', methods=['POST'])
def tambah_khotib():
    data = request.json
    db = get_db()
    db.execute(
        'INSERT INTO khotib (tanggal, khotib, imam) VALUES (?, ?, ?)',
        (data.get('tanggal'), data.get('khotib'), data.get('imam'))
    )
    db.commit()
    return jsonify({'message': 'Jadwal khotib berhasil ditambahkan'})


@app.route('/css/<path:filename>')
def css_files(filename):
    return send_from_directory(os.path.join(PROJECT_ROOT, 'css'), filename)


@app.route('/js/<path:filename>')
def js_files(filename):
    return send_from_directory(os.path.join(PROJECT_ROOT, 'js'), filename)


@app.route('/images/<path:filename>')
def image_files(filename):
    return send_from_directory(os.path.join(PROJECT_ROOT, 'images'), filename)


@app.route('/admin/<path:filename>')
def admin_files(filename):
    return send_from_directory(os.path.join(PROJECT_ROOT, 'admin'), filename)


@app.route('/index.html')
def index_html():
    return send_from_directory(PROJECT_ROOT, 'index.html')


@app.route('/')
def home():
    return send_from_directory(PROJECT_ROOT, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(PROJECT_ROOT, path)

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})


@app.route('/api/status')
def status():
    payload = {
        'message': 'Backend Masjid Besar Assalam Aktif ??'
    }
    return app.response_class(json.dumps(payload, ensure_ascii=False), mimetype='application/json; charset=utf-8')


with app.app_context():
    init_db()


PORT = int(os.environ.get("PORT", 5000))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
