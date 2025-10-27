document.addEventListener("DOMContentLoaded", function () {
  const productID = localStorage.getItem("productID");
  const PRODUCTS_INFO_URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

  const contenedor = document.getElementById("contenedor");

  let showSpinner = function () {
    document.getElementById("spinner-wrapper").style.display = "block";
  };

  let hideSpinner = function () {
    document.getElementById("spinner-wrapper").style.display = "none";
  };
  let getJSONData = function (url) {
    showSpinner();
    return fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then(function (response) {
        const productDetails = response;
        let relatedProductsImages = " ";
        productDetails.relatedProducts.forEach((relatedProduct) => {
          relatedProductsImages += `<div class="col-12 col-sm-6 col-lg-3 col-md-4 px-2">
                        <img src="${relatedProduct.image}" style="max-width: 100%; cursor:pointer" alt="..." class="imgRelatedProduct" id="${relatedProduct.id}">
                        <p class="text-danger text-center"> ${relatedProduct.name}</p>
                    </div>`;
        });
        let productImages = " ";
        for (let index = 0; index < productDetails.images.length; index++) {
          productImages += `<div class="col px-1">
                        <img src="${productDetails.images[index]}" class="img-thumbnail imgProduct" alt="...">
                    </div>`;
        }
        const infoProducto = document.getElementById("contenedor");
        infoProducto.innerHTML = ` 
                     <section class="py-0" id="product-info-container">
            <div class="container px-4 px-lg-5 my-5">
                <div class="row gx-4 gx-lg-5">
                    <div class="col-md-6">
                        <h1 class="display-5 fw-bolder text-danger mb-4 d-block d-md-none">${productDetails.name}</h1>
                        <img class="card-img-top mb-0" src="${productDetails.images[0]}" alt="..." id="main-img" />

                            <div class="row align-items-center pt-4">
                                ${productImages}                        
                            </div>
                            

                    </div>
                    <div class="col-md-6">
                        <h1 class="display-5 fw-bolder text-danger mb-4 d-none d-md-block">${productDetails.name}</h1>
                        <div class="fs-5 mb-2">
                             <p><strong>Categoria:</strong> ${productDetails.category}</p>
                        </div>
                        <p class="mb-0"><strong>Descripción</strong></p>
                        <p class="lead" >${productDetails.description}</p>
                        <p><strong>Vendidos Total:</strong> ${productDetails.soldCount}</p>
                        <h4><strong>Precio:  ${productDetails.currency}${productDetails.cost}<strong></h4>
                        <div class="d-flex">
                            
                            <button class="btn btn-lg btn-outline-dark flex-shrink-0 bg-danger mt-5" type="button" style="color:white" id="btnComprar">
                                COMPRAR
                            </button>
                        </div>
                    </div>
                </div>
                    <div>
                       <h4 class="mt-3">Productos Relacionados</h4>
                          <div class="row align-items-center pt-4">
                              ${relatedProductsImages}
                          </div>
                    </div>
            </div>
        </section>`;

        hideSpinner();

        return response;
      });
  };

  getJSONData(PRODUCTS_INFO_URL).then(function (response) {
    let arrayImages = document.getElementsByClassName("img-thumbnail");
    let main = document.getElementById("main-img");
    for (let index = 0; index < arrayImages.length; index++) {
      const image = arrayImages[index];
      image.addEventListener("click", function (e) {
        main.src = image.src;
      });
    }

    // Función para redirigir a producto relacionado.
    let arrayimgRelatedProduct =
      document.getElementsByClassName("imgRelatedProduct");
    for (let index = 0; index < arrayimgRelatedProduct.length; index++) {
      const imgRelatedProduct = arrayimgRelatedProduct[index];
      imgRelatedProduct.addEventListener("click", function (e) {
        localStorage.setItem("productID", imgRelatedProduct.id);
        location.href = "product-info.html";
      });
    }

    //Funcion para comprar
    const btnComprar = document.getElementById("btnComprar");
    btnComprar.addEventListener("click", function () {
      // Guardar info en localStorage
      const producto = {
        id: response.id,
        name: response.name,
        cost: response.cost,
        count: 1,
        currency: response.currency,
        image: response.images[0],
      };

      // carrito actual o crear uno nuevo
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Verificar si el producto ya existe en el carrito
      const productoExistente = cart.findIndex(
        (item) => item.id === producto.id
      );

      if (productoExistente !== -1) {
        // Si existe, aumentar la cantidad
        cart[productoExistente].count += 1;
      } else {
        // Si no existe, agregarlo al carrito
        cart.push(producto);
      }

      // Guardar el carrito actualizado
      localStorage.setItem("cart", JSON.stringify(cart));

      // Navegar a cart.html
      window.location.href = "cart.html";
    });
  });

  // Boton volver atras
  let boton = document.getElementById("btnBack");
  boton.addEventListener("click", function () {
    history.back();
  });

  // Funcion mostrar comentarios
  const API_URL = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

  function mostrarEstrellas(score) {
    let estrellas = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= score) {
        estrellas += '<span class="fa fa-star"></span>';
      } else {
        estrellas += '<span class="fa fa-star star-empty"></span>';
      }
    }
    return estrellas;
  }
  // Cargar y mostrar
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const contenedor = document.getElementById("contenedor_comments");
      // verificar si no hay comentarios
      if (data.length === 0) {
        contenedor.innerHTML = "<p>No hay comentarios todavía</p>";
        return;
      }
      let html = "";

      data.forEach((comentario) => {
        html += `
                    <div class="comentario-box">
                        <div class="comentario-user">${comentario.user}</div>
                        <div class="comentario-date">${
                          comentario.dateTime
                        }</div>
                        <div class="comentario-stars">${mostrarEstrellas(
                          comentario.score
                        )}</div>
                        <div class="comentario-text">${
                          comentario.description
                        }</div>
                    </div>
                `;
      });

      document.getElementById("contenedor_comments").innerHTML = html;
    })
    .catch((error) => {
      document.getElementById("contenedor_comments").innerHTML =
        "<p>Error al cargar comentarios</p>";
      console.error("Error:", error);
    });

  //pintado de estrellas
  const stars = document.querySelectorAll(".star");
  const rating = document.getElementById("rating");
  let actualRating = 0;

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      actualRating = index + 1;
      rating.value = actualRating;

      stars.forEach((s, i) => {
        s.classList.remove("fas", "far", "active");

        if (i < actualRating) {
          s.classList.add("fas", "active");
        } else {
          s.classList.add("far");
        }
      });
    });
  });

  let data = [];

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reviewForm");
    const contenedor = document.getElementById("contenedor_comments");
    const stars = document.querySelectorAll(".fa-star");
    const ratingInput = document.getElementById("rating");

    const productId = localStorage.getItem("productID") || "default";
    const commentsKey = `comments_${productId}`;

    function mostrarEstrellas(score) {
      let estrellas = "";
      for (let i = 1; i <= 5; i++) {
        estrellas += `<span class="fa fa-star ${
          i <= score ? "" : "star-empty"
        }"></span>`;
      }
      return estrellas;
    }

    function cargarComentarios() {
      fetch(
        `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`
      )
        .then((response) => response.json())
        .then((apiComments) => {
          const storedComments =
            JSON.parse(localStorage.getItem(commentsKey)) || [];

          data = apiComments.concat(storedComments);
          if (data.length === 0) {
            contenedor.innerHTML = "<p>No hay comentarios todavía</p>";
          } else {
            renderComentarios();
          }
        })
        .catch((error) => {
          contenedor.innerHTML = "<p>Error al cargar comentarios</p>";
          console.error("Error:", error);
        });
    }
    function renderComentarios() {
      let html = "";

      data.forEach((comentario) => {
        html += `
        <div class="comentario-box">
          <div class="comentario-user">${comentario.user}</div>
          <div class="comentario-date">${
            comentario.dateTime || comentario.date
          }</div>
          <div class="comentario-stars">${mostrarEstrellas(
            comentario.score || comentario.rating
          )}</div>
          <div class="comentario-text">${
            comentario.description || comentario.text
          }</div>
        </div>
      `;
      });

      contenedor.innerHTML = html;
    }

    cargarComentarios();

    let selectedRating = 0;
    stars.forEach((star, index) => {
      star.addEventListener("click", () => {
        selectedRating = index + 1;
        ratingInput.value = selectedRating;
        stars.forEach((s, i) => {
          s.classList.toggle("checked", i < selectedRating);
          s.style.color = i < selectedRating ? "gold" : "";
        });
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const commentText = document.getElementById("comments").value.trim();
      const ratingValue = parseInt(ratingInput.value);

      if (!commentText || !ratingValue) {
        alert(
          "Por favor, selecciona una calificación y escribe un comentario."
        );
        return;
      }

      const username = localStorage.getItem("usuario") || "Usuario anónimo";

      const fecha = new Date();
      const pad = (n) => n.toString().padStart(2, "0");
      const fechaFormateada = `${fecha.getFullYear()}-${pad(
        fecha.getMonth() + 1
      )}-${pad(fecha.getDate())} ${pad(fecha.getHours())}:${pad(
        fecha.getMinutes()
      )}:${pad(fecha.getSeconds())}`;

      const nuevoComentario = {
        user: username,
        date: fechaFormateada,
        rating: ratingValue,
        text: commentText,
      };

      data.push(nuevoComentario);

      const storedComments =
        JSON.parse(localStorage.getItem(commentsKey)) || [];
      storedComments.push(nuevoComentario);
      localStorage.setItem(commentsKey, JSON.stringify(storedComments));

      renderComentarios();

      form.reset();
      selectedRating = 0;
      stars.forEach((s) => (s.style.color = ""));
    });
  });
});
