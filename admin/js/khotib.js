// =============================== // KHOTIB & IMAM // ===============================
async function getKhotib() {
  const { data, error } = await client
    .from("khotib_imam")
    .select("*")
    .order("tanggal", { ascending: true });
  if (error) {
    console.error("Gagal memuat jadwal khotib/imam:", error);
    document.getElementById("data-khotib").innerHTML = `
      <tr>
        <td colspan="4" class="text-danger text-center">
          Gagal memuat data
        </td>
      </tr>
    `;
    return;
  }

  const rows = data || [];
  if (rows.length === 0) {
    document.getElementById("data-khotib").innerHTML = `
      <tr>
        <td colspan="4" class="text-muted text-center">
          Belum ada jadwal.
        </td>
      </tr>
    `;
    return;
  }

  let html = "";
  rows.forEach((item) => {
    html += `
      <tr>
        <td>${item.tanggal || ""}</td>
        <td>${item.khotib || ""}</td>
        <td>${item.imam || ""}</td>
        <td>
          <button type="button" class="btn-delete" onclick="hapusKhotib(${item.id})">Hapus</button>
        </td>
      </tr>
    `;
  });
  document.getElementById("data-khotib").innerHTML = html;
}

async function tambahKhotib() {
  const tanggal = document.getElementById("tanggal-khotib").value;
  const khotib = document.getElementById("khotib").value.trim();
  const imam = document.getElementById("imam").value.trim();

  if (!tanggal || !khotib || !imam) {
    alert("Semua field jadwal Khotib & Imam harus diisi.");
    return;
  }

  const { error } = await client.from("khotib_imam").insert([
    {
      tanggal,
      khotib,
      imam,
    },
  ]);

  if (error) {
    console.error("Gagal menyimpan jadwal khotib/imam:", error);
    alert("Gagal menyimpan jadwal: " + error.message);
    return;
  }

  document.getElementById("tanggal-khotib").value = "";
  document.getElementById("khotib").value = "";
  document.getElementById("imam").value = "";

  getKhotib();
}

async function hapusKhotib(id) {
  const { error } = await client.from("khotib_imam").delete().eq("id", id);
  if (error) {
    console.error("Gagal menghapus jadwal khotib/imam:", error);
    alert("Gagal menghapus jadwal: " + error.message);
    return;
  }
  getKhotib();
}

// =============================== // BILAL // ===============================
async function getBilal() {
  const { data, error } = await client
    .from("bilal_jumat")
    .select("*")
    .order("tanggal", { ascending: true });
  if (error) {
    console.error("Gagal memuat jadwal bilal:", error);
    document.getElementById("data-bilal").innerHTML = `
      <tr>
        <td colspan="3" class="text-danger text-center">
          Gagal memuat data
        </td>
      </tr>
    `;
    return;
  }

  const rows = data || [];
  if (rows.length === 0) {
    document.getElementById("data-bilal").innerHTML = `
      <tr>
        <td colspan="3" class="text-muted text-center">
          Belum ada jadwal.
        </td>
      </tr>
    `;
    return;
  }

  let html = "";
  rows.forEach((item) => {
    html += ` <tr> <td>${item.tanggal || ""}</td> <td>${item.bilal || ""}</td> <td> <button type="button" class="btn-delete" onclick="hapusBilal(${item.id})"> Hapus </button> </td> </tr> `;
  });
  document.getElementById("data-bilal").innerHTML = html;
}
async function tambahBilal() {
  const tanggal = document.getElementById("tanggal-bilal").value;
  const bilal = document.getElementById("bilal").value.trim();

  if (!tanggal || !bilal) {
    alert("Semua field jadwal Bilal harus diisi.");
    return;
  }

  const { error } = await client
    .from("bilal_jumat")
    .insert([{ tanggal, bilal }]);
  if (error) {
    console.error("Gagal menyimpan jadwal bilal:", error);
    alert("Gagal menyimpan jadwal: " + error.message);
    return;
  }

  document.getElementById("tanggal-bilal").value = "";
  document.getElementById("bilal").value = "";
  getBilal();
}
async function hapusBilal(id) {
  const { error } = await client.from("bilal_jumat").delete().eq("id", id);
  if (error) {
    console.error("Gagal menghapus jadwal bilal:", error);
    alert("Gagal menghapus jadwal: " + error.message);
    return;
  }
  getBilal();
}
// =============================== // MUADZIN // ===============================
async function getMuadzin() {
  const { data, error } = await client
    .from("muadzin_jumat")
    .select("*")
    .order("tanggal", { ascending: true });
  if (error) {
    console.error("Gagal memuat jadwal muadzin:", error);
    document.getElementById("data-muadzin").innerHTML = `
      <tr>
        <td colspan="3" class="text-danger text-center">
          Gagal memuat data
        </td>
      </tr>
    `;
    return;
  }

  const rows = data || [];
  if (rows.length === 0) {
    document.getElementById("data-muadzin").innerHTML = `
      <tr>
        <td colspan="3" class="text-muted text-center">
          Belum ada jadwal.
        </td>
      </tr>
    `;
    return;
  }

  let html = "";
  rows.forEach((item) => {
    html += ` <tr> <td>${item.tanggal || ""}</td> <td>${item.muadzin || ""}</td> <td> <button type="button" class="btn-delete" onclick="hapusMuadzin(${item.id})"> Hapus </button> </td> </tr> `;
  });
  document.getElementById("data-muadzin").innerHTML = html;
}
async function tambahMuadzin() {
  const tanggal = document.getElementById("tanggal-muadzin").value;
  const muadzin = document.getElementById("muadzin").value.trim();

  if (!tanggal || !muadzin) {
    alert("Semua field jadwal Muadzin harus diisi.");
    return;
  }

  const { error } = await client
    .from("muadzin_jumat")
    .insert([{ tanggal, muadzin }]);
  if (error) {
    console.error("Gagal menyimpan jadwal muadzin:", error);
    alert("Gagal menyimpan jadwal: " + error.message);
    return;
  }

  document.getElementById("tanggal-muadzin").value = "";
  document.getElementById("muadzin").value = "";
  getMuadzin();
}
async function hapusMuadzin(id) {
  const { error } = await client.from("muadzin_jumat").delete().eq("id", id);
  if (error) {
    console.error("Gagal menghapus jadwal muadzin:", error);
    alert("Gagal menghapus jadwal: " + error.message);
    return;
  }
  getMuadzin();
}
// LOAD
getKhotib();
getBilal();
getMuadzin();
