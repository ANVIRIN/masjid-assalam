fetch(
  "https://api.aladhan.com/v1/timingsByCity?city=Pasuruan&country=Indonesia&method=11",
)
  .then((response) => response.json())

  .then((data) => {
    const timings = data.data.timings;

    document.getElementById("subuh").innerHTML = timings.Fajr;
    document.getElementById("dzuhur").innerHTML = timings.Dhuhr;
    document.getElementById("ashar").innerHTML = timings.Asr;
    document.getElementById("maghrib").innerHTML = timings.Maghrib;
    document.getElementById("isya").innerHTML = timings.Isha;
  });

const SUPABASE_URL = "https://unyxfbgwozuxhuzpsfli.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVueXhmYmd3b3p1eGh1enBzZmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5Njc4NjMsImV4cCI6MjA5NTU0Mzg2M30.p4xOiYO84BA9oeOfrzVrLi4dz298MQ970nL5vqwJdrg";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function getKegiatan() {
  try {
    const backendMeta = document.querySelector('meta[name="backend-url"]');
    const backendBase = backendMeta && backendMeta.content ? backendMeta.content.replace(/\/$/, '') : location.origin;
    const apiUrl = `${backendBase}/api/kegiatan`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    const data = await response.json();
    renderKegiatan(data || []);
  } catch (error) {
    console.error("Gagal memuat kegiatan:", error);
    renderKegiatan([]);
  }
}

function renderKegiatan(items) {
  const container = document.getElementById("kegiatan-list");
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
            <div class="col-12 text-center text-muted">
                Belum ada kegiatan.
            </div>
        `;
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
            <div class="col-md-4">
                <div class="activity-card">
                    <i class="bi bi-calendar-event"></i>
                    <h4>${item.nama ?? ""}</h4>
                    <p>${item.hari ?? ""} - ${item.waktu ?? ""}</p>
                    <p>${item.deskripsi ?? ""}</p>
                </div>
            </div>
        `,
    )
    .join("");
}

getKegiatan();

async function uploadGaleriFoto() {
  const fileInput = document.getElementById("gambar");
  if (!fileInput || !fileInput.files.length) {
    return;
  }

  const file = fileInput.files[0];
  await client.storage.from("galeri").upload(`foto-${Date.now()}`, file);
}
