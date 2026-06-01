// JADWAL SHOLAT
async function tampilJadwalSholat() {
  try {
    const response = await fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Pasuruan&country=Indonesia&method=11",
    );
    const result = await response.json();
    const timings = result.data.timings;

    document.getElementById("subuh").innerText = timings.Fajr || "--:--";
    document.getElementById("dzuhur").innerText = timings.Dhuhr || "--:--";
    document.getElementById("ashar").innerText = timings.Asr || "--:--";
    document.getElementById("maghrib").innerText = timings.Maghrib || "--:--";
    document.getElementById("isya").innerText = timings.Isha || "--:--";
  } catch (error) {
    console.error("Gagal memuat jadwal sholat:", error);
  }
}

tampilJadwalSholat();

// KEGIATAN
async function tampilKegiatan() {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/kegiatan");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    if (!data || data.length === 0) {
      document.getElementById("kegiatan-list").innerHTML =
        "<div class='col-12 text-center text-muted'>Belum ada kegiatan.</div>";
      return;
    }

    document.getElementById("kegiatan-list").innerHTML = data
      .map(
        (item) => `
        <div class="col-md-4">
          <div class="activity-card">
            <h4>${item.nama ?? ""}</h4>
            <p>${item.hari ?? ""}</p>
            <small>${item.waktu ?? ""}</small>
            <p>${item.deskripsi ?? ""}</p>
          </div>
        </div>
      `,
      )
      .join("");
  } catch (error) {
    console.error("Gagal memuat kegiatan:", error);
    document.getElementById("kegiatan-list").innerHTML =
      "<div class='col-12 text-danger'>Gagal memuat kegiatan.</div>";
  }
}

// GALERI
async function getHomepageGaleri() {
  const { data, error } = await client
    .from("galeri")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  let html = "";

  data.forEach((item, index) => {
    html += `
    
    <div class="carousel-item ${index === 0 ? "active" : ""}">
    
        <div class="gallery-slider">

            <img src="${item.gambar}"
            class="d-block w-100 gallery-image">

            <div class="gallery-overlay">

                <h3>
                    ${item.judul}
                </h3>

            </div>

        </div>

    </div>
    
    `;
  });

  document.getElementById("homepage-galeri").innerHTML = html;
}

// PENGUMUMAN
async function tampilPengumuman() {
  const { data, error } = await client
    .from("pengumuman")
    .select("*")
    .order("tanggal", { ascending: false });
  if (error) {
    console.error("Gagal memuat pengumuman:", error);
    document.getElementById("homepage-pengumuman").innerHTML =
      "<div class='text-danger'>Gagal memuat pengumuman.</div>";
    return;
  }

  if (!data || data.length === 0) {
    document.getElementById("homepage-pengumuman").innerHTML =
      "<div class='text-center text-muted'>Belum ada pengumuman.</div>";
    return;
  }

  document.getElementById("homepage-pengumuman").innerHTML = data
    .map(
      (item) => `
      <div class="announcement-card">

          <h3>
              <i class="bi bi-megaphone-fill"></i>
              ${item.judul}
          </h3>

          <p>
              ${item.isi}
          </p>

          <div class="announcement-date">
              <i class="bi bi-calendar-event"></i>
              ${item.tanggal}
          </div>

      </div>
    `,
    )
    .join("");
}

// =============================== // KHOTIB & IMAM // ===============================
async function tampilKhotib() {
  const { data, error } = await client
    .from("khotib_imam")
    .select("*")
    .order("tanggal", { ascending: true });
  let html = "";
  data.forEach((item) => {
    html += ` <tr> <td>${item.tanggal}</td> <td>${item.khotib}</td> <td>${item.imam}</td> </tr> `;
  });
  document.getElementById("homepage-khotib").innerHTML = html;
} // =============================== // BILAL // ===============================
async function tampilBilal() {
  const { data, error } = await client
    .from("bilal_jumat")
    .select("*")
    .order("tanggal", { ascending: true });
  let html = "";
  data.forEach((item) => {
    html += ` <tr> <td>${item.tanggal}</td> <td>${item.bilal}</td> </tr> `;
  });
  document.getElementById("homepage-bilal").innerHTML = html;
} // =============================== // MUADZIN // ===============================
async function tampilMuadzin() {
  const { data, error } = await client
    .from("muadzin_jumat")
    .select("*")
    .order("tanggal", { ascending: true });
  let html = "";
  data.forEach((item) => {
    html += ` <tr> <td>${item.tanggal}</td> <td>${item.muadzin}</td> </tr> `;
  });
  document.getElementById("homepage-muadzin").innerHTML = html;
}

tampilKegiatan();
getHomepageGaleri();
tampilPengumuman();
tampilKhotib();
tampilBilal();
tampilMuadzin();
