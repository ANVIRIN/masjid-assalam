async function getPengumuman() {
  const { data, error } = await client
    .from("pengumuman")
    .select("*")
    .order("id", { ascending: false });
  if (error) {
    console.error("Gagal memuat pengumuman:", error);
    document.getElementById("list-pengumuman").innerHTML =
      "<div class='text-danger'>Gagal memuat pengumuman.</div>";
    return;
  }

  let html = "";
  if (!data || data.length === 0) {
    html = "<div class='text-muted'>Belum ada pengumuman.</div>";
  } else {
    data.forEach((item) => {
      html += ` <div class="announcement-card"> <h3> ${item.judul} </h3> <p> ${item.isi} </p> <div class="date-badge"> <i class="bi bi-calendar-event"></i> ${item.tanggal} </div> <br> <button onclick="hapusPengumuman(${item.id})" class="btn-delete"> <i class="bi bi-trash"></i> Hapus </button> </div> `;
    });
  }

  document.getElementById("list-pengumuman").innerHTML = html;
}

async function tambahPengumuman() {
  const judul = document.getElementById("judul").value.trim();
  const isi = document.getElementById("isi").value.trim();
  const tanggal = document.getElementById("tanggal").value;

  if (!judul || !isi || !tanggal) {
    alert("Semua field pengumuman harus diisi.");
    return;
  }

  const { error } = await client
    .from("pengumuman")
    .insert([{ judul, isi, tanggal }]);
  if (error) {
    alert("Gagal menyimpan pengumuman: " + error.message);
    return;
  }

  document.getElementById("judul").value = "";
  document.getElementById("isi").value = "";
  document.getElementById("tanggal").value = "";
  getPengumuman();
}

async function hapusPengumuman(id) {
  const yakin = confirm("Hapus pengumuman ini?");
  if (!yakin) return;

  const { error } = await client.from("pengumuman").delete().eq("id", id);
  if (error) {
    alert("Gagal menghapus pengumuman: " + error.message);
    return;
  }

  getPengumuman();
}

getPengumuman();
