let editId = null;

// GET DATA
async function getKegiatan() {
  try {
    const response = await fetch("/api/kegiatan");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    let html = "";

    if (!data || data.length === 0) {
      html = `
      <tr>
        <td colspan="5"
        class="text-center text-muted">

          Belum ada kegiatan

        </td>
      </tr>
      `;
    } else {
      data.forEach((item) => {
        html += `
        <tr>

            <td>
                <strong>
                  ${item.nama}
                </strong>
            </td>

            <td>
                ${item.hari}
            </td>

            <td>
                ${item.waktu}
            </td>

            <td>
                ${item.deskripsi}
            </td>

            <td>

                <button
                onclick="editKegiatan(
                  ${item.id},
                  '${item.nama}',
                  '${item.hari}',
                  '${item.waktu}',
                  '${item.deskripsi}'
                )"
                class="btn-edit">

                    <i class="bi bi-pencil"></i>

                    Edit

                </button>

                <button
                onclick="hapusKegiatan(${item.id})"
                class="btn-delete">

                    <i class="bi bi-trash"></i>

                    Hapus

                </button>

            </td>

        </tr>
        `;
      });
    }

    document.getElementById("data-kegiatan").innerHTML = html;
  } catch (error) {
    console.error(error);
    document.getElementById("data-kegiatan").innerHTML = `
      <tr>
        <td colspan="5"
        class="text-danger text-center">

          Gagal memuat data

        </td>
      </tr>
    `;
  }
}

// TAMBAH / EDIT
async function tambahKegiatan() {
  const nama = document.getElementById("nama").value.trim();

  const hari = document.getElementById("hari").value.trim();

  const waktu = document.getElementById("waktu").value.trim();

  const deskripsi = document.getElementById("deskripsi").value.trim();

  if (!nama || !hari || !waktu || !deskripsi) {
    alert("Semua field wajib diisi");

    return;
  }

  // EDIT
  const payload = { nama, hari, waktu, deskripsi };

  if (editId) {
    const response = await fetch(`/api/kegiatan/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert("Gagal edit: " + errorText);
      return;
    }

    alert("Kegiatan berhasil diupdate");
  } else {
    const response = await fetch("/api/kegiatan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert("Gagal tambah: " + errorText);
      return;
    }

    alert("Kegiatan berhasil ditambahkan");
  }

  kosongkanForm();

  getKegiatan();
}

// EDIT
function editKegiatan(id, nama, hari, waktu, deskripsi) {
  editId = id;

  document.getElementById("nama").value = nama;

  document.getElementById("hari").value = hari;

  document.getElementById("waktu").value = waktu;

  document.getElementById("deskripsi").value = deskripsi;

  document.querySelector(".btn-modern").innerHTML = `
      <i class="bi bi-check-circle"></i>
      Simpan
    `;
}

// HAPUS
async function hapusKegiatan(id) {
  const yakin = confirm("Hapus kegiatan ini?");

  if (!yakin) return;

  const response = await fetch(`/api/kegiatan/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    alert("Gagal hapus: " + errorText);
    return;
  }

  getKegiatan();
}

// RESET FORM
function kosongkanForm() {
  editId = null;

  document.getElementById("nama").value = "";

  document.getElementById("hari").value = "";

  document.getElementById("waktu").value = "";

  document.getElementById("deskripsi").value = "";

  document.querySelector(".btn-modern").innerHTML = `
      <i class="bi bi-plus-circle"></i>
      Tambah
    `;
}

// LOAD
getKegiatan();
