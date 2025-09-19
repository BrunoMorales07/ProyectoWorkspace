document.addEventListener("DOMContentLoaded", function () {
  //Agregamos el catID del localStorage
  const categoriaID = localStorage.getItem("catID");
  //Almacenamos la URL
  const PRODUCTS_URL = `https://japceibal.github.io/emercado-api/cats_products/${categoriaID}.json`;

  const contenedor = document.getElementById("contenedor");
  contenedor.className = "row";

  let productosArray = [];
  let currentSortCriteria = undefined;

  // Spinner functions
  let showSpinner = function () {
    document.getElementById("spinner-wrapper").style.display = "block";
  };

  let hideSpinner = function () {
    document.getElementById("spinner-wrapper").style.display = "none";
  };

  // Fetch products
  let getJSONData = function (url) {
    let result = {};
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
        result.status = "ok";
        result.data = response;
        productosArray = response.products || [];
        showProductsList(productosArray);
        hideSpinner();
        return result;
      })
      .catch(function (error) {
        result.status = "error";
        result.data = error;
        hideSpinner();
        return result;
      });
  };

  function showProductsList(array) {
    contenedor.innerHTML = "";
    array.forEach((product) => {
      const elementoProducto = document.createElement("div");
      elementoProducto.className = "col-lg-4 col-md-6 col-sm-12  mb-4";
      elementoProducto.innerHTML = `
                <div class="card h-100 rounded-4 card-efect " style=" border: 1px solid black;">
                    <div class="card-header text-white text-center" style="background: var(--red-gradient);">
                        <h5 class="card-title mb-0 text-white fw-bold  py-2 rounded fs-4">${product.name}</h5>
                    </div>
                    <img src="${product.image}" 
                         class="card-img-top" 
                         alt="${product.name}" 
                         style="height: 200px; object-fit: cover; border-top: 2px solid red; border-bottom: 2px solid red;">
                    <div class="card-body bg-light">
                        <p class="card-text text-dark fw-bold">${product.description}</p>
                        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center">
                            <span class="badge fs-6 text-white" style=" background:var(--red-gradient); border: 1px solid black;">
                              Precio: ${product.cost} ${product.currency}
                            </span>
                            <small class="text-dark fw-bold">Vendidos: ${product.soldCount}</small>
                        </div>
                    </div>
                    <div class="card-footer text-center" style="background:transparent;">
                        <button class="fw-bold btnProducts show-btn"  id="${product.id}">
                            Ver Mas
                        </button>
                    </div>
                </div>
            `;
      contenedor.appendChild(elementoProducto);
    });

    
  }

  function sortProducts(criteria, array) {
    let result = [];
    if (criteria === "AZ") {
      result = array.slice().sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === "ZA") {
      result = array.slice().sort((a, b) => b.name.localeCompare(a.name));
    } else if (criteria === "Precio") {
      result = array.slice().sort((a, b) => b.cost - a.cost);
    }
    return result;
  }

  function sortAndShowProducts(sortCriteria) {
    currentSortCriteria = sortCriteria;
    productosArray = sortProducts(currentSortCriteria, productosArray);
    showProductsList(productosArray);
  }

  document.getElementById("sortAsc").addEventListener("click", function () {
    sortAndShowProducts("AZ");
  });

  document.getElementById("sortDesc").addEventListener("click", function () {
    sortAndShowProducts("ZA");
  });

  document.getElementById("sortByCount").addEventListener("click", function () {
    sortAndShowProducts("Precio");
  });

  document
    .getElementById("rangeFilterCount")
    .addEventListener("click", function () {
      let min = document.getElementById("rangeFilterCountMin").value;
      let max = document.getElementById("rangeFilterCountMax").value;

      if (min != undefined && min != "" && parseInt(min) >= 0) {
        min = parseInt(min);
      } else {
        min = undefined;
      }

      if (max != undefined && max != "" && parseInt(max) >= 0) {
        max = parseInt(max);
      } else {
        max = undefined;
      }

      let filtrados = productosArray.filter((product) => {
        return (
          (min == undefined || product.cost >= min) &&
          (max == undefined || product.cost <= max)
        );
      });

      showProductsList(filtrados);
    });

  document
    .getElementById("clearRangeFilter")
    .addEventListener("click", function () {
      document.getElementById("rangeFilterCountMin").value = "";
      document.getElementById("rangeFilterCountMax").value = "";
      showProductsList(productosArray);
    });
  document.getElementById("searchInput").addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const filtrados = productosArray.filter((product) => {
      const nombre = product.name.toLowerCase();
      const descripcion = product.description.toLowerCase();
      return nombre.includes(query) || descripcion.includes(query);
    });
    showProductsList(filtrados);
  });
  document.getElementById("clearSearch").addEventListener("click", function () {
    // Limpiar el campo de búsqueda
    document.getElementById("searchInput").value = "";
    showProductsList(productosArray);
  });
  getJSONData(PRODUCTS_URL).then(function() {
    let arrayButtons = document.getElementsByClassName("btnProducts");
    for (let index = 0; index < arrayButtons.length; index++) {
      const button = arrayButtons[index];
      button.addEventListener("click", function (e) {
        localStorage.setItem("productID", button.id);
        location.href = "product-info.html";
      });
    }
  });
});
