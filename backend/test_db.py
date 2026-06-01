import sqlite3

conn = sqlite3.connect('data.db')
cursor = conn.cursor()

# Check tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("Tabel yang ada:", cursor.fetchall())

# Check kegiatan
cursor.execute("SELECT * FROM kegiatan")
kegiatan = cursor.fetchall()
print(f"Total kegiatan: {len(kegiatan)}")
print("Data kegiatan:", kegiatan)

conn.close()
