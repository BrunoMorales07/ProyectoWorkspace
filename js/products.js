document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor");
  
  
  function mostrarProductos(products) {
    contenedor.innerHTML = "";
    products.forEach((producto) => {
      const elementoProducto = document.createElement("div");
      elementoProducto.classList.add("product");

      elementoProducto.innerHTML = `
                <img src="${producto.image}" alt="${producto.name}" class="imagen-producto">
                <div class="detalles-producto">
                    <h2 class="nombre-producto">${product.name}</h2>
                    <p class="precio-producto">${product.currency} ${producto.cost}</p>
                    <p class="descripcion-producto">${product.description}</p>
                    <p class="cantidad-vendida">Vendidos: ${product.soldCount}</p>
                </div>
            `;

      contenedor.appendChild(elementoProducto);
    });
  }

  fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("Error al obtener los datos de la API");
      }
      return respuesta.json();
    })
    .then((datos) => {
      mostrarProductos(datos.products);
    })
    .catch((error) => {
      console.error("Hubo un problema con la petición fetch:", error);
      contenedor.innerHTML = "<p>No se pudo cargar la lista de productos.</p>";
    });
});
