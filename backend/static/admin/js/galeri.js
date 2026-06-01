let editId = null; // GET GALERI
async function getGaleri() {
  const { data, error } = await client
    .from("galeri")
    .select("*")
    .order("id", { ascending: false });
  if (error) {
    console.log(error);
    return;
  }
  let html = "";
  data.forEach((item) => {
    html += ` <div class="gallery-card"> <img src="${item.gambar}"> <div class="gallery-content"> <h4> ${item.judul} </h4> <button onclick="hapusGaleri(${item.id})" class="btn-delete"> <i class="bi bi-trash"></i> Hapus </button> </div> </div> `;
  });
  document.getElementById("galeri-list").innerHTML = html;
} // UPLOAD FOTO
async function uploadGaleri() {
  const fileInput = document.getElementById("gambar");
  const judul = document.getElementById("judul").value.trim();
  const file = fileInput.files[0];

  if (!file) {
    alert("Pilih foto!");
    return;
  }
  if (!judul) {
    alert("Judul foto harus diisi.");
    return;
  }

  const namaFile = Date.now() + "-" + file.name;
  const { data: uploadData, error: uploadError } = await client.storage
    .from("galeri")
    .upload(namaFile, file);

  if (uploadError) {
    console.error(uploadError);
    alert("Upload gagal: " + uploadError.message);
    return;
  }

  const { data: publicUrlData, error: publicUrlError } = await client.storage
    .from("galeri")
    .getPublicUrl(namaFile);

  if (publicUrlError) {
    console.error(publicUrlError);
    alert("Gagal mengambil URL publik: " + publicUrlError.message);
    return;
  }

  const imageUrl = publicUrlData?.publicUrl;
  if (!imageUrl) {
    alert("Gagal membuat URL publik untuk foto.");
    return;
  }

  const { error: insertError } = await client
    .from("galeri")
    .insert([{ gambar: imageUrl, judul }]);

  if (insertError) {
    console.error(insertError);
    alert("Gagal menyimpan data galeri: " + insertError.message);
    return;
  }

  alert("Galeri berhasil ditambahkan!");
  document.getElementById("judul").value = "";
  fileInput.value = "";
  getGaleri();
}

// DELETE
async function hapusGaleri(id) {
  const yakin = confirm("Hapus galeri?");
  if (!yakin) return;
  await client.from("galeri").delete().eq("id", id);
  getGaleri();
}
getGaleri();
