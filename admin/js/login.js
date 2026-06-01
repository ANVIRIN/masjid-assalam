async function loginAdmin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageEl = document.getElementById("message");
  messageEl.innerText = "";

  if (!email || !password) {
    messageEl.innerText = "Email dan password harus diisi.";
    return;
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    messageEl.innerText = error.message;
    return;
  }
  localStorage.setItem("admin_login", "true");
  window.location.href = "dashboard.html";
}
