document.addEventListener('DOMContentLoaded',function(){

const cards =document.getElementById('product-cart');

function displayProducts (){
    const products = JSON.parse(localStorage.getItem('cart'));
    let contenedorTotal= document.getElementById('precioTotal');
    let totalGeneral = 0

    if(products && products.length >0){
        cards.innerHTML='';

        products.forEach((producto, index) => {
            const actualProduct = document.createElement('div');
            actualProduct.className='row align-items-center cart-box';

            let SubTotal = producto.cost * producto.count;
            totalGeneral += SubTotal;

            actualProduct.innerHTML= `
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

        if(contenedorTotal){
            contenedorTotal.innerHTML = ` $ ${totalGeneral}`;
        }

        

    }else{
        cards.innerHTML=`<p> No hay productos en el carrito</p>`
    }
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
});