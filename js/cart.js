document.addEventListener('DOMContentLoaded', function () {

    const cards = document.getElementById('product-cart');
    let cant;
    localStorage.setItem("cantMyCart", 0);

    function displayProducts() {
        const products = JSON.parse(localStorage.getItem('cart'));
        let contenedorTotal = document.getElementById('precioTotal');
        let totalGeneral = 0;
        cant = 0;
        localStorage.setItem("cantMyCart", cant);
        if (contenedorTotal) {
            contenedorTotal.innerHTML = ` $ ${totalGeneral}`;
        }

        if (products && products.length > 0) {
            cards.innerHTML = '';

            products.forEach((producto, index) => {
                const actualProduct = document.createElement('div');
                actualProduct.className = 'row align-items-center cart-box';

                let SubTotal = producto.cost * producto.count;
                totalGeneral += SubTotal;
                cant += producto.count;
                localStorage.setItem("cantMyCart", cant);


                actualProduct.innerHTML = `
            <div class="col-lg-2">
            <img src="${producto.image}" alt="${producto.name}" style="width:200px;"></img>
            </div>
            <div class="col-lg-10 d-flex gap-5">
            <h3 class="p-5">${producto.name}</h3>
            <p class="p-5">${producto.currency} ${producto.cost}</p>
            <div class="p-5">
            <button class="cart-btn btn-restar" data-id="${producto.id}">-</button>
            <span>Cantidad: ${producto.count}</span>
            <button class="cart-btn btn-sumar" data-id="${producto.id}">+</button>
            </div>
            <p class="p-5"> SubTotal $: ${producto.cost * producto.count}</p>
            </div>

             `;
                cards.appendChild(actualProduct);
            });

            if (contenedorTotal) {
                contenedorTotal.innerHTML = ` $ ${totalGeneral}`;
            }



        } else {
            cards.innerHTML = `<p> No hay productos en el carrito</p>`
        }
        mostrarCantidad();
    };

    displayProducts();


    // agregar y quitar productos

    function sumar(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = cart.find(p => p.id === productId);

        if (product) {

            product.count++;
            localStorage.setItem('cart', JSON.stringify(cart));
            displayProducts();

        }
    }

    function restar(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = cart.find(p => p.id === productId);

        if (product) {
            product.count--;

            if (product.count <= 0) {
                cart = cart.filter(p => p.id !== productId);

            }

            localStorage.setItem('cart', JSON.stringify(cart));
            displayProducts();


        }
    }

    //cantidad de productos en el carrito
    function mostrarCantidad() {
        let cantMyCart = document.getElementById('cantMyCart');
        cantMyCart.innerHTML = cant;

    }

    // Event Delegation - escucha clicks en todos los botones del carrito
    cards.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-sumar')) {
            const productId = parseInt(e.target.dataset.id);
            sumar(productId);
        }

        if (e.target.classList.contains('btn-restar')) {
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
let myModal = document.getElementById('myModal')
let myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
});

});