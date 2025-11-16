document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("name");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const profileForm = document.getElementById("profile-form");
  const previewName = document.getElementById("previewName");
  const previewLastName = document.getElementById("previewLastName");
  const previewEmail = document.getElementById("previewEmail");
  const previewPhone = document.getElementById("previewPhone");

  const sesionIniciada = localStorage.getItem("sesionIniciada");
  //Cargar el Email guardado en Localstorage
  if (sesionIniciada === "true") {
    const usuarioActual = localStorage.getItem("usuario");
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const usuarioData = users.find((u) => u.user === usuarioActual);

    if (usuarioData) {
      emailInput.value = usuarioData.email;
      previewEmail.textContent = usuarioData.email;
      nameInput.value = usuarioData.name;
      previewName.textContent = usuarioData.name;
      lastNameInput.value = usuarioData.lastName;
      phoneInput.value = usuarioData.phone;
      previewPhone.textContent = usuarioData.phone;
    }
  }
  //Escribir los datos en tiempo real
  nameInput.addEventListener("input", function () {
    previewName.textContent = this.value || "Sin especificar";
  });

  lastNameInput.addEventListener("input", function () {
    previewLastName.textContent = this.value || "Sin especificar";
  });

  emailInput.addEventListener("input", function () {
    previewEmail.textContent = this.value;
  });

  phoneInput.addEventListener("input", function () {
    previewPhone.textContent = this.value || "Sin especificar";
  });

  // Capturar datos del formulario
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuarioActual = localStorage.getItem("usuario");

    if (!usuarioActual) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay usuario activo",
      });
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const usuarioIndex = users.findIndex((u) => u.user === usuarioActual);

    if (usuarioIndex !== -1) {
      users[usuarioIndex] = {
        ...users[usuarioIndex],
        name: nameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
      };

      localStorage.setItem("users", JSON.stringify(users));

      previewName.textContent = nameInput.value.trim() || "Sin especificar";
      previewLastName.textContent =
        lastNameInput.value.trim() || "Sin especificar";
      previewEmail.textContent = emailInput.value.trim();
      previewPhone.textContent = phoneInput.value.trim() || "Sin especificar";

      Swal.fire({
        icon: "success",
        title: "¡Perfil guardado!",
        text: "Tus datos se guardaron correctamente",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario no encontrado",
      });
    }
  });

  //Imagen del perfil
  const imageInput = document.getElementById("imageInput");
  const profileImage = document.getElementById("profileImage");
  const btnEliminar = document.getElementById("btnEliminarFoto");
  const fotoDefault = "img/default.png"; // poné la ruta que quieras

  let usuarioActual = localStorage.getItem("usuario");
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let usuarioData = users.find((u) => u.user === usuarioActual);

  // Si el usuario no existe, crearlo
  if (!usuarioData) {
    usuarioData = { user: usuarioActual };
    users.push(usuarioData);
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Si ya tiene foto guardada, mostrarla
  if (usuarioData.profileImage) {
    profileImage.src = usuarioData.profileImage;
    btnEliminar.classList.remove("oculto");
  }

  // Abrir el input cuando tocan el icono del lápiz (label)
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Archivo inválido",
        text: "Por favor selecciona una imagen",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Imagen muy grande",
        text: "La imagen debe ser menor a 2MB",
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const base64 = event.target.result;
      profileImage.src = base64;

      usuarioData.profileImage = base64;
      localStorage.setItem("users", JSON.stringify(users));

      btnEliminar.classList.remove("oculto");

      Swal.fire({
        icon: "success",
        title: "¡Foto actualizada!",
        timer: 1500,
        showConfirmButton: false,
      });
    };

    reader.readAsDataURL(file);
  });

  // Eliminar foto
  btnEliminar.addEventListener("click", function () {
    Swal.fire({
      title: "¿Eliminar foto de perfil?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        profileImage.src = fotoDefault;

        delete usuarioData.profileImage;
        localStorage.setItem("users", JSON.stringify(users));

        btnEliminar.classList.add("oculto");
        imageInput.value = "";

        Swal.fire({
          icon: "success",
          title: "Foto eliminada",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  });
});
