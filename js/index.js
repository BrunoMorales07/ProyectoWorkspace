document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("autos").addEventListener("click", function () {
    localStorage.setItem("catID", 101);
    window.location = "products.html";
  });
  document.getElementById("juguetes").addEventListener("click", function () {
    localStorage.setItem("catID", 102);
    window.location = "products.html";
  });
  document.getElementById("muebles").addEventListener("click", function () {
    localStorage.setItem("catID", 103);
    window.location = "products.html";
  });
  const sesion = localStorage.getItem("sesionIniciada");

  if (sesion !== "true") {
    location.href = "login.html";
  }
  function actualizarContadorCarrito() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 1), 0);

    const contadorElemento = document.getElementById("cantMyCart");
    if (contadorElemento) {
      contadorElemento.textContent = totalItems;
    }
  }
  actualizarContadorCarrito();
});
