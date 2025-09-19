document.addEventListener('DOMContentLoaded', function () {

    const productID = localStorage.getItem('productID');
    const PRODUCTS_INFO_URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

    const contenedor = document.getElementById('contenedor');

    let showSpinner = function () {
        document.getElementById("spinner-wrapper").style.display = "block";
    }

    let hideSpinner = function () {
        document.getElementById("spinner-wrapper").style.display = "none";
    }
    let getJSONData = function (url) {
        showSpinner();
        return fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(function (response) {

                const productDetails = response;
                let productImages = " ";
                for (let index = 0; index < productDetails.images.length; index++) {

                    productImages += `<div class="col px-1">
                        <img src="${productDetails.images[index]}" class="img-thumbnail" alt="...">
                    </div>`
                }
                const infoProducto = document.getElementById('contenedor');
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
                        <p><strong>Precio:  ${productDetails.currency}${productDetails.cost}<strong></p>
                        <div class="d-flex">
                            
                            <button class="btn btn-lg btn-outline-dark flex-shrink-0 bg-danger mt-5" type="button" style="color:white">
                                COMPRAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;

                hideSpinner();
            });


    }

    getJSONData(PRODUCTS_INFO_URL).then(function () {
        let arrayImages = document.getElementsByClassName('img-thumbnail');
        let main = document.getElementById('main-img');
        for (let index = 0; index < arrayImages.length; index++) {
            const image = arrayImages[index];
            image.addEventListener('click', function (e) {
                main.src = image.src;

            })
        }
    })

    let boton = document.getElementById('btnBack');
    boton.addEventListener('click', function () {
        location.href = "products.html"
    })


})