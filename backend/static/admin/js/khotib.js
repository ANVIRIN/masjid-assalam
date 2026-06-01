// =============================== // KHOTIB & IMAM // ===============================
async function getKhotib() {
  const { data } = await client.from("khotib_imam").select("*");
  let html = "";
  data.forEach((item) => {
    html += ` <tr> <td>${item.tanggal}</td> <td>${item.khotib}</td> <td>${item.imam}</td> <td> <button class="btn-delete" onclick="hapusKhotib(${item.id})"> Hapus </button> </td> </tr> `;
  });
  document.getElementById("data-khotib").innerHTML = html;
}
async function tambahKhotib() {
  await client
    .from("khotib_imam")
    .insert([
      {
        tanggal: document.getElementById("tanggal-khotib").value,
        khotib: document.getElementById("khotib").value,
        imam: document.getElementById("imam").value,
      },
    ]);
  getKhotib();
}
async function hapusKhotib(id) {
  await client.from("khotib_imam").delete().eq("id", id);
  getKhotib();
}
// =============================== // BILAL // ===============================
async function getBilal() {
  const { data } = await client.from("bilal_jumat").select("*");
  let html = "";
  data.forEach((item) => {
    html += ` <tr> <td>${item.tanggal}</td> <td>${item.bilal}</td> <td> <button class="btn-delete" onclick="hapusBilal(${item.id})"> Hapus </button> </td> </tr> `;
  });
  document.getElementById("data-bilal").innerHTML = html;
}
async function tambahBilal() {
  await client
    .from("bilal_jumat")
    .insert([
      {
        tanggal: document.getElementById("tanggal-bilal").value,
        bilal: document.getElementById("bilal").value,
      },
    ]);
  getBilal();
}
async function hapusBilal(id) {
  await client.from("bilal_jumat").delete().eq("id", id);
  getBilal();
}
// =============================== // MUADZIN // ===============================
async function getMuadzin() {
  const { data } = await client.from("muadzin_jumat").select("*");
  let html = "";
  data.forEach((item) => {
    html += ` <tr> <td>${item.tanggal}</td> <td>${item.muadzin}</td> <td> <button class="btn-delete" onclick="hapusMuadzin(${item.id})"> Hapus </button> </td> </tr> `;
  });
  document.getElementById("data-muadzin").innerHTML = html;
}
async function tambahMuadzin() {
  await client
    .from("muadzin_jumat")
    .insert([
      {
        tanggal: document.getElementById("tanggal-muadzin").value,
        muadzin: document.getElementById("muadzin").value,
      },
    ]);
  getMuadzin();
}
async function hapusMuadzin(id) {
  await client.from("muadzin_jumat").delete().eq("id", id);
  getMuadzin();
}
// LOAD
getKhotib();
getBilal();
getMuadzin();
