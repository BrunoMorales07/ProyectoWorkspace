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
        })
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
                            
                            <button class="btn btn-lg btn-outline-dark flex-shrink-0 bg-danger mt-5" type="button" style="color:white">
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
      });
  };

  getJSONData(PRODUCTS_INFO_URL).then(function () {
    let arrayImages = document.getElementsByClassName("img-thumbnail");
    let main = document.getElementById("main-img");
    for (let index = 0; index < arrayImages.length; index++) {
      const image = arrayImages[index];
      image.addEventListener("click", function (e) {
        main.src = image.src;
      });
    }

    // Función para redirigir a producto relacionado.
       let arrayimgRelatedProduct = document.getElementsByClassName("imgRelatedProduct");
    for (let index = 0; index < arrayimgRelatedProduct.length; index++) {
      const imgRelatedProduct = arrayimgRelatedProduct[index];
      imgRelatedProduct.addEventListener("click", function (e) {
        localStorage.setItem("productID", imgRelatedProduct.id);
        location.href = "product-info.html";
      });
    }
  });

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
});

//pintado de estrellas
    const stars = document.querySelectorAll('.star');
    const rating = document.getElementById('rating');
    let actualRating = 0;

    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            actualRating = index + 1;
            rating.value = actualRating;
            
            stars.forEach((s, i) => {
                s.classList.remove('fas', 'far', 'active');
                
                if (i < actualRating) {
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.add('far');
                }
            });
        });

    });


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
      estrellas += `<span class="fa fa-star ${i <= score ? "" : "star-empty"}"></span>`;
    }
    return estrellas;
  }

  function cargarComentariosLocales() {
    const storedComments = JSON.parse(localStorage.getItem(commentsKey)) || [];
    if (!storedComments.length) return;

    storedComments.forEach((comment) => {
      const newComment = document.createElement("div");
      newComment.classList.add("comentario-box");
      newComment.innerHTML = `
        <div class="comentario-user">${comment.user}</div>
        <div class="comentario-date">${comment.date}</div>
        <div class="comentario-stars">${mostrarEstrellas(comment.rating)}</div>
        <div class="comentario-text">${comment.text}</div>
      `;
      contenedor.appendChild(newComment); 
    });
  }

  
  setTimeout(cargarComentariosLocales, 150);

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
      alert("Por favor, selecciona una calificación y escribe un comentario.");
      return;
    }

    const username = localStorage.getItem("usuario") || "Usuario anónimo";

    const fecha = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const fechaFormateada = `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;

    const newCommentData = {
      user: username,
      date: fechaFormateada,
      rating: ratingValue,
      text: commentText,
    };

    
    const storedComments = JSON.parse(localStorage.getItem(commentsKey)) || [];
    storedComments.push(newCommentData);
    localStorage.setItem(commentsKey, JSON.stringify(storedComments));

    
    const newComment = document.createElement("div");
    newComment.classList.add("comentario-box");
    newComment.innerHTML = `
      <div class="comentario-user">${username}</div>
      <div class="comentario-date">${fechaFormateada}</div>
      <div class="comentario-stars">${mostrarEstrellas(ratingValue)}</div>
      <div class="comentario-text">${commentText}</div>
    `;
    contenedor.appendChild(newComment);

    form.reset();
    selectedRating = 0;
    stars.forEach((s) => (s.style.color = ""));
  });
});
