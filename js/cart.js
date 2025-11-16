document.addEventListener("DOMContentLoaded", function () {
  //dec. de var para costos
  let subtotal = document.getElementById("subtotal");
  let envio = document.getElementById("envio");
  let total = document.getElementById("total");
  //selección de tipo de envío
  const radiosEnvio = document.querySelectorAll('input[name="entrega"]');
  radiosEnvio.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "standard") {
        porcentajeEnvio = 0.05;
      } else if (this.value === "express") {
        porcentajeEnvio = 0.07;
      } else if (this.value === "premium") {
        porcentajeEnvio = 0.15;
      }
      displayProducts();
    });
  });

  const cards = document.getElementById("product-cart");
  let cant;
  let porcentajeEnvio = 0.0; // Costo por defecto
  function displayProducts() {
    const products = JSON.parse(localStorage.getItem("cart"));
    let contenedorTotal = document.getElementById("precioTotal");
    let totalGeneral = 0;
    cant = 0;
    if (contenedorTotal) {
      contenedorTotal.innerHTML = ` $ ${totalGeneral}`;
    }

    if (products && products.length > 0) {
      cards.innerHTML = "";

      products.forEach((producto, index) => {
        const actualProduct = document.createElement("div");
        actualProduct.className = "row align-items-center cart-box";

        let SubTotal = producto.cost * producto.count;
        totalGeneral += SubTotal;
        cant += producto.count;
        localStorage.setItem("cantMyCart", cant);

        actualProduct.innerHTML = `
            <div class="col-lg-2">
            <img src="${producto.image}" alt="${
          producto.name
        }" style="width:200px;"></img>
            </div>
            <div class="col-lg-10 d-flex gap-5">
            <h3 class="p-5">${producto.name}</h3>
            <p class="p-5">${producto.currency} ${producto.cost}</p>
            <div class="p-5">
            <button class="cart-btn btn-restar" data-id="${
              producto.id
            }">-</button>
            <span>Cantidad: ${producto.count}</span>
            <button class="cart-btn btn-sumar" data-id="${
              producto.id
            }">+</button>
            </div>
            <p class="p-5"> SubTotal $: ${producto.cost * producto.count}</p>
            </div>

             `;
        cards.appendChild(actualProduct);
      });

      let costoEnvio = Math.round(totalGeneral * porcentajeEnvio);
      let totalConEnvio = totalGeneral + costoEnvio;
      let porcentajeMostrar = (porcentajeEnvio * 100).toFixed(0);
      if (contenedorTotal) {
        contenedorTotal.innerHTML = `
                <p>Subtotal: $ ${totalGeneral}</p>
                <p>Envío (${porcentajeMostrar}%): $ ${costoEnvio}</p>
                <hr>
                <p><strong>Total: $ ${totalConEnvio}</strong></p>
            `;
      }

      //calculo de costos + envio
      if (subtotal) subtotal.textContent = `$ ${totalGeneral}`;
      if (envio) envio.textContent = `$ ${costoEnvio}`;
      if (total) total.textContent = `$ ${totalConEnvio}`;
    } else {
      cards.innerHTML = `<p> No hay productos en el carrito</p>`;
      if (contenedorTotal) {
        contenedorTotal.innerHTML = ` $ 0`;
      }
    }

    mostrarCantidad();
    actualizarBotonModal();
  }
  displayProducts();

  // agregar y quitar productos

  function sumar(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = cart.find((p) => p.id === productId);

    if (product) {
      product.count++;
      localStorage.setItem("cart", JSON.stringify(cart));
      displayProducts();
    }
  }

  function restar(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = cart.find((p) => p.id === productId);

    if (product) {
      product.count--;

      if (product.count <= 0) {
        cart = cart.filter((p) => p.id !== productId);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      displayProducts();
    }
  }

  //cantidad de productos en el carrito
  function mostrarCantidad() {
    let badge = document.getElementById("cantMyCart");

    if (badge) {
      const cant = localStorage.getItem("cantMyCart") || 0;
      badge.textContent = cant;
    }
  }

  //funcionalidad "Finalizar compra"
  let purchase = document.getElementById("purchase");

  //métodos de pago
  const botones = document.querySelectorAll(".opcion");
  const respuesta = document.getElementById("respuesta");
  const metodoDePago = document.getElementsByClassName("botonespago");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      botones.forEach((b) => b.classList.remove("seleccionado"));
      boton.classList.add("seleccionado");
      respuesta.value = boton.dataset.opcion;
    });
  });

  purchase.addEventListener("click", function () {
    //dirección
    let departamento = document.getElementById("dpt").value;
    let localidad = document.getElementById("localidad").value;
    let calle = document.getElementById("calle").value;
    let numero = document.getElementById("numero").value;
    let esquina = document.getElementById("esq").value;
    let verdadero =
      departamento != "" &&
      localidad != "" &&
      calle != "" &&
      numero != "" &&
      esquina != "";

    //tipo de envío
    const seleccionado = document.querySelector(
      'input[name="entrega"]:checked'
    );

    //validaciones
    if (
      verdadero &&
      seleccionado &&
      respuesta.value &&
      localStorage.getItem("cantMyCart") > 0
    ) {
      return Swal.fire({
        icon: "success",
        title: "¡Compra Finalizada!",
        text: "¡Muchas gracias por confiar en nuestra página!",
      });
    } else {
      return Swal.fire({
        icon: "error",
        title: "Error al finalizar compra",
        text: "Debe rellenar y seleccionar todos los campos solicitados",
      });
    }
  });

  // Event Delegation - escucha clicks en todos los botones del carrito
  cards.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-sumar")) {
      const productId = parseInt(e.target.dataset.id);
      sumar(productId);
    }

    if (e.target.classList.contains("btn-restar")) {
      const productId = parseInt(e.target.dataset.id);
      restar(productId);
    }
  });
  function toggleSection() {
    const content = document.getElementById("section-content");
    const arrow = document.getElementById("arrow");
    const isOpen = content.style.display === "flex";

    content.style.display = isOpen ? "none" : "flex";
    arrow.classList.toggle("rotate", !isOpen);
  }
  window.toggleSection = toggleSection;
  let myModal = document.getElementById("myModal");
  let myInput = document.getElementById("myInput");

  myModal.addEventListener("shown.bs.modal", () => {
    myInput.focus();
  });
  //Deshabilitar botón de comprar si el carrito está vacío
  function actualizarBotonModal() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cantProductos = cart.reduce(
      (acc, item) => acc + (item.count || 0),
      0
    );
    const botonModal = document.getElementById("botonModal");

    if (botonModal) {
      botonModal.disabled = cantProductos <= 0;
    }
  }
});
