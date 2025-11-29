function showAlertError() {
  document.getElementById("alert-danger").classList.add("show");
}

let boton = document.getElementById("boton");

boton.addEventListener("click", function () {
  let usuario = document.getElementById("user").value.trim();
  let password = document.getElementById("password").value.trim();

  if (usuario === "" || password === "") {
    showAlertError();
    return;
  }
  localStorage.setItem("sesionIniciada", "true");
  localStorage.setItem("usuario", usuario);
  localStorage.setItem("password", password);
  localStorage.setItem("usuario_id", usuario.id);

  location.href = "index.html";
});
//cambio de tema
function toggleTheme() {
  let html = document.documentElement;
  let currentTheme = html.getAttribute("data-theme");
  let newTheme = currentTheme === "dark" ? "light" : "dark";

  html.setAttribute("data-theme", newTheme);

  let icon = document.getElementById("theme-icon");
  if (newTheme === "dark") {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }

  localStorage.setItem("theme", newTheme);

  document.querySelectorAll(".card").forEach((card) => {
    card - body.toggle("dark-card");
    card - text.toggle("text-white");
  });

  let savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}
