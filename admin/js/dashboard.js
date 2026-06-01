// =============================== // TOTAL KEGIATAN // ===============================
async function totalKegiatan() {
  try {
    const response = await fetch("/api/kegiatan");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    document.getElementById("total-kegiatan").innerHTML = data.length;
  } catch (error) {
    console.log(error);
  }
}
// =============================== // TOTAL GALERI // ===============================
async function totalGaleri() {
  const { data, error } = await client.from("galeri").select("*");
  if (error) {
    console.log(error);
    return;
  }
  document.getElementById("total-galeri").innerHTML = data.length;
}
// =============================== // TOTAL PENGUMUMAN // ===============================
async function totalPengumuman() {
  const { data, error } = await client.from("pengumuman").select("*");
  if (error) {
    console.log(error);
    return;
  }
  document.getElementById("total-pengumuman").innerHTML = data.length;
}
// =============================== // TOTAL KHOTIB // ===============================
async function totalKhotib() {
  const { data, error } = await client.from("khotib_imam").select("*");
  if (error) {
    console.log(error);
    return;
  }
  document.getElementById("total-khotib").innerHTML = data.length;
}
// LOAD SEMUA
setInterval(() => {
  totalKegiatan();
  totalGaleri();
  totalPengumuman();
  totalKhotib();
}, 100);
