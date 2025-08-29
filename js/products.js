document.addEventListener('DOMContentLoaded', function() {
    
    const contenedor = document.getElementById('contenedor');
    contenedor.className = 'row';
    
    fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
        .then(response => {
            console.log("GET exitoso:", response.status);
            return response.json();
        })
        .then(data => {

    data.products.forEach(product => {
    const elementoProducto  = document.createElement('div');
    elementoProducto.className = 'col-lg-6 col-md-12  mb-4'; 
    
    elementoProducto.innerHTML = `
        <div class="card h-100" style=" border: 1px solid black;">
            <div class="card-header bg-danger text-white text-center">
                <h5 class="card-title mb-0 text-white fw-bold  py-2 rounded">${product.name}</h5>
            </div>
            <img src="${product.image}" 
                 class="card-img-top" 
                 alt="${product.name}" 
                 style="height: 200px; object-fit: cover; border-top: 2px solid red; border-bottom: 2px solid red;">
            <div class="card-body bg-light">
                <p class="card-text text-dark fw-bold">${product.description}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-danger fs-6 text-dark" style="border: 1px solid black;">
                        Precio: ${product.cost} ${product.currency}
                    </span>
                    <small class="text-dark fw-bold">Vendidos: ${product.soldCount}</small>
                </div>
            </div>
            <div class="card-footer bg-danger text-center" style="border-top: 2px solid black;">
                <button class="btn btn-outline-dark fw-bold" style="background-color: white;">
                    comprar
                </button>
            </div>
        </div>
    `;
    
    contenedor.appendChild(elementoProducto);
});

    
});
        })
        .catch(error => {
            console.error("Hubo un problema con la petición fetch:", error);
            contenedor.innerHTML = "<p>No se pudo cargar la lista de productos.</p>";
        });

  