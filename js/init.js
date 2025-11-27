const CATEGORIES_URL = "http://localhost:3000/cats";
const PUBLISH_PRODUCT_URL =
  "http://localhost:3000/sell";
const PRODUCTS_URL = "http://localhost:3000/cats_products";
const PRODUCT_INFO_URL = "http://localhost:3000/products";
const PRODUCT_INFO_COMMENTS_URL =
  "http://localhost:3000/products_comments/";
const CART_INFO_URL = "http://localhost:3000/user_cart/";
const CART_BUY_URL = "http://localhost:3000/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let usuario = localStorage.getItem("usuario");
if (usuario) {
  document.getElementById("verUser").textContent = usuario;
}

let cant = localStorage.getItem("cantMyCart");
if (cant >= 0) {
  let cantMyCart = document.getElementById("cantMyCart");
  cantMyCart.textContent = cant;
}

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
//Función para cambiar tema
function toggleTheme() {
  let html = document.documentElement;
  let currentTheme = html.getAttribute("data-theme");
  let newTheme = currentTheme === "dark" ? "light" : "dark";

  html.setAttribute("data-theme", newTheme);

  let icon = document.getElementById("theme-icon");
  if (newTheme === "dark") {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }

  localStorage.setItem("theme", newTheme);

  document.querySelectorAll(".card").forEach((card) => {
    card - body.toggle("dark-card");
    card - text.toggle("text-white");
  });
}

let savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
